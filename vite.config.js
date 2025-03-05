import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import viteCompression from 'vite-plugin-compression';
import path from "path";
import svg from "vite-plugin-svgstring";
import dsv from "@rollup/plugin-dsv";

export default defineConfig({
  base: '',
  plugins: [
    svelte(),
    viteCompression({
      filter: /\.(js|css|svg)$/, // Compress only these file types
    })
  ],
  resolve: {
		alias: {
			$components: path.resolve("./src/components"),
			$data: path.resolve("./src/data")
		}
	}
})
