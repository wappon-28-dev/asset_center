import { loadedBytes } from "./store";

export async function downloadAndGetUrl(
  url: string,
  contentLength: number,
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
    })
  );

  console.log("download completed");
  const blob = await response.blob();

  return URL.createObjectURL(blob);
}
