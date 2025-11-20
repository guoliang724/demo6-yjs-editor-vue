<template>
  <div class="container">
    <h1>🖌️ Yjs collaborative board</h1>

    <!-- 工具栏 -->
    <div class="toolbar">
      <label>
        🎨 color：
        <input type="color" v-model="color" />
      </label>
      <label>
        📏 bold：
        <input type="range" min="1" max="20" v-model="size" />
      </label>
      <!-- 当前的状态：是画笔还是橡皮擦 -->
      <button @click="toggle" :class="{ active: isEraser }">
        {{ isEraser ? "pen🖌️" : "eraser" }}
      </button>
      <button @click="clearBoard">🧹 clear</button>
    </div>

    <canvas ref="canvasRef" class="board" width="800" height="500"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as Y from "yjs";
import { ref, onMounted } from "vue";
type Stroke =
  | {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      size: number;
      isEraser: boolean;
    }
  | { type: "clear" };

const canvasRef = ref<HTMLCanvasElement | null>(null);
const color = ref("#000");
const size = ref(4);
const isEraser = ref(false);

const doc = new Y.Doc();
const strokes = doc.getArray<Stroke>("stroke");
const channel = new BroadcastChannel("yjs-whiteBoard");

let ctx: CanvasRenderingContext2D;
let drawing = false;
let lastX = 0;
let lastY = 0;

function isClearStroke(s: Stroke): s is { type: "clear" } {
  return "type" in s && s.type === "clear";
}

function drawLine(info: Stroke) {
  if (isClearStroke(info)) return;

  ctx.strokeStyle = info.isEraser ? "#fff" : info.color;
  ctx.lineWidth = info.size;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(info.x1, info.y1);
  ctx.lineTo(info.x2, info.y2);
  ctx.stroke();
}

function handleMouseDown(e: MouseEvent) {
  drawing = true;

  const rect = canvasRef.value!.getBoundingClientRect();

  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
}

function handleMouseMove(e: MouseEvent) {
  if (!drawing) return;

  const rect = canvasRef.value!.getBoundingClientRect();

  // get the coordinates inside the canvas
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const stroke: Stroke = {
    x1: lastX,
    y1: lastY,
    x2: x,
    y2: y,
    color: color.value,
    size: size.value,
    isEraser: isEraser.value,
  };

  strokes.push([stroke]);

  drawLine(stroke);

  lastX = x;
  lastY = y;
}

function handleMouseUp(e: MouseEvent) {
  drawing = false;
}

function renderStroke(s: Stroke) {
  if (isClearStroke(s)) {
    ctx.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height);
    return;
  }

  drawLine(s);
}

function clearBoard() {
  strokes.push([
    {
      type: "clear",
    },
  ]);
}

function toggle() {
  isEraser.value = !isEraser.value;
}

onMounted(() => {
  const canvas = canvasRef.value!;
  ctx = canvas.getContext("2d")!;

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseleave", handleMouseUp);

  strokes.toArray().forEach(renderStroke);

  doc.on("update", (update) => {
    channel.postMessage(update);
  });

  channel.addEventListener("message", (e) => {
    Y.applyUpdate(doc, e.data);
  });

  strokes.observe((event) => {
    event.changes.added.forEach((item) =>
      item.content.getContent().forEach(renderStroke)
    );
  });
});
</script>

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
