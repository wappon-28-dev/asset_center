export function sendAnalytics(
  operation: "download" | "preview",
  item: string,
): void {
  window.gtag("event", "purchase", {
    items: [
      {
        item_id: item,
        item_variant: operation,
      },
    ],
  });
}
