<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";

Quill.register("modules/cursors", QuillCursors);

let quill: Quill;
let provider: WebsocketProvider;
let binding: QuillBinding;

onMounted(() => {
  const editor = document.querySelector("#editor") as HTMLElement;
  quill = new Quill(editor, {
    theme: "snow",
    modules: {
      cursors: true,
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block", "link", "video"],
      ],
      history: {
        userOnly: true,
      },
    },
    placeholder: "Compose an epic...",
  });

  const cursors = quill.getModule("cursors");

  const ydoc = new Y.Doc();
  const ytext = ydoc.getText("quill");

  provider = new WebsocketProvider(
    "ws://localhost:1234", 
    "quill-demo-room",
    ydoc
  );


  binding = new QuillBinding(ytext, quill, provider.awareness);

  const userName = "User" + Math.floor(Math.random() * 100);
  const userColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  provider.awareness.setLocalStateField("user", {
    name: userName,
    color: userColor,
  });
});

onBeforeUnmount(() => {
  if (provider) {
    provider.destroy();
  }
  if (binding) {
    binding.destroy();
  }
  if (quill) {
    quill.disable(); 
    quill.root.innerHTML = "";
    quill = undefined as unknown as Quill;
  }
});
</script>

<style scoped>
#editor {
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
