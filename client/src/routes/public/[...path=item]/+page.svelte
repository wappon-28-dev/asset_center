<script lang="ts">
  import Inquiry from "$lib/assets/Inquiry.svelte";
  import DownloadDialog from "$lib/components/DownloadDialog.svelte";
  import { byteToUnit } from "$lib/model/constants";
  import { isLoading } from "$lib/model/store";
  import Button, { Icon, Label } from "@smui/button";
  import TrayArrowDown from "svelte-material-icons/TrayArrowDown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let open = false;

  const { itemDataFn, metaDataFn } = data;
  const info = Promise.all([itemDataFn(), metaDataFn()]).finally(
    () => ($isLoading = false)
  );
</script>

<div class="container">
  <article>
    {#await info}
      メタデータを読み込み中です…
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
            open = false;
            open = true;
          }}
        >
          <Icon>
            <TrayArrowDown />
          </Icon>
          <Label>{metaData.fields.DistName}</Label>
        </Button>

        <div class="meta">
          <p>
            サイズ: {byteToUnit(itemData.size)}・更新日時: {new Date(
              itemData.lastModifiedDateTime
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <DownloadDialog
        {open}
        url={itemData["@microsoft.graph.downloadUrl"]}
        fileName={itemData.name}
        size={itemData.size}
      />
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

        .meta {
          line-height: 0.8;
          font-size: small;
          color: var(--m3-outline);
        }
      }
    }
  }
</style>
