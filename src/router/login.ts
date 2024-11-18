import type { RouteRecordRaw } from 'vue-router';
import Login from '@/views/Login.vue';

export const routesLogin: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
];