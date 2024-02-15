<script lang="ts">
  import type { UploadedFileList } from "$lib/model/types/microcms";

  export let uploadedFileList: UploadedFileList | undefined;
</script>

{#if uploadedFileList != null}
  {uploadedFileList.map((d) => d.name).join(", ")}
{:else}
  <p>ファイルがありません</p>
{/if}

<style lang="scss">
</style>
