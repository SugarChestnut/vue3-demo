import { defineStore } from "pinia";
import { store } from "@/store";
import { Themes } from "@/constants/data";
// 接口定义
interface AppState {
    title: string,
    theme: string;
}

// 定义一个存储对象实例
export const appStore = defineStore({
    id: "app",
    // 函数，返回一个 AppState 对象
    state: (): AppState => ({
        title: 'vue3 demo',
        theme: Themes.Light
    }),
    getters: {
        title(): string {
            return this.title;
        }
    },
    actions: {

    },
});

export function useAppStoreWithOut(): Recordable {
    return appStore(store);
}
