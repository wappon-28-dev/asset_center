<script lang="ts">
  import Ready from "$lib/assets/Ready.svelte";
  import Meta from "$lib/components/Meta.svelte";
  import { pageManifests } from "$lib/model/manifests";
  import { isLoading } from "$lib/model/store";
  import { onMount } from "svelte";

  onMount(() => ($isLoading = false));
</script>

<Meta pageManifest={pageManifests.HOME} />

<div class="container">
  <article>
    <Ready scale="1.5" /><br />
    <div class="explained break-keep">
      <p>アセットの<wbr />お受取所です</p>
      <p>This is where you receive your assets.</p>
    </div>
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

      .explained {
        margin: 30px;
        :first-child {
          font-size: 2rem;
          font-weight: 500;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>
