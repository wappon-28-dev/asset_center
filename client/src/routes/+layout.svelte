<script lang="ts">
  import BackToTop from "$lib/components/Back2Top.svelte";
  import PageTransition from "$lib/components/PageTransition.svelte";
  import Splash from "$lib/components/Splash.svelte";
  import {
    isLandscapeDetect,
    runTransition,
    runTransitionRaw,
    url,
  } from "$lib/model/constants";
  import { pageManifests } from "$lib/model/manifests";
  import { isLandscape, isLoading } from "$lib/model/store";
  import { ThemeProvider } from "$lib/model/theme";
  import Button, { Label } from "@smui/button";
  import { AppContent } from "@smui/drawer";
  import IconButton, { Icon } from "@smui/icon-button";
  import LinearProgress from "@smui/linear-progress";
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
    prefersDark.addEventListener("change", () => new ThemeProvider().update());
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
          on:click={() => runTransition(pageManifests.HOME)}
          aria-label="ホーム"
        >
          <CloudSyncOutline />
        </IconButton>
        <Title on:click={() => runTransition(pageManifests.HOME)}
          >Assets Center</Title
        >
      </Section>
      <Section align="end" toolbar>
        <Button
          on:click={() => runTransitionRaw(url.repository)}
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

  <div class="author">powered by @wappon28dev / わっぽん</div>
  <BackToTop />
</div>
<Splash isMounting={!hasMounted} isLoading={$isLoading} />

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

  :global(
      .mdc-circular-progress__determinate-circle,
      .mdc-circular-progress__indeterminate-circle-graphic
    ) {
    stroke: var(--m3-on-primary);
  }

  .progress-mobile {
    margin-top: -5.5px;
    min-height: 4px;
  }

  .author {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 10px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--m3-on-surface);
  }
</style>
