import { createRouter, createWebHashHistory } from "vue-router";
import quillEditor from "../view/quillEditor.vue";
import TodoList from "../view/yjsTodoList.vue";
import YjsBoard from "../view/yjsBoard.vue";
import YjsEditor from "../view/yjsEditor.vue";
import Home from "@/view/home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/quillEditor", component: quillEditor },
  { path: "/yjsTodoList", component: TodoList },
  { path: "/yjsWhiteBoard", component: YjsBoard },
  { path: "/yjsEditor", component: YjsEditor },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
