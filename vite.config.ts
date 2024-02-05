/*
 * @Date: 2024-02-02 10:20:42
 * @LastEditors: wanghaolin howlingone@163.com
 * @LastEditTime: 2024-02-04 17:31:00
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue()],
});
