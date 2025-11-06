<template>
  <section class="todoapp">
    <header class="header">
      <h1>Collaborative Todo List</h1>
      <input
        type="text"
        class="new-todo"
        placeholder="Add new todo item (press Enter to confirm)"
        v-model="newTodo"
        @keyup.enter="addTodoHandler"
      />
    </header>

    <section class="main" v-if="todoList.length">
      <ul class="todo-list">
        <li
          v-for="(item, index) in todoList"
          :key="index"
          :class="{
            completed: item.get('done'),
          }"
        >
          <div class="view">
            <input
              type="checkbox"
              class="toggle"
              :checked="Boolean(item.get('done'))"
              @change="toggleTogo(item as any)"
            />
            <label>{{ item.get("text") }}</label>
            <button class="destroy" @click="deleteTodo(index)"></button>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import * as Y from "yjs";
import { ref, onMounted } from "vue";

type TodoItem = {
  id: number;
  text: string;
  done: boolean;
};

const ydoc = new Y.Doc();
const ytodoList = ydoc.getArray<Y.Map<TodoItem>>("todos");

const YjsChannel = new BroadcastChannel("yjs-todo");

const newTodo = ref("");
//  为什么会有todoList? 因为本地要留有一份跟ytodoList一样的数据结构做对比；
const todoList = ref<Y.Map<TodoItem>[]>([]);

function addTodoHandler() {
  if (newTodo.value.trim() === "") return;

  // const newItem: TodoItem = {
  //   id: new Date().getTime() + Math.random(),
  //   text: newTodo.value.trim(),
  //   done: false,
  // };

  const newYjsItem = new Y.Map();
  newYjsItem.set("id", new Date().getTime() + Math.random());
  newYjsItem.set("text", newTodo.value.trim());
  newYjsItem.set("done", false);

  ytodoList.push([newYjsItem as Y.Map<TodoItem>]);

  newTodo.value = "";
}

function updateList() {
  todoList.value = ytodoList.toArray();
}

function toggleTogo(item: Y.Map<any>) {
  const isComplete = item.get("done");
  item.set("done", !isComplete);
}

function deleteTodo(index: number) {
  ytodoList.delete(index, 1);
}

onMounted(() => {
  updateList();

  ytodoList.observeDeep(() => updateList());

  ydoc.on("update", (update) => {
    YjsChannel.postMessage(update);
  });

  YjsChannel.addEventListener("message", (e) => {
    Y.applyUpdate(ydoc, e.data);
  });
});
</script>

<style scoped>
@import "../styles/todo.css";
</style>
