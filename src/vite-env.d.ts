/**
 * 写3个斜线，把node_modules里面的vite文件夹里面的client客户端类型声明文件导入到这个文件里
 */

/// <reference types="vite/client" />

/*
 * 引入外部模块的类型定义
 * 识别 .vue 文件的类型声明文件
 */
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// Element UI
declare module 'element-plus';

// Vue 响应式拖放网格布局组件
declare module 'vue-grid-layout' {
    import Vue from 'vue';
    // 扩展外部组件
    export class GridLayout extends Vue {}

    export class GridItem extends Vue {}

    export interface GridItemData {
        x: number;
        y: number;
        w: number;
        h: number;
        i: string;
    }
}

/**
 * 为 JavaScript 引擎的原生对象添加属性和方法
 * 见 src/types/global.d.ts
 */
declare global {}

/**
 * 定义 .env 文件配置的变量类型
 * .env                # 所有情况下都会加载
 * .env.local          # 所有情况下都会加载，但会被 git 忽略
 * .env.[mode]         # 只在指定模式下加载
 * .env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
 */
interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string;
    readonly VITE_APP_BASE_URL: string;
    readonly VITE_APP_PORT: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
