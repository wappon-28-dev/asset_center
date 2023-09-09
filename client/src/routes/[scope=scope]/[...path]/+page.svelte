<script lang="ts">
  import Card, { Content } from "@smui/card";
  import List, { Graphic, Item, Label, Meta } from "@smui/list";
  import ArrowRight from "svelte-material-icons/ArrowRight.svelte";
  import FileDownloadOutline from "svelte-material-icons/FileDownloadOutline.svelte";
  import FolderOutline from "svelte-material-icons/FolderOutline.svelte";
  import { isLoading } from "$lib/model/store";
  import { runTransitionRaw } from "$lib/model/constants";
  import DownloadDialog from "$lib/components/DownloadDialog.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const openIndex: number[] = [];

  const { getChildren } = data;
  const info = getChildren().finally(() => ($isLoading = false));
</script>

<div class="container">
  <article>
    {#await info}
      <div class="loading">メタデータを読み込み中です…</div>
    {:then { item, children }}
      <br />
      <br />
      <div class="dir-info">
        <div class="display-name">{item.fields.DisplayName}</div>
        <p class="desc" class:isEmpty={item.fields.Desc == null}>
          {item.fields.Desc ?? "説明はありません"}
        </p>
      </div>
      <div class="card-container">
        <Card>
          <Content>
            <List class="demo-list" dense>
              {#each children.value as child, index}
                <Item
                  on:click={async () => {
                    await runTransitionRaw(
                      `${String(data.pathname)}/${String(child.name)}`,
                    );
                  }}
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
                    <ArrowRight size={20} />
                  </Meta>
                </Item>
                <DownloadDialog open={openIndex.includes(index)} {item} />
              {/each}
            </List>
          </Content>
        </Card>
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
    margin: 0 auto;

    article {
      .loading {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .dir-info {
        .display-name {
          font-size: x-large;
          font-weight: bold;
        }

        .desc {
          &.isEmpty {
            color: var(--m3-outline);
          }
        }
      }
    }
  }
</style>
