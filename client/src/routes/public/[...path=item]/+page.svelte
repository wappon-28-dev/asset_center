<script lang="ts">
  import Inquiry from "$lib/assets/Inquiry.svelte";
  import { byteToUnit, waitMs } from "$lib/model/constants";
  import { downloadAndGetUrl } from "$lib/model/download";
  import { isLoading, loadedBytes } from "$lib/model/store";
  import Button, { Icon, Label } from "@smui/button";
  import LinearProgress from "@smui/linear-progress";
  import TrayArrowDown from "svelte-material-icons/TrayArrowDown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const { itemDataFn, metaDataFn } = data;
  const info = Promise.all([itemDataFn(), metaDataFn()]).finally(
    () => ($isLoading = false)
  );

  async function downloadItem(
    url: string,
    fileName: string,
    size: number
  ): Promise<void> {
    $loadedBytes = 0;
    const downloadUrl = await downloadAndGetUrl(url, size);
    const anchor = document.createElement("a");
    anchor.setAttribute("href", downloadUrl);
    anchor.setAttribute("download", fileName);
    const mouseEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    anchor.dispatchEvent(mouseEvent);
    await waitMs(5000);
    $loadedBytes = undefined;
  }
</script>

<div class="container">
  <article>
    {#await info}
      アセットを読み込み中です…
    {:then [itemData, metaData]}
      <br />
      <Inquiry scale={1.5} /><br />
      <div class="info">
        <div class="name">
          <p class="title">{metaData.fields.Title}</p>
          <code>{itemData.name}</code>
          <p>{metaData.fields.Desc}</p>
        </div>
        <br />

        <Button
          variant="raised"
          disabled={$isLoading}
          on:click={async () => {
            await downloadItem(
              itemData["@microsoft.graph.downloadUrl"],
              metaData.fields.DistName,
              itemData.size
            );
          }}
        >
          <Icon>
            <TrayArrowDown />
          </Icon>
          <Label>{metaData.fields.DistName}</Label>
        </Button>

        <div
          class="progress"
          class:downloading={$loadedBytes != null &&
            $loadedBytes !== itemData.size}
        >
          <LinearProgress progress={$loadedBytes ?? 0 / itemData.size} />
          <div class="text">
            {#if $loadedBytes === itemData.size}
              <p>ダウンロード完了</p>
            {:else}
              <p>ダウンロード中...</p>
              <code>
                {byteToUnit($loadedBytes ?? 0)} / {byteToUnit(itemData.size)}
              </code>
            {/if}
          </div>
        </div>

        <div class="meta" />
      </div>
    {:catch err}
      {err}
    {/await}
  </article>
</div>

<style lang="scss">
  :global(.mdc-circular-progress__indeterminate-circle-graphic) {
    stroke: var(--m3-primary);
  }

  :global(.mdc-linear-progress__buffer-bar) {
    background-color: var(--m3-inverse-primary);
    opacity: 0.5;
  }

  .container {
    height: calc(100vh - var(--app-bar-height));
    display: table;
    margin: 0 auto;

    article {
      display: table-cell;
      vertical-align: middle;
      text-align: center;

      .info {
        .name {
          .title {
            font-size: 2rem;
            font-weight: bold;
          }
        }

        .progress {
          text-align: left;
          margin: 1rem 0;
        }
      }
    }
  }
</style>
