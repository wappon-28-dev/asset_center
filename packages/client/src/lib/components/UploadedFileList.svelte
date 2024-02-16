<script lang="ts">
  import DataTable, {
    Body,
    Cell,
    Head,
    Row,
    Label,
    type SortValue,
  } from "@smui/data-table";
  import Button, { Icon } from "@smui/button";
  import Link from "svelte-material-icons/Link.svelte";
  import ArrowUp from "svelte-material-icons/ArrowUp.svelte";
  import IconButton from "@smui/icon-button";
  import type { UploadedFileList } from "$lib/model/types/microcms";
  import { byteToUnit, type ArrayElem } from "$lib/model/constants";
  import { pushSnackbar } from "$lib/components/kitchen";

  import Inquiry from "$lib/assets/Inquiry.svelte";

  export let uploadedFileList: UploadedFileList;

  let sort: keyof ArrayElem<UploadedFileList> = "name";
  let sortDirection: Lowercase<keyof typeof SortValue> = "ascending";

  function handleSort(): void {
    uploadedFileList.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === "ascending" ? "slice" : "reverse"
      ]();
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal);
      }
      return Number(aVal) - Number(bVal);
    });
    uploadedFileList = uploadedFileList;
  }
  export const strToDate = (date: string): string =>
    new Date(date).toLocaleString("ja-JP");
</script>

<div class="data-table">
  <DataTable
    sortable
    bind:sort
    bind:sortDirection
    on:SMUIDataTable:sorted={handleSort}
    table$aria-label="アップロード済みファイル"
    style="width: 100%;"
  >
    <Head>
      <Row>
        <Cell columnId="name" style="width: 100%;">
          <Label>ファイル名</Label>
          <IconButton>
            <ArrowUp />
          </IconButton>
        </Cell>
        <Cell columnId="size" numeric>
          <IconButton>
            <ArrowUp />
          </IconButton>
          <Label>サイズ</Label>
        </Cell>
        <Cell columnId="created" numeric>
          <IconButton>
            <ArrowUp />
          </IconButton>
          <Label>作成日時</Label>
        </Cell>
        <Cell columnId="lastModified" numeric>
          <IconButton>
            <ArrowUp />
          </IconButton>
          <Label>更新日時</Label>
        </Cell>
        <Cell sortable={false}></Cell>
      </Row>
    </Head>
    <Body>
      {#each uploadedFileList as { name, size, fileSystemInfo, webUrl }}
        <Row>
          <Cell><code style="user-select: all;">{name}</code></Cell>
          <Cell numeric>{byteToUnit(size, 1)}</Cell>
          <Cell numeric>{strToDate(fileSystemInfo.createdDateTime)}</Cell>
          <Cell numeric>{strToDate(fileSystemInfo.lastModifiedDateTime)}</Cell>
          <Cell style="padding: 2px;">
            <Button
              style="margin: -10px;"
              on:click={() => {
                window.open(
                  `/upload/microcms/clipboard?content=${webUrl}`,
                  "_blank",
                );
                pushSnackbar({
                  label: "📋 URL をクリップボードにコピーしました！",
                  props: {
                    timeoutMs: 7000,
                  },
                });
              }}
            >
              <Link size={20} />
            </Button>
          </Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
</div>

{#if uploadedFileList.length === 0}
  <div class="no-files">
    <div class="pic">
      <Inquiry scale={1.3} />
    </div>
    <p>アップロードされたファイルはありません</p>
  </div>
{/if}

<style lang="scss">
  .no-files {
    padding: 20px;

    .pic {
      text-align: center;
      margin: 0 auto;
    }

    p {
      text-align: center;
      margin: 10px 0;
    }
  }
</style>
