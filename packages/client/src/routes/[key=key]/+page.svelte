<script lang="ts">
  import { onMount } from "svelte";
  import { isLoading } from "$lib/model/store";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => ($isLoading = false));
</script>

<div class="container">
  <article>
    {data.pathname} root
    <div class="text-container">
      <div>{data.pathname}</div>
    </div>
  </article>
</div>

<style lang="scss">
</style>
