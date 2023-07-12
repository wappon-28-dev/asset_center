<script lang="ts">
  import { page } from "$app/stores";
  import NotFound from "$lib/assets/NotFound.svelte";
  import { isLoading } from "$lib/model/store";
  import Card, { Content } from "@smui/card";
  import { onMount } from "svelte";

  onMount(() => ($isLoading = false));
</script>

<div class="container">
  <div class="content">
    <Card variant="outlined">
      <Content>
        <div class="err-info">
          <p>{$page.status} {$page.error?.message}</p>
        </div>
        <div class="explain">
          {#if $page.status === 404}
            <NotFound scale={1.5} />
            <p>
              おっと！ お探しのものは見つかりませんでした… <br />
              スコープが正しいかをご確認ください
            </p>
          {/if}
        </div>
      </Content>
    </Card>
    <div class="stacktrace">
      <pre>{JSON.stringify($page.error)}</pre>
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    height: calc(100vh - var(--app-bar-height));
    display: table;
    margin: 0 auto;

    .content {
      display: table-cell;
      vertical-align: middle;
      text-align: center;

      .err-info {
        p {
          font-size: x-large;
          font-weight: bold;
          color: var(--m3-error);
        }
      }

      .stacktrace {
        pre {
          font-size: small;
          color: var(--m3-outline);
        }
      }
    }
  }
</style>
