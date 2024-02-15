import {
  sendFieldExtensionMessage,
  type Message,
  type UpdateStyleMessage,
  type PostDataMessage,
} from "microcms-field-extension-api";
import type { DriveItem } from "@microsoft/microsoft-graph-types";
import {
  zUploadedFileListMap,
  type UploadedFileListMapMessage,
  type UploadedFileList,
} from "../types/microcms";
import { getAssetsManifests, type ArrayElem } from "../constants";

export class ParentController {
  public id: string;
  public origin: string;

  constructor(public initEvent: typeof window.microcmsIframeInitEvent) {
    this.id = initEvent.data.id;
    this.origin = initEvent.origin;
  }

  private readonly postMessage = window.parent.postMessage.bind(window.parent);

  public getDefaultData(): UploadedFileListMapMessage | undefined {
    if (this.initEvent.data == null) {
      throw new Error("Default data is not found");
    }
    return this.initEvent.data.message as UploadedFileListMapMessage;
  }

  public combineUrlWith(targetPath: string): string {
    return [this.origin, "apis", targetPath].join("/");
  }

  public updateStyle(style: UpdateStyleMessage["message"]): void {
    const data = {
      id: this.id,
      action: "MICROCMS_UPDATE_STYLE",
      message: style,
    } as const satisfies UpdateStyleMessage;
    this.postMessage(data, this.origin);
  }

  public postData<T>(message: Message<T>): void {
    const data = {
      id: this.id,
      action: "MICROCMS_POST_DATA",
      message,
    } as const satisfies PostDataMessage<T>;

    sendFieldExtensionMessage(data, this.origin);
  }
}

export function driveItem2UploadedFile(
  key: string,
  driveItem: DriveItem,
): ArrayElem<UploadedFileList> {
  const { name, size, fileSystemInfo, file, webUrl } = driveItem;
  const { from, to } = getAssetsManifests().upload[key].assetsUrl;

  return zUploadedFileListMap.shape.fileList._def.type.parse({
    name,
    size,
    fileSystemInfo: {
      createdDateTime: fileSystemInfo?.createdDateTime,
      lastModifiedDateTime: fileSystemInfo?.lastModifiedDateTime,
      mimeType: file?.mimeType,
    },
    webUrl: webUrl?.replace(from, to),
  });
}
