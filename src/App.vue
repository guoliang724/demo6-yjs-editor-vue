<script setup lang="ts">
import router from "./router";
</script>

<template>
  <div id="app">
    <div class="container">
      <router-link to="/"><h1 class="title">Yjs Demos:</h1></router-link>
      <div>
        <nav class="link">
          <router-link to="/quillEditor">Quill Editor</router-link>
          <router-link to="/yjsEditor">Yjs Editor</router-link>
          <router-link to="/yjsTodoList">Yjs Todo List</router-link>
          <router-link to="/yjsBoard">Yjs Board</router-link>
          <router-link to="/yjsCanvas">Yjs Canvas</router-link>
        </nav>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lan="less">
.container {
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.link {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  gap: 20px;
}
</style>
