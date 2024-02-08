<script lang="ts">
  import { setOptions } from "filepond";
  import FilePond, { registerPlugin } from "svelte-filepond";
  import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
  import FilePondPluginImagePreview from "filepond-plugin-image-preview";
  import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
  import { getServerConfig } from "$lib/model/service/upload";

  import "filepond/dist/filepond.css";
  import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
  import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";

  export let key: string;
  export let targetPath: string;

  let pond: FilePond;

  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginMediaPreview,
  );

  setOptions({
    labelIdle:
      'ファイルを ドラッグアンドドロップ または, <span class="filepond--label-action"> ファイルを開く </span>',
    labelFileProcessing: "アップロード中...",
    labelFileProcessingComplete: "アップロード完了",
    labelFileProcessingAborted: "アップロードが中断されました",
    labelFileProcessingError: "アップロードエラー",
    labelTapToCancel: "クリックしてキャンセル",
  });
</script>

<FilePond
  bind:this={pond}
  name="filepond"
  allowMultiple={true}
  allowBrowse={true}
  server={getServerConfig(key, targetPath)}
  allowRevert={false}
/>
