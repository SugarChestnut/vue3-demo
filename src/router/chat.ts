import type { RouteRecordRaw } from 'vue-router';
import Chat from '@/views/Chat.vue';

export const routesChat: Array<RouteRecordRaw> = [
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
    },
];