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
  const mdxPlugin = {
    enforce: 'pre', 
    ...mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
    }
  )}
  let plugins = [react(), vanillaExtractPlugin(), svgr(), dts(), visualizer()]
  if(process.env.BUILD_TYPE !== "story"){
    plugins.push(mdxPlugin);
  }else{
    console.log("Skipping mdx plugin for storybook!")
  }
  return process.env.BUILD_TYPE === "docs" ? {

      base: process.env.NODE_ENV==="production" ? "/react-code-scanner/" : "/",
      build: {
        //outDir: "docs"
      },
      plugins
    } : {
      build: {
        outDir: "libs",
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
      plugins
    }
})
