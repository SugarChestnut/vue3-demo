import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import { routesNotFound } from './notFound';

// 路由配置
const routes: RouteRecordRaw[] = [
    ...routesNotFound,
    {
        path: '',
        name: 'Home',
        meta: {
            i18nKey: 'settings',
            icon: 'settings',
            hasGroup: false,
            activate: true,
            title: 'Settings',
        },
        component: () => import('../views/Home.vue'),
        children: [],
    },
];

// 创建路由
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes,
});

// 给 window 挂载一个属性，放置正在请求的任务
(window as any).axiosCancel = [];

// 设置一个监视器，路由跳转的时候，判断跳转
router.beforeEach((to, from, next) => {
    if ((window as any).axiosCancel.length !== 0) {
        for (const func of (window as any).axiosCancel) {
            setTimeout(func(), 0);
        }
        (window as any).axiosCancel = [];
    }

    console.log(from.path, ' -> ', to.path);

    // 执行跳转，可以传参，跳转到其他路径
    next();
});

export default router;
