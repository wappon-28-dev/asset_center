<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";
  import Card, { Content } from "@smui/card";
  import FileEyeOutline from "svelte-material-icons/FileEyeOutline.svelte";
  import TrayArrowDown from "svelte-material-icons/TrayArrowDown.svelte";
  import Inquiry from "$lib/assets/Inquiry.svelte";
  import DownloadDialog from "$lib/components/DownloadDialog.svelte";
  import { byteToUnit } from "$lib/model/constants";
  import { isLoading } from "$lib/model/store";
  import type { PageData } from "./$types";
  import Meta from "$lib/components/Meta.svelte";

  export let data: PageData;
  let open = false;
  let needDownload = true;

  const { getItem } = data;
  const info = getItem()
    .catch((e) => {
      console.warn(e);
      throw e;
    })
    .finally(() => ($isLoading = false));

  const openDialog = (isDownload: boolean): void => {
    needDownload = isDownload;
    open = false;
    open = true;
  };
</script>

<div class="container">
  <article>
    {#await info}
      メタデータを読み込み中です…
    {:then { item }}
      <Meta
        pageManifest={{
          meta: {
            title: `${item.fields.DisplayName} | Assets Center`,
            description: item.fields.Desc,
            ogp: {
              img: undefined,
            },
          },
          path: data.pathname,
        }}
      />
      <Inquiry scale={1.5} />
      <br />
      <br />
      <div class="card-container">
        <Card>
          <div class="content">
            <Content>
              <div class="item-info">
                <div class="display-name">{item.fields.DisplayName}</div>
                <p class="desc" class:isEmpty={item.fields.Desc == null}>
                  {item.fields.Desc ?? "説明はありません"}
                </p>
              </div>
              <Button
                variant="raised"
                disabled={$isLoading}
                on:click={async () => {
                  openDialog(true);
                }}
              >
                <Icon>
                  <TrayArrowDown />
                </Icon>
                <Label>{item.fields.DistName}</Label>
              </Button>
              <div style="padding: 0.2rem" />
              <Button
                variant="outlined"
                disabled={$isLoading}
                on:click={async () => {
                  openDialog(false);
                }}
              >
                <Icon>
                  <FileEyeOutline />
                </Icon>
                <Label>プレビュー</Label>
              </Button>
            </Content>
          </div>
        </Card>
      </div>
      <div class="meta">
        <p>
          サイズ: {byteToUnit(item.driveItem.size)}・更新日時: {new Date(
            item.lastModifiedDateTime,
          ).toLocaleString()}
        </p>
      </div>

      <DownloadDialog {open} {item} {needDownload} />
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

      .card-container {
        .content {
          padding: 20px;
          .display-name {
            font-size: x-large;
            font-weight: bold;
          }
        }
      }
      .meta {
        font-size: small;
        color: var(--m3-outline);
      }
    }
  }
</style>
