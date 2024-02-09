<script lang="ts">
  import type { GetDefaultDataMessage } from "microcms-field-extension-api";

  export let data: GetDefaultDataMessage["data"];
</script>

{JSON.stringify(data.message)}

<style lang="scss">
</style>
