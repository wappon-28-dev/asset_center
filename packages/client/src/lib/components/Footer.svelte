<script lang="ts">
  import { isLandscape } from "$lib/model/store";

  export let pathname: string;
  let hidden = false;

  const handleOnScroll = (): void => {
    const scrollY = (document.documentElement || document.body).scrollTop;
    if (scrollY == null) return;
    hidden = scrollY > 150;
  };
</script>

<svelte:window on:scroll={handleOnScroll} />
<footer class:hidden>
  <div class="path" class:isLandscape={$isLandscape}>
    <code>{pathname}</code>
  </div>
  <div class="author">powered by @wappon28dev / わっぽん</div>
</footer>

<style lang="scss">
  footer {
    padding: 10px;
    font-size: 0.8rem;
    font-weight: 500;
    transition: opacity 0.3s ease-in-out;

    &.hidden {
      opacity: 0;
    }

    .path {
      position: fixed;
      bottom: 0;
      left: 0;
      padding: 10px;
      color: var(--m3-on-surface);

      &:not(.isLandscape) {
        position: fixed;
        top: 6%;
        left: 0;
      }
    }
    .author {
      position: fixed;
      bottom: 0;
      right: 0;
      padding: 10px;
      color: var(--m3-on-surface);
    }
  }
</style>
