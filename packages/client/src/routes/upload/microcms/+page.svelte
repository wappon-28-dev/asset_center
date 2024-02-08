<script lang="ts">
  import { onMount } from "svelte";
  import Textfield from "@smui/textfield";
  import { ParentController } from "$lib/model/service/microcms";
  import { isLoading } from "$lib/model/store";
  import DragAndDrop from "$lib/components/DragAndDrop.svelte";

  let parentUrl = "https://example.com";
  let controller: ParentController;

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
        <DragAndDrop key="9u3rcus-web" targetPath="ほげ" />
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
