<!--
 * @Date: 2024-02-02 15:27:08
 * @LastEditors: wanghaolin howlingone@163.com
 * @LastEditTime: 2024-02-02 15:34:12
-->
<template>
  <div></div>
</template>

<script lang="ts">
import { useMessage } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    window.$message = useMessage();
  },
});
</script>

<style scoped lang="scss"></style>
