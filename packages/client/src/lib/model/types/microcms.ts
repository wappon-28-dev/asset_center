import type { DriveItem } from "@microsoft/microsoft-graph-types";

export type UploadedData = {
  id: string;
  title: "アップロードされたファイル";
  description: string;
  updatedAt: Date;
  data: DriveItem[];
};
