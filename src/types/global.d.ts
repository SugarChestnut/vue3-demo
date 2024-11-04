/**
 * lobal.d.ts主要用于在 TypeScript 项目中声明全局变量、类型、模块扩充等内容，
 * 使得这些声明能够在整个项目的 TypeScript 代码中生效，而不需要在每个使用到相关内容的文件中单独进行声明。
 */
declare global {
    const __APP_INFO__: {
        pkg: {
            name: string;
            version: string;
            dependencies: Recordable<string>;
            devDependencies: Recordable<string>;
        };
        lastBuildTime: string;
    };

    declare type Recordable<T = any> = Record<string, T>;
}
