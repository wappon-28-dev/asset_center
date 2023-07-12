<script lang="ts">
  import Transfer from "$lib/assets/Transfer.svelte";
  import { byteToUnit, runTransitionRaw, waitMs } from "$lib/model/constants";
  import { downloadAndGetUrl } from "$lib/model/download";
  import { loadedBytes } from "$lib/model/store";
  import type { resValidator } from "@api/types/res_req";
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content } from "@smui/dialog";
  import LinearProgress from "@smui/linear-progress";
  import type { z } from "zod";

  export let open = false;
  export let item: z.infer<(typeof resValidator)["listItem"]>;

  const { "@microsoft.graph.downloadUrl": url, size, file } = item.driveItem;

  let controller = new AbortController();

  async function downloadItem(): Promise<void> {
    if (url == null) throw new Error("downloadUrl is null");

    $loadedBytes = 0;
    controller = new AbortController();

    const downloadUrl = await downloadAndGetUrl(
      url,
      size,
      file?.mimeType ?? "application/octet-stream",
      controller.signal
    );

    await waitMs(600);
    runTransitionRaw(downloadUrl);
    // const anchor = document.createElement("a");
    // anchor.setAttribute("href", downloadUrl);
    // anchor.setAttribute("download", fileName);
    // const mouseEvent = new MouseEvent("click", {
    //   bubbles: true,
    //   cancelable: true,
    //   view: window,
    // });
    // anchor.dispatchEvent(mouseEvent);
    open = false;
    $loadedBytes = undefined;
  }

  $: {
    if (open) {
      void downloadItem();
    }
  }
</script>

<div class="container">
  <Dialog bind:open scrimClickAction="" escapeKeyAction="">
    <Content>
      <div class="content">
        <br />
        <div class="pic">
          <Transfer scale={1.6} />
        </div>

        <br />
        <div
          class="progress"
          class:downloading={$loadedBytes != null && $loadedBytes !== size}
        >
          <div class="liner-progress">
            <LinearProgress progress={($loadedBytes ?? 0) / size} />
          </div>
          <div class="text">
            {#if $loadedBytes === size}
              <p>ダウンロード完了</p>
            {:else}
              <p>ダウンロード中...</p>
              <code>
                {byteToUnit($loadedBytes ?? 0)} / {byteToUnit(size)}
              </code>
            {/if}
          </div>
        </div>
      </div>
    </Content>
    <Actions>
      <Button
        on:click={() => {
          controller.abort();
          open = false;
        }}
      >
        <Label>中止</Label>
      </Button>
    </Actions>
  </Dialog>
</div>

<style lang="scss">
  :global(.mdc-circular-progress__indeterminate-circle-graphic) {
    stroke: var(--m3-primary);
  }

  :global(.mdc-linear-progress__buffer-bar) {
    background-color: var(--m3-inverse-primary);
    opacity: 0.5;
  }

  :global(.mdc-dialog__content) {
    color: var(--m3-on-background) !important;
  }

  .container {
    display: table;
    margin: 0 auto;

    .content {
      padding: 20px;
      display: table-cell;
      vertical-align: middle;
      text-align: center;

      .progress {
        max-width: 400px;
        padding: 20px;

        .liner-progress {
          text-align: left;
        }
      }
    }
  }
</style>
