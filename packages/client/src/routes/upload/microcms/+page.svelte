<script lang="ts">
  import { onMount, type ComponentProps } from "svelte";
  import Textfield from "@smui/textfield";
  import { z } from "zod";
  import HelperText from "@smui/textfield/helper-text";
  import { isLoading, kitchen } from "$lib/model/store";
  import DragAndDrop from "$lib/components/DragAndDrop.svelte";
  import { ParentController } from "$lib/model/service/microcms";
  import { goto } from "$app/navigation";
  import UploadFileList from "$lib/components/UploadFileList.svelte";

  let parentUrl: string;
  let controller: ParentController;
  let isValid: boolean;

  let key: string;
  let targetPath: string;

  $: {
    isValid =
      z.string().url().safeParse(parentUrl).success &&
      parentUrl.startsWith(`${controller.origin}/apis/`);

    if (isValid) {
      targetPath = new URL(parentUrl).pathname.replace("/apis/", "");
    }
  }

  onMount(async () => {
    $isLoading = false;

    const initEvent = window.microcmsIframeInitEvent;
    const isInMicrocms = "user" in initEvent.data;
    if (!isInMicrocms) {
      await goto("/");
      $kitchen.push({
        label:
          "🚫 このページは microCMS で開く必要があります; トップページへリダイレクトしました.",
      });
      throw new Error(
        "`initEvent` doesn't contain `user` attribute; `window` is not in microCMS iframe.",
      );
    }

    controller = new ParentController(initEvent);
    controller.updateStyle({
      height: 600,
      width: "100%",
    });

    [key] = new URL(controller.origin).hostname.split(".");
  });

  const onUploaded: ComponentProps<DragAndDrop>["onUploaded"] = (driveItem) => {
    const { id, name: title, lastModifiedDateTime } = driveItem;
    const updatedAt =
      lastModifiedDateTime != null
        ? new Date(lastModifiedDateTime)
        : new Date();
    // TODO: microCMS に POST する処理を実装する
  };
</script>

<main>
  <section class="file-list">
    <div>アップロード済みファイル</div>
    <div class="content">
      {#if controller != null}
        <UploadFileList data={controller.initEvent.data} />
      {:else}
        <div>読み込み中...</div>
      {/if}
    </div>
  </section>
  <section class="file-upload">
    <section>
      <div>1. 親ページの URL を貼り付け</div>
      <div class="content">
        <Textfield
          style="width: 100%"
          bind:value={parentUrl}
          variant="outlined"
          input$emptyValueUndefined
          invalid={parentUrl != null && !isValid}
          type="url"
        >
          <HelperText validationMsg slot="helper">
            URL が正しくありません; URL 形式であること, microCMS の URL
            であることを確認してください.
          </HelperText>
        </Textfield>
      </div>
    </section>
    <section class:active={parentUrl != null && isValid}>
      <div>2. アップロードしたいファイルをドラッグアンドドロップ</div>
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

      section:nth-child(2) {
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
</style>
