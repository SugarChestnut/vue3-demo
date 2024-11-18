import { defineStore } from 'pinia';
import { store } from '@/store';
import { Themes } from '@/constants/data';
// 接口定义
interface AppState {
    title: string;
    theme: string;
}

// Function that allows instantiating a store.
export const appStore = defineStore({
    id: 'app',
    // 函数，返回一个 AppState 对象
    state: (): AppState => ({
        title: 'vue3 demo',
        theme: Themes.Light,
    }),
    getters: {
        getTitle(): string {
            return this.title;
        },
    },
    actions: {
        setTitle(data: string): void {
            this.title = data;
        },
    },
});

export function useAppStoreWithOut(): Recordable {
    return appStore(store);
}
