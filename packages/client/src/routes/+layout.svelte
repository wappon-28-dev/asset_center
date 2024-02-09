<script lang="ts">
  import Button, { Label } from "@smui/button";
  import { AppContent } from "@smui/drawer";
  import IconButton, { Icon } from "@smui/icon-button";
  import LinearProgress from "@smui/linear-progress";
  import Kitchen from "@smui/snackbar/kitchen";
  import type TopAppBarComponentDev from "@smui/top-app-bar";
  import TopAppBar, {
    AutoAdjust,
    Row,
    Section,
    Title,
  } from "@smui/top-app-bar";
  import { onMount } from "svelte";
  import CloudSyncOutline from "svelte-material-icons/CloudSyncOutline.svelte";
  import Launch from "svelte-material-icons/Launch.svelte";
  import { ThemeProvider } from "$lib/model/theme";
  import { isLandscape, isLoading, kitchen } from "$lib/model/store";
  import { pageManifests } from "$lib/model/manifests";
  import {
    isLandscapeDetect,
    runTransition,
    runTransitionRaw,
    url,
  } from "$lib/model/constants";
  import Splash from "$lib/components/Splash.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import BackToTop from "$lib/components/Back2Top.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let topAppBar: TopAppBarComponentDev;
  let hasMounted = false;

  onMount(() => {
    updateSize();
    hasMounted = true;

    // callback windows width event
    window.addEventListener("resize", updateSize);

    // callback prefers-color-scheme event
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDark.addEventListener("change", () => {
      new ThemeProvider().update();
    });
  });

  function updateSize(): void {
    $isLandscape = isLandscapeDetect();
  }
</script>

<div class:isLoading={$isLoading}>
  <TopAppBar bind:this={topAppBar} variant="standard">
    <Row>
      <Section>
        <IconButton
          on:click={() => {
            runTransition(pageManifests.HOME);
          }}
          aria-label="ホーム"
        >
          <CloudSyncOutline />
        </IconButton>
        <Title
          on:click={() => {
            runTransition(pageManifests.HOME);
          }}>Assets Center</Title
        >
      </Section>
      <Section align="end" toolbar>
        <Button
          on:click={async () => {
            await runTransitionRaw(url.repository);
          }}
          aria-label="ソースを見に行く"
        >
          <Icon><Launch /></Icon>
          <Label>source</Label>
        </Button>
      </Section>
    </Row>

    <div class="progress-mobile">
      {#if $isLoading}
        <LinearProgress class="progress-bar-mobile" indeterminate />
      {/if}
    </div>
  </TopAppBar>

  <AutoAdjust {topAppBar}>
    <AppContent class="app-content">
      <PageTransition {data}>
        <slot />
      </PageTransition>
    </AppContent>
  </AutoAdjust>

  <div class="path" class:isLandscape={$isLandscape}>
    <code>{data.pathname}</code>
  </div>
  <div class="author">powered by @wappon28dev / わっぽん</div>
  <BackToTop />
</div>
<Splash isMounting={!hasMounted} isLoading={$isLoading} />
<Kitchen bind:this={$kitchen} />

<style lang="scss">
  :global(.app-content) {
    overflow-y: visible;
    overflow-x: hidden;

    height: 100%;
    width: 100%;

    &.isLoading {
      pointer-events: none;
    }
  }

  .progress-mobile {
    margin-top: -5.5px;
    min-height: 4px;
  }

  .path {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 10px;
    font-size: 0.8rem;
    font-weight: 500;
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
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--m3-on-surface);
  }
</style>
