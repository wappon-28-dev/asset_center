<script lang="ts">
  import Inquiry from "$lib/assets/Inquiry.svelte";
  import NotFound from "$lib/assets/NotFound.svelte";
  import Ready from "$lib/assets/Ready.svelte";
  import Transfer from "$lib/assets/Transfer.svelte";
  import Meta from "$lib/components/Meta.svelte";
  import { pageManifests } from "$lib/model/manifests";
  import { isLoading } from "$lib/model/store";
  import { onMount } from "svelte";

  onMount(() => ($isLoading = false));
</script>

<Meta pageManifest={pageManifests.HOME} />

<div class="container">
  <article>
    <Inquiry scale="1" /><br />
    <NotFound scale="1" /><br />
    <Transfer scale="1" /><br />
    <Ready scale="1" /><br />
  </article>
</div>

<style lang="scss">
  .container {
    height: calc(100vh - var(--app-bar-height));
    display: table;
    margin: 0 auto;

    article {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
    }
  }
</style>
