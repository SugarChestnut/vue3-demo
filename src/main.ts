import { createApp } from 'vue';
import { ElLoading } from 'element-plus';
import './style.css';
import App from './App.vue';
import components from '@/components';
import i18n from './locals'; // 国际化
import { useAppStoreWithOut } from '@/store/modules/app';
import { store } from './store';

const loading = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgb(0, 0, 0, 0.8)',
});
const app = createApp(App);
const appStore = useAppStoreWithOut();

app.use(components);
app.use(i18n);
app.use(store);
mountApp();

async function mountApp() {
    // 其他费时的加载操作
    await appStore.title();
    // 加载路由
    const router = await import("./router")
    app.use(router.default).mount('#app');
    loading.close()
}
