import { z } from "zod";

export const zUploadedFileListMap = z.object({
  targetPath: z.string(),
  fileList: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      webUrl: z.string(),
      fileSystemInfo: z.object({
        mimeType: z.string(),
        createdDateTime: z.string(),
        lastModifiedDateTime: z.string(),
      }),
    }),
  ),
});

export type UploadedFileListMap = z.infer<typeof zUploadedFileListMap>;

export type UploadedFileList = z.infer<typeof zUploadedFileListMap>["fileList"];

export type UploadedFileListMapMessage = {
  id: string;
  title: string;
  updatedAt: Date;
  data: UploadedFileListMap;
};
