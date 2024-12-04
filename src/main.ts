import { createApp } from 'vue';
import { ElLoading } from 'element-plus';
// import './style.css';
import App from './App.vue';
import components from '@/components';
import i18n from './locals'; // 国际化
import { useAppStoreWithOut } from '@/store/modules/app';
import { store } from './store';
import './styles/index.ts';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const loading = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgb(0, 0, 0, 0.8)'
});
const app = createApp(App);
const appStore = useAppStoreWithOut();

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(ElementPlus, { locale: zhCn });
app.use(components);
app.use(i18n);
app.use(store);
mountApp();

async function mountApp() {
    // 其他费时的加载操作
    await appStore.setTitle();
    // 加载路由
    const router = await import('./router');
    /*
        全局注册 RouterView 和 RouterLink 组件。
        添加全局 $router 和 $route 属性。
        启用 useRouter() 和 useRoute() 组合式函数。
        触发路由器解析初始路由。
    */
    app.use(router.default).mount('#app');
    loading.close();
}
