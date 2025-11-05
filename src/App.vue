<script setup lang="ts"></script>

<template>
  <div id="app">
    <div class="container">
      <div class="title">Yjs Demos</div>
      <div>
        <nav class="link">
          <router-link to="/">Yjs Editor</router-link>
          <router-link to="/todoList">Yjs Todo List</router-link>
          <router-link to="/yjsBoard">Yjs Board</router-link>
        </nav>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lan="less">
.container{
  display: flex;
  flex-direction: column;
  
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.link {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  gap: 20px;
}
</style>
