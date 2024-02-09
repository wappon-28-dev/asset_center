import type { DriveItem } from "@microsoft/microsoft-graph-types";

export type UploadedFileListMapMessage = {
  id: string;
  title: string;
  updatedAt: Date;
  data: {
    targetPath: string;
    fileList: DriveItem[];
  };
};
