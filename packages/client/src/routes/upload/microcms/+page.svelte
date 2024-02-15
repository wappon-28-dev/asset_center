<script lang="ts">
  import { onMount, type ComponentProps } from "svelte";
  import Textfield from "@smui/textfield";
  import { z } from "zod";
  import HelperText from "@smui/textfield/helper-text";
  import type { GetDefaultDataMessage } from "microcms-field-extension-api";
  import { isLoading } from "$lib/model/store";
  import DragAndDrop from "$lib/components/DragAndDrop.svelte";
  import { ParentController } from "$lib/model/service/microcms";
  import { goto } from "$app/navigation";
  import UploadFileList from "$lib/components/UploadFileList.svelte";
  import type { UploadedFileListMapMessage } from "$lib/model/types/microcms";
  import { pushSnackbar } from "$lib/components/kitchen";

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
      height: 600,
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
      console.log("DEV");
      handleEvent(window.microcmsIframeInitEvent);
    }

    return () => {
      window.removeEventListener("message", handleEvent);
    };
  });

  const onUploaded: ComponentProps<DragAndDrop>["onUploaded"] = (driveItem) => {
    const { lastModifiedDateTime } = driveItem;

    if (!isValid) throw new Error("`parentUrl` is not valid.");

    uploadedFileListMap ??= {
      targetPath,
      fileList: [],
    };

    const newUploadedFileList = [...uploadedFileListMap.fileList, driveItem];
    const updatedAt =
      lastModifiedDateTime != null
        ? new Date(lastModifiedDateTime)
        : new Date();

    const message: UploadedFileListMapMessage = {
      id: controller.id,
      title: `${newUploadedFileList.length} 件のアップロードされたファイル`,
      updatedAt,
      data: {
        targetPath: uploadedFileListMap.targetPath,
        fileList: newUploadedFileList,
      },
    };

    controller.postData<typeof uploadedFileListMap>(message);
    uploadedFileListMap = {
      targetPath: uploadedFileListMap.targetPath,
      fileList: newUploadedFileList,
    };
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

<svelte:window on:message={handleEvent} />
<main>
  <section class="file-list">
    <div>アップロード済みファイル</div>
    <div class="content">
      {#if controller != null}
        <UploadFileList {uploadedFileListMap} />
      {:else}
        <div>読み込み中...</div>
      {/if}
    </div>
  </section>
  <section class="file-upload">
    <section>
      <div class="title" class:disabled={lockParentUrl}>
        1. 親ページの URL を貼り付け {lockParentUrl && "(不要)"}
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
