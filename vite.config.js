import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import viteCompression from "vite-plugin-compression";
import path from "path";
import svg from "vite-plugin-svgstring";
import dsv from "@rollup/plugin-dsv";
import adapter from "@sveltejs/adapter-static";
import sass from "sass";

export default defineConfig({
  base: "",
  plugins: [
    svelte({
      kit: {
        adapter: adapter({
          // default options are shown. On some platforms
          // these options are set automatically — see below
          pages: "build",
          assets: "build",
          fallback: null,
          precompress: false,
          strict: true,
        }),
      },
      preprocess: {
        style: ({ content, attributes }) => {
          // Only process SCSS/SASS
          if (attributes.lang === "scss" || attributes.lang === "sass") {
            return new Promise((resolve, reject) => {
              sass.render(
                {
                  data: content,
                  includePaths: ["src"],
                  sourceMap: true,
                },
                (err, result) => {
                  if (err) reject(err);
                  else resolve({ code: result.css.toString() });
                }
              );
            });
          }
        },
      },
    }),
    viteCompression({
      filter: /\.(js|css|svg)$/, // Compress only these file types
    }),
    dsv(),
    svg(),
  ],
  resolve: {
    alias: {
      $components: path.resolve("./src/components"),
      $data: path.resolve("./src/data"),
      $styles: path.resolve("./src/styles"),
    },
  },
});
