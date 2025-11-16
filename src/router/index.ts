import { createRouter, createWebHashHistory } from "vue-router";
import quillEditor from "../view/quillEditor.vue";
import TodoList from "../view/yjsTodoList.vue";
import YjsBoard from "../view/yjsBoard.vue";
import YjsEditor from "../view/yjsEditor.vue";
import yjsCanvas from "@/view/yjsCanvas.vue";
import Home from "@/view/home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/quillEditor", component: quillEditor },
  { path: "/yjsTodoList", component: TodoList },
  { path: "/yjsBoard", component: YjsBoard },
  { path: "/yjsEditor", component: YjsEditor },
  { path: "/yjsCanvas", component: yjsCanvas },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
