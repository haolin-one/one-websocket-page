<!--
 * @Date: 2024-02-02 10:20:42
 * @LastEditors: wanghaolin howlingone@163.com
 * @LastEditTime: 2024-02-05 13:56:13
-->
<script setup lang="ts">
import { onUnmounted, reactive, ref } from "vue";
import {
  NWatermark,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NH1,
  NConfigProvider,
  darkTheme,
  NTimeline,
  NTimelineItem,
  NTime,
  NCode,
  NIcon,
  NMessageProvider,
  NCard,
  NScrollbar,
} from "naive-ui";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { CopyOutline } from "@vicons/ionicons5";
import ContentMessage from "./components/ContentMessage.vue";
// import { useClipboardItems, usePermission } from "@vueuse/core";
import Clipboard from "clipboard";

const clipboard = new Clipboard(".n-icon");
clipboard.on("success", () => {
  window.$message.success("复制成功");
});

// usePermission("clipboard-read");
// usePermission("clipboard-write");

hljs.registerLanguage("json", json);

const isDarkTheme = ref(false);

interface IFormState {
  socketUrl: string;
}
const formValue = reactive<IFormState>({
  socketUrl: "",
});

let socket = ref<WebSocket>();
function handleConnect(): void {
  if (socket.value) {
    socket.value.close();
  }
  if (formValue.socketUrl) {
    socket.value = new WebSocket(formValue.socketUrl);
    socket.value.onopen = function () {
      window.$message.success("连接成功");
    };
    socket.value.onmessage = function (message) {
      console.log(message);

      messageList.value.unshift({
        time: new Date(),
        data: message.data,
      });
    };
  }
}

function handleClose(): void {
  if (socket.value) {
    socket.value.close();
    window.$message.success("断开成功");
    socket.value = undefined;
  }
}

const messageList = ref<any[]>([]);
function handleClear(): void {
  messageList.value.length = 0;
  window.$message.success("清空成功");
}

// const { copy } = useClipboardItems();
// function createClipboardItems(text: string) {
//   const mime = "text/html";
//   const blob = new Blob([text], { type: mime });
//   return new ClipboardItem({
//     [mime]: blob,
//   });
// }

// function handleCopy(message: string) {
//   // navigator.clipboard.writeText(message).then(() => {
//   //   window.$message.success("复制成功");
//   // });
//   console.log([createClipboardItems(message)]);

//   copy([createClipboardItems(message)]);
// }

onUnmounted(() => {
  handleClose();
});
</script>

<template>
  <n-config-provider :theme="isDarkTheme ? darkTheme : undefined" :class="{ darkTheme: isDarkTheme }" :hljs="hljs">
    <n-message-provider>
      <ContentMessage />
    </n-message-provider>
    <n-watermark
      content="交付F4"
      cross
      selectable
      :font-size="16"
      :line-height="16"
      :width="192"
      :height="128"
      :x-offset="12"
      :y-offset="28"
      :rotate="-15"
      class="app"
    >
      <n-button class="theme-button" quaternary @click="isDarkTheme = !isDarkTheme"> 切换主题 </n-button>
      <NH1>one-websocket-page</NH1>
      <n-form ref="formRef" class="form" :model="formValue" label-placement="left">
        <n-form-item>
          <n-input
            v-model:value="formValue.socketUrl"
            placeholder=" ws://192.16.6.44:8088/scada/pullWaterLabel"
            :disabled="Boolean(socket)"
          />
        </n-form-item>
        <n-form-item>
          <div class="button-list">
            <n-button class="button-item" strong secondary round type="info" v-if="!socket" @click="handleConnect">连接</n-button>
            <n-button class="button-item" strong secondary round type="success" v-else>连接中...</n-button>
            <n-button class="button-item" strong secondary round type="error" @click="handleClose"> 断开连接 </n-button>
            <n-button class="button-item" strong secondary round type="warning" @click="handleClear"> 清空消息 </n-button>
          </div>
        </n-form-item>
      </n-form>

      <div class="textarea">
        <n-scrollbar style="max-height: 100%" trigger="none">
          <n-timeline>
            <n-timeline-item type="info" v-for="item in messageList">
              <template #default>
                <n-card>
                  <n-code :code="item.data" language="json" word-wrap></n-code>
                </n-card>
                <!-- {{ item.data }} -->
              </template>
              <template #header>
                <div class="message-header">
                  <n-time :time="item.time" type="datetime" />
                  <n-icon :component="CopyOutline" :data-clipboard-text="item.data"></n-icon>
                </div>
              </template>
            </n-timeline-item>
          </n-timeline>
        </n-scrollbar>
      </div>
    </n-watermark>
  </n-config-provider>
</template>

<style scoped lang="scss">
.n-config-provider {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f7f8fc;

  &.darkTheme {
    background-color: #101014;
  }
}
:deep .n-card__content {
  height: 100%;
}
.app {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .theme-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .form {
    width: 50%;

    .button-list {
      .button-item {
        margin-right: 10px;
      }
    }
  }
  .textarea {
    width: 50%;
    height: 60% !important;

    .n-timeline {
      width: 100%;
      height: 100%;
    }

    .message-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .n-icon {
        cursor: pointer;
        margin-right: 10px;
      }
    }
  }
}
</style>
