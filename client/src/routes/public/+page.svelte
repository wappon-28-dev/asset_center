<script lang="ts">
  import { isLoading } from "$lib/model/store";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  onMount(() => ($isLoading = false));
</script>

<div class="container">
  <article>
    public root
    <div class="text-container">
      <div>{data.pathname}</div>
    </div>
  </article>
</div>

<style lang="scss">
</style>
