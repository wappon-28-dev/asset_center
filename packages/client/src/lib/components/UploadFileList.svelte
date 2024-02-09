<script lang="ts">
  import type { UploadedFileListMapMessage } from "$lib/model/types/microcms";

  export let uploadedFileListMap: UploadedFileListMapMessage["data"];
</script>

{uploadedFileListMap.fileList.map((d) => d.name).join(", ")}

<style lang="scss">
</style>
