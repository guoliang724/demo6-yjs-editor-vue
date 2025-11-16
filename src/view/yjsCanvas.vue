<template>
  <div class="container">
    <h1>🖌️ Yjs collaborative board</h1>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label>
        🎨 color：
        <input type="color" />
      </label>
      <label>
        📏 bold：
        <input type="range" min="1" max="20" />
      </label>
      <!-- 当前的状态：是画笔还是橡皮擦 -->
      <button>"Pen🖌️"</button>
      <button>🧹 clean up</button>
    </div>

    <canvas ref="canvasRef" class="board" width="800" height="500"></canvas>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Segoe UI", sans-serif;
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  min-height: 100vh;
}
h1 {
  color: #111827;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
canvas.board {
  border: 2px solid #d1d5db;
  background: #ffffff;
  border-radius: 12px;
  cursor: crosshair;
}
button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #2563eb;
}
button.active {
  background: #f97316;
}
</style>
