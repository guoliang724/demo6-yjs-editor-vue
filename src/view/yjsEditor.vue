<template>
  <div>
    <h2 class="text">Yjs Editor</h2>
    <div class="editor-container">
      <!-- 编辑器 -->
      <textarea
        name="editor"
        id="editor"
        placeholder="Enter content here to sync with other tabs..."
      ></textarea>
      <!-- 当前状态 -->
      <div class="status">
        <span id="currentStatus">Waiting for input</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Y from "yjs";
import { onMounted } from "vue";

onMounted(() => {
  // 创建 Yjs 副本
  const doc = new Y.Doc();
  // 基于这个副本创建一个共享文本
  const text = doc.getText("sharedText");
  // 接下来创建一个 broadcastchannel
  const channel = new BroadcastChannel("yjs-demo");

  // 接下来获取需要同步内容的 DOM 元素
  const editor = document.getElementById("editor") as HTMLTextAreaElement;
  const status = document.getElementById("currentStatus") as HTMLSpanElement;

  let composing = false; // 用于判断是否在输入中

  const syncToYjs = () => {
    // 需要做的事情，就是将用户输入的内容同步到 Yjs 副本
    const current = text.toString(); // 获取当前副本的内容
    const inputValue = editor.value; // 获取用户输入的内容
    if (current !== inputValue) {
      // 更新 Yjs 副本的内容
      text.delete(0, current.length); // 删除当前副本的内容
      text.insert(0, inputValue); // 插入用户输入的内容
      status.innerText = "Editing locally✍️";
    }
  };

  editor.addEventListener("compositionstart", () => {
    composing = true; // 开始输入
  });

  editor.addEventListener("compositionend", () => {
    composing = false; // 输入结束
    syncToYjs(); // 同步到 Yjs 副本
  });

  // 该方法用于同步编辑器的内容到 Yjs 副本

  // 用户在编辑器进行输入的时候，需要做的事情
  editor.addEventListener("input", () => {
    if (!composing) syncToYjs();
  });

  // 当 Yjs 副本的内容发生更新的时候，需要将这个更新广播出去
  doc.on("update", (update) => {
    // 该事件会在 Yjs 副本的内容发生更新的时候触发
    channel.postMessage(update); // 将更新广播出去
  });

  // 同理，这边也需要监听 BroadcastChannel 的消息
  channel.addEventListener("message", (event) => {
    // 在当前的副本上面应用这个更新
    Y.applyUpdate(doc, event.data); // 将更新应用到当前副本，注意这里只是 Yjs 的副本更新，编辑器内容并没有更新
  });

  // 当 Yjs 副本的内容发生更新的时候，需要将这个更新应用到编辑器上面
  text.observe(() => {
    if (editor.value !== text.toString()) {
      editor.value = text.toString(); // 将编辑器的内容更新为 Yjs 副本的内容
      status.innerText = "Syncing...🔄";
      setTimeout(() => {
        status.innerText = "Waiting for input"; // 1秒后恢复为等待输入状态
      }, 1000);
    }
  });

  editor.value = text.toString(); // 初始化编辑器的内容为 Yjs 副本的内容
});
</script>

<style scoped>
.editor-container {
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  width: 400px;
  max-width: 100%;
  position: relative;
  margin-top: 1rem;
}

.text {
  text-align: center;
}

textarea {
  width: 100%;
  height: 100px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  resize: none;
  box-sizing: border-box;
}
.status {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: right;
}
.status span {
  color: #10b981;
  font-weight: bold;
}
</style>
