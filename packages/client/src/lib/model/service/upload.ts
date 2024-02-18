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
import { get, writable } from "svelte/store";
import { PUBLIC_BASE_ORIGIN } from "$env/static/public";
import { getAssetsManifests, getAuthHeader } from "../constants";
import { client } from "./client";

// FIXME: なぜか引数渡しだと undefined になる.
// workaround: svelte store として公開.
export const uploadManifestKey = writable<string | undefined>(undefined);
export const uploadManifestTargetPath = writable<string | undefined>(undefined);

const api = client.v1.assets[":key"].item.$post;

async function getUploadUrl(
  key: string,
  filePath: string,
): Promise<InferResponseType<typeof api>> {
  const { basePath } = getAssetsManifests().upload[key];
  const encodedFilePath = encodeURIComponent([basePath, filePath].join("/"));

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
  (onUploaded: (driveItem: DriveItem) => void): ProcessServerConfigFunction =>
  (fieldName, file, _, load, error, progress, abort) => {
    const key = get(uploadManifestKey);
    const targetPath = get(uploadManifestTargetPath);

    if (key == null || targetPath == null) {
      throw new Error("Key or targetPath is not set");
    }

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
  onUploaded: Parameters<typeof getHandleProcess>["0"],
): FilePondServerConfigProps["server"] => ({
  process: getHandleProcess(onUploaded),
});
