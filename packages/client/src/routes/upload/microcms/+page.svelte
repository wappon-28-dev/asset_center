<script lang="ts">
  import { onMount } from "svelte";
  import Textfield from "@smui/textfield";
  import FilePond, { type FilePondFile, registerPlugin } from "svelte-filepond";
  // @ts-expect-error: なぜかエラーが出る
  import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
  // @ts-expect-error: なぜかエラーが出る
  import FilePondPluginImagePreview from "filepond-plugin-image-preview";
  import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
  import {
    Client,
    FileUpload,
    LargeFileUploadTask,
  } from "@microsoft/microsoft-graph-client";
  import { ParentController } from "$lib/model/service/microCMS";
  import { isLoading } from "$lib/model/store";
  import { client } from "$lib/model/service/client";

  import "filepond/dist/filepond.css";
  import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
  import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
  import { getAuthHeader } from "$lib/model/constants";
  import { PUBLIC_BASE_ORIGIN } from "$env/static/public";

  let parentUrl = "https://example.com";
  let controller: ParentController;
  let pond: FilePond;

  onMount(() => {
    $isLoading = false;

    const initEvent = window.microcmsIframeInitEvent;
    const isInMicrocms = "user" in initEvent.data;
    console.log(isInMicrocms ? "in microCMS" : "not in microCMS");
    if (!isInMicrocms) {
      throw new Error(
        "`initEvent` doesn't contain `user` attribute; `window` is not in microCMS iframe.",
      );
    }

    controller = new ParentController(initEvent);
    controller.updateStyle({
      height: 500,
      width: "100%",
    });
  });

  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginMediaPreview,
  );

  function handleInit(): void {
    console.log("FilePond has initialized");
  }

  async function handleAddFile(_, fileItem: FilePondFile): Promise<void> {
    console.log("A file has been added", fileItem);
    const key = "9u3rcus-web";
    const res = await client.v1.assets[":key"].item.$post(
      {
        param: { key },
        query: {
          filePath: fileItem.filename,
        },
      },
      {
        headers: {
          authorization: getAuthHeader("upload", key),
          referer: PUBLIC_BASE_ORIGIN,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to upload a file");

    const { url, expiry, isCancelled } = await res.json();

    const fileUpload = new FileUpload(
      fileItem.file,
      fileItem.filename,
      fileItem.fileSize,
    );
    console.log(fileUpload);

    const uploadTask = new LargeFileUploadTask(
      Client.init({ authProvider: () => "" }),
      fileUpload,
      {
        url,
        expiry: new Date(expiry),
        isCancelled,
      },
      {},
    );

    console.log(uploadTask);

    const result = await uploadTask.upload();
    console.log(result);
  }
</script>

<main>
  <section class="file-list">
    アップロード済みファイル
    <div style="height: 300px; width: 100%; background: red;" />
  </section>
  <section class="file-upload">
    <section>
      <div class="step">1. 親の URL を貼り付け</div>
      <div class="content">
        <Textfield style="width: 100%;" bind:value={parentUrl} />
      </div>
    </section>
    <section>
      <div class="step">
        2. アップロードしたいファイルをドラッグアンドドロップ
      </div>
      <div class="content">
        <FilePond
          bind:this={pond}
          name="filepond"
          allowMultiple={true}
          oninit={handleInit}
          onaddfile={handleAddFile}
        />
      </div>
    </section>
  </section>
</main>

<style lang="scss">
  main {
    padding: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(700px, 1fr));
    gap: 20px;

    .file-upload {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
</style>
