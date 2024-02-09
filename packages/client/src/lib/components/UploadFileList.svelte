<script lang="ts">
  import type { UploadedFileListMapMessage } from "$lib/model/types/microcms";

  export let uploadedFileListMap:
    | UploadedFileListMapMessage["data"]
    | undefined;
</script>

{#if uploadedFileListMap != null}
  {uploadedFileListMap.fileList.map((d) => d.name).join(", ")}
{:else}
  <p>ファイルがありません</p>
{/if}

<style lang="scss">
</style>
