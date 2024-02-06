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

  function onFileSelected(e): void {
    if (!e.target.files) return;

    const fileObject = e.target.files[0];
    console.log(fileObject);
  }
</script>

<input
  type="file"
  accept=".jpg, .jpeg, .png"
  on:change={(e) => {
    onFileSelected(e);
  }}
/>
