import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    { path: '/', component: () => import('../views/home.vue') },
    { path: '/book', component: () => import('../views/chat.vue') },
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes,
});

export default router;
