import {
  FileUpload,
  LargeFileUploadTask,
  Client,
  type LargeFileUploadTaskOptions,
} from "@microsoft/microsoft-graph-client";
import type { DriveItem } from "@microsoft/microsoft-graph-types";
import type {
  FilePondServerConfigProps,
  ProcessServerConfigFunction,
} from "filepond";
import type { InferResponseType } from "hono";
import { PUBLIC_BASE_ORIGIN } from "$env/static/public";
import { getAuthHeader } from "../constants";
import { client } from "./client";

const api = client.v1.assets[":key"].item.$post;

async function getUploadUrl(
  key: string,
  filePath: string,
): Promise<InferResponseType<typeof api>> {
  const encodedFilePath = encodeURIComponent(filePath);

  const res = await api(
    {
      param: { key },
      // @ts-expect-error: hoge
      query: { filePath: encodedFilePath },
    },
    {
      headers: {
        authorization: getAuthHeader("upload", key),
        referer: PUBLIC_BASE_ORIGIN,
        "content-type": "application/json",
      },
    },
  );

  if (!res.ok) throw new Error("Failed to upload a file");

  return await res.json();
}

const getHandleProcess =
  (
    key: string,
    targetPath: string,
    onUploaded: (driveItem: DriveItem) => void,
  ): ProcessServerConfigFunction =>
  (fieldName, file, _, load, error, progress, abort) => {
    console.log(
      `Called process fn: #${fieldName} to upload ${file.name} with ${key} to ${targetPath}`,
    );

    const filePath = [targetPath, file.name].join("/");

    void (async () => {
      const { url, isCancelled, expiry } = await getUploadUrl(
        key,
        filePath,
      ).catch((e) => {
        error(e);
        throw e;
      });

      console.log(`Requested upload URL`);
      const fileUpload = new FileUpload(file, file.name, file.size);
      console.log(fileUpload);

      const options: LargeFileUploadTaskOptions = {
        uploadEventHandlers: {
          extraCallbackParam: 300,
          progress: (range) => {
            console.log(
              `Uploaded bytes ${range?.minValue} to ${range?.maxValue}`,
            );
            progress(true, range?.minValue ?? 0, range?.maxValue ?? 0);
          },
        },
      };

      const uploadTask = new LargeFileUploadTask(
        Client.init({ authProvider: () => "" }),
        fileUpload,
        {
          url,
          expiry: new Date(expiry),
          isCancelled,
        },
        options,
      );

      const result = await uploadTask.upload().catch((e) => {
        error(e);
        throw e;
      });

      console.log("Uploaded successfully");

      load(result);
      console.log(result);
      onUploaded(result.responseBody as DriveItem);

      return {
        abort: () => {
          void uploadTask.cancel();
          console.log("abort");
          abort();
        },
      };
    })();
  };

export const getServerConfig = (
  key: string,
  targetPath: string,
  onUploaded: Parameters<typeof getHandleProcess>["2"],
): FilePondServerConfigProps["server"] => ({
  process: getHandleProcess(key, targetPath, onUploaded),
});
