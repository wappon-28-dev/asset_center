<script lang="ts">
  import { onMount, type ComponentProps } from "svelte";
  import Textfield from "@smui/textfield";
  import { z } from "zod";
  import HelperText from "@smui/textfield/helper-text";
  import type { GetDefaultDataMessage } from "microcms-field-extension-api";
  import LinearProgress from "@smui/linear-progress";
  import { isLoading } from "$lib/model/store";
  import DragAndDrop from "$lib/components/DragAndDrop.svelte";
  import {
    ParentController,
    driveItem2UploadedFile,
  } from "$lib/model/service/microcms";
  import { goto } from "$app/navigation";
  import UploadedFileListComp from "$lib/components/UploadedFileList.svelte";
  import type {
    UploadedFileList,
    UploadedFileListMapMessage,
  } from "$lib/model/types/microcms";
  import { pushSnackbar } from "$lib/components/kitchen";
  import type { ArrayElem } from "$lib/model/constants";

  let parentUrl: string;
  let lockParentUrl = false;

  let controller: ParentController;

  let validateStatus:
    | "PASSED"
    | "INVALID_URL"
    | "NOT_MICROCMS_URL"
    | "UNDEFINED_CONTENT_ID";
  let isValid = false;

  let key: string;
  let targetPath: string;

  let uploadedFileListMap: UploadedFileListMapMessage["data"] | undefined;

  $: {
    if (!z.string().url().safeParse(parentUrl).success) {
      validateStatus = "INVALID_URL";
    } else if (!parentUrl.startsWith(`${controller.origin}/apis/`)) {
      validateStatus = "NOT_MICROCMS_URL";
    } else if (parentUrl.endsWith("/create")) {
      validateStatus = "UNDEFINED_CONTENT_ID";
    } else {
      validateStatus = "PASSED";
    }
    isValid = validateStatus === "PASSED";

    if (isValid) {
      targetPath = new URL(parentUrl).pathname.replace("/apis/", "");
      [key] = new URL(parentUrl).hostname.split(".");
    }
  }

  function handleEvent(initEvent: GetDefaultDataMessage): void {
    window.removeEventListener("message", handleEvent);

    const isInMicrocms =
      initEvent != null &&
      initEvent.data.action === "MICROCMS_GET_DEFAULT_DATA";

    if (!isInMicrocms) {
      void goto("/").then(() => {
        pushSnackbar({
          label:
            "🚫 このページは microCMS で開く必要があります; トップページへリダイレクトしました.",
        });
        throw new Error(
          "`initEvent` doesn't contain `user` attribute; `window` is not in microCMS iframe.",
        );
      });
      return;
    }

    controller = new ParentController(initEvent);
    console.log("controller =>", controller);
    controller.updateStyle({
      height: 700,
      width: "100%",
    });

    const uploadedFileListData = controller.getDefaultData();
    if (uploadedFileListData != null) {
      uploadedFileListMap = uploadedFileListData.data;
      parentUrl = controller.combineUrlWith(uploadedFileListMap.targetPath);
      [key] = new URL(parentUrl).hostname.split(".");
      lockParentUrl = true;
    }
  }

  onMount(() => {
    $isLoading = false;
    if (import.meta.env.DEV) {
      handleEvent(window.microcmsIframeInitEvent);
    } else {
      window.addEventListener("message", handleEvent);
    }
  });

  const onUploaded: ComponentProps<DragAndDrop>["onUploaded"] = (driveItem) => {
    if (!isValid) throw new Error("`parentUrl` is not valid.");

    uploadedFileListMap ??= {
      targetPath,
      fileList: [],
    };

    let newUploadedFile: ArrayElem<UploadedFileList>;

    try {
      newUploadedFile = driveItem2UploadedFile(key, driveItem);
    } catch (e) {
      pushSnackbar({
        label:
          "🚫 microCMS にアップロードしたファイルの一覧を保存できませんでした",
        props: {
          timeoutMs: 7000,
        },
      });
      throw e;
    }

    // `name` が同じ場合は上書きする
    const newUploadedFileList = [
      ...uploadedFileListMap.fileList,
      newUploadedFile,
    ].filter((d, i, self) => self.findIndex((dd) => dd.name === d.name) === i);

    const message: UploadedFileListMapMessage = {
      id: controller.id,
      title: `${newUploadedFileList.length} 件のアップロードされたファイル`,
      updatedAt: new Date(),
      data: {
        targetPath: uploadedFileListMap.targetPath,
        fileList: newUploadedFileList,
      },
    };

    controller.postData<typeof uploadedFileListMap>(message);
    uploadedFileListMap = message.data;
    lockParentUrl = true;
    pushSnackbar({
      label:
        "📤 正常にアップロードされました！ ファイル一覧を保持するために “下書き保存” をしてください.",
      props: {
        timeoutMs: 7000,
      },
    });
  };
</script>

<main>
  <section class="file-list">
    <div>アップロード済みファイル</div>
    <div class="content">
      {#if controller != null}
        <UploadedFileListComp
          uploadedFileList={uploadedFileListMap?.fileList ?? []}
        />
      {:else}
        <LinearProgress indeterminate />
      {/if}
    </div>
  </section>
  <section class="file-upload">
    <section>
      <div class="title" class:disabled={lockParentUrl}>
        1. 親ページの URL を貼り付け {lockParentUrl ? "(不要)" : ""}
      </div>
      <div class="content">
        <Textfield
          style="width: 100%"
          bind:value={parentUrl}
          variant="outlined"
          input$emptyValueUndefined
          invalid={parentUrl != null && !isValid}
          disabled={lockParentUrl}
          type="url"
        >
          <HelperText validationMsg slot="helper">
            {#if validateStatus === "INVALID_URL"}
              URL ではありません.
            {:else if validateStatus === "NOT_MICROCMS_URL"}
              自身の microCMS の URL ではありません.
            {:else if validateStatus === "UNDEFINED_CONTENT_ID"}
              コンテンツ ID が不明です; 一度下書きを保存してみてください.
            {/if}
            (<code>{validateStatus}</code>)
          </HelperText>
        </Textfield>
      </div>
    </section>
    <section class:active={parentUrl != null && isValid}>
      <div class="title">
        2. アップロードしたいファイルをドラッグアンドドロップ
      </div>
      <div class="content">
        <div class="path-info" class:active={isValid}>
          Key: <code>{key}</code>, Path: <code>{targetPath}</code>
        </div>
        <DragAndDrop {key} {targetPath} {onUploaded} />
      </div>
    </section>
  </section>
</main>

<style lang="scss">
  main {
    padding: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 20px;

    .file-list {
      .content {
        padding: 10px 0;
      }
    }

    .file-upload {
      display: flex;
      flex-direction: column;
      gap: 20px;

      section {
        &:nth-child(1) {
          .title {
            transition: 0.3s;
            &.disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          }
        }
        &:nth-child(2) {
          opacity: 0.5;
          pointer-events: none;
          cursor: not-allowed;
          transition: 0.3s;

          .path-info {
            font-size: 0.7rem;
            transition: 0.3s;
            opacity: 0;
            &.active {
              opacity: 1;
            }
          }

          &.active {
            opacity: 1;
            pointer-events: all;
            cursor: auto;
          }
        }
      }
    }
  }
</style>
