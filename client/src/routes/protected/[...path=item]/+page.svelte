<script lang="ts">
  import { client } from "$lib/model/service/client";
  import { isLoading } from "$lib/model/store";
  import type { InferResponseType } from "hono";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const filePath = data.pathname.split("/").slice(2).join("/");

  const getItem = client.v1.assets.protected.item.$get;
  let item: InferResponseType<typeof getItem>;

  onMount(async () => {
    const res = await getItem({
      query: {
        filePath,
      },
    });

    if (res.ok) {
      item = await res.json();
    }

    $isLoading = false;
  });
</script>

<div class="container">
  <article>
    protected item
    <div class="text-container">
      <div>{data.pathname}</div>
      {JSON.stringify(item)}
    </div>
  </article>
</div>

<style lang="scss">
</style>
