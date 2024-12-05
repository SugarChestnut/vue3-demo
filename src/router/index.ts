import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import { routesNotFound } from './notFound';
import { routesHome } from './home';
import { routesChat } from './chat';
import { routesLogin } from './login';
import { getCookie } from '@/utils/cookies';
import { ElMessage } from 'element-plus';
import WeChat from '@/views/WeChat.vue';
import WeChat1 from '@/views/WeChat1.vue';

// 路由配置
const routes: RouteRecordRaw[] = [
    {
        path: '/wechat',
        name: 'WeChat',
        component: WeChat,
    },
    {
        path: '/wechat1',
        name: 'WeChat1',
        component: WeChat1,
    },
    ...routesNotFound,
    ...routesHome,
    ...routesChat,
    ...routesLogin
];

// 创建路由
const router = createRouter({
    // 历史记录模式
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: routes,
});

// 给 window 挂载一个属性，放置正在请求的任务
(window as any).axiosCancel = [];

// 设置路由守卫，路由跳转的时候，判断跳转
// 比如权限认证
router.beforeEach((to, from, next) => {
    if ((window as any).axiosCancel.length !== 0) {
        for (const func of (window as any).axiosCancel) {
            setTimeout(func(), 0);
        }
        (window as any).axiosCancel = [];
    }

    const token = getCookie('token');
    if (token) {

    } else {

    }

    ElMessage.info('路由: ' + from.path + ' -> ' + to.path);

    // 执行跳转，可以传参，跳转到其他路径
    next();
});

export default router;
