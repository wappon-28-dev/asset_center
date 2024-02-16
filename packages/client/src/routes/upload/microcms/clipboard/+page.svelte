<script lang="ts">
  import { onMount } from "svelte";
  import { isLoading } from "$lib/model/store";

  let err: string;

  onMount(async () => {
    $isLoading = false;
    const params = new URLSearchParams(window.location.search);
    const content = params.get("content");

    if (content == null) throw new Error("content is null");

    await navigator.clipboard.writeText(content).catch((e) => {
      err = e;
      console.error(e);
      throw e;
    });
    window.close();
  });
</script>

<div>
  {#if err}
    <p>
      🚫 権限不足によってコピーできませんでした. クリップボードの許可が必要です.
    </p>
    <code>{err}</code>
  {/if}
</div>

<style lang="scss">
  div {
    height: 85vh;
    overflow-y: hidden;
    width: 100%;
    display: grid;
    place-items: center;
    place-content: center;
  }
</style>
