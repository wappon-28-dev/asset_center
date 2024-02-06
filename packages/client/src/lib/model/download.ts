import { loadedBytes } from "./store";

export async function downloadAndGetUrl(
  url: string,
  contentLength: number,
  mimeType: string,
  signal: AbortSignal
): Promise<string> {
  const res = await fetch(url, {
    signal,
  });
  const total = contentLength;
  let chunk = 0;

  const response = new Response(
    new ReadableStream({
      async start(controller) {
        if (res.body == null) {
          throw new Error("body is null");
        }

        const reader = res.body.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            console.log("download completed");
            return;
          }

          chunk += value.byteLength;
          console.log(`${chunk} / ${total}`);

          loadedBytes.set(chunk);

          controller.enqueue(value);
        }
      },
    }),
    { headers: { "Content-Length": contentLength.toString() } }
  );
  console.log("download completed");
  const data = await response.blob();
  const blob = new Blob([data], { type: mimeType });
  return URL.createObjectURL(blob);
}
