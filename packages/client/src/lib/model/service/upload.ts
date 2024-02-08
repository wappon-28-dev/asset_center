import {
  FileUpload,
  LargeFileUploadTask,
  Client,
  type LargeFileUploadTaskOptions,
} from "@microsoft/microsoft-graph-client";
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
  (key: string, targetPath: string): ProcessServerConfigFunction =>
  (fieldName, file, _, load, error, progress, abort) => {
    console.log(`Called process fn: #${fieldName}; to upload ${file.name}`);

    const filePath = [targetPath, file.name].join("/");

    void getUploadUrl(key, filePath).then(({ url, isCancelled, expiry }) => {
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

      uploadTask
        .upload()
        .then((result) => {
          console.log("Uploaded successfully");

          load(result);
          console.log(result);

          return {
            abort: () => {
              void uploadTask.cancel();
              console.log("abort");
              abort();
            },
          };
        })
        .catch((e) => {
          error(e);
          abort();
          throw e;
        });
    });
  };

export const getServerConfig = (
  key: string,
  targetPath: string,
): FilePondServerConfigProps["server"] => ({
  process: getHandleProcess(key, targetPath),
});
