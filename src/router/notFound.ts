import type { RouteRecordRaw } from 'vue-router';
import NotFound from '@/views/NotFound.vue';

export const routesNotFound: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
];
