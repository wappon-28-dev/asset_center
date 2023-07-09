<script lang="ts">
  import { client } from "$lib/model/service/client";
  import { isLoading } from "$lib/model/store";
  import type { InferResponseType } from "hono";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const dirPath = data.pathname.split("/").slice(2).join("/");

  const getChildren = client.v1.assets.public.children.$get;
  let children: InferResponseType<typeof getChildren>;

  onMount(async () => {
    const res = await getChildren({
      query: {
        dirPath,
      },
    });

    if (res.ok) {
      children = await res.json();
    }
    $isLoading = false;
  });
</script>

<div class="container">
  <article>
    Directoryを列挙する
    <div class="text-container">
      <div>{data.pathname}</div>
      {JSON.stringify(children)}
    </div>
  </article>
</div>

<style lang="scss">
</style>
