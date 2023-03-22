import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import svgr from 'vite-plugin-svgr';
import dts from "vite-plugin-dts";
import { visualizer } from 'rollup-plugin-visualizer';
import path from "path";

import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';


// https://vitejs.dev/config/
export default defineConfig(({mode})=>{

  return mode === "docs" ? {
      build: {
        outDir: mode,
        plugins: [react(), vanillaExtractPlugin(), svgr(), dts(), visualizer(), {enforce: 'pre', ...mdx({
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        })}]
      }
    } : {
      build: {
        lib: {
          entry: path.resolve(__dirname, "index.ts"),
          name: "ReactCodeScanner",
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      },
      plugins: [react(), vanillaExtractPlugin(), svgr(), dts(), visualizer()]
    }
})
