<script lang="ts">
  import { onMount } from "svelte";
  import { isLoading } from "$lib/model/store";
  import { ParentController } from "$lib/model/service/microCMS";

  onMount(() => {
    $isLoading = false;

    const initEvent = window.microcmsIframeInitEvent;

    if (initEvent == null) {
      throw new Error("initEvent is null");
    }

    const controller = new ParentController(initEvent);
    controller.updateStyle({
      height: 500,
      width: "100%",
    });
  });
</script>

<p></p>
