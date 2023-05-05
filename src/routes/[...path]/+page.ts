import type { PageLoad } from "./$types";

export const load = (({ params }) => {
  return {
    title: "Hello world!",
    content: "Welcome to our blog. Lorem ipsum dolor sit amet...",
    path: params.path.split("/"),
  };
}) satisfies PageLoad;

export const prerender = false;
