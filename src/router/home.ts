import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';

export const routesHome: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
];