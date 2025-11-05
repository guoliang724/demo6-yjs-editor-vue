import { createRouter, createWebHashHistory } from "vue-router";
import YjsEditor from "../view/yjsEditor.vue";
import TodoList from "../view/yjsTodoList.vue";
import YjsBoard from "../view/yjsBoard.vue";

const routes = [
  { path: "/", component: YjsEditor },
  { path: "/todoList", component: TodoList },
  { path: "/yjsBoard", component: YjsBoard },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
