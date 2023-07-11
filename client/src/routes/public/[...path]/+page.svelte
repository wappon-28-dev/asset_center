<script lang="ts">
  import Inquiry from "$lib/assets/Inquiry.svelte";
  import DownloadDialog from "$lib/components/DownloadDialog.svelte";
  import { runTransitionRaw } from "$lib/model/constants";
  import { isLoading } from "$lib/model/store";
  import IconButton from "@smui/icon-button";
  import List, { Graphic, Item, Label, Meta } from "@smui/list";
  import FileDownloadOutline from "svelte-material-icons/FileDownloadOutline.svelte";
  import FolderOutline from "svelte-material-icons/FolderOutline.svelte";
  import TrayArrowDown from "svelte-material-icons/TrayArrowDown.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;
  let openIndex: number[] = [];

  const { getChildren } = data;
  const info = getChildren().finally(() => ($isLoading = false));
</script>

<div class="container">
  <article>
    {#await info}
      メタデータを読み込み中です…
    {:then { item, children }}
      <br />
      <Inquiry scale={1.5} /><br />
      <List class="demo-list" dense>
        {#each children.value as child, index}
          <Item
            on:click={() => runTransitionRaw(`${data.pathname}/${child.name}`)}
          >
            <Graphic>
              {#if child.folder == null}
                <FileDownloadOutline size={40} />
              {:else}
                <FolderOutline size={40} />
              {/if}
            </Graphic>
            <Label>{child.name}</Label>

            <Meta>
              <IconButton
                on:click={() => {
                  if (child["@microsoft.graph.downloadUrl"] == null) return;
                  openIndex = [];
                  openIndex.push(index);
                  openIndex = [...openIndex];
                }}
              >
                <TrayArrowDown />
              </IconButton>
            </Meta>
          </Item>
          <DownloadDialog
            open={openIndex.includes(index)}
            url={child["@microsoft.graph.downloadUrl"]}
            fileName={child.name}
            size={child.size}
          />
        {/each}
      </List>
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
