/**
 * global.d.ts主要用于在 TypeScript 项目中声明全局变量、类型、模块扩充等内容，
 * 使得这些声明能够在整个项目的 TypeScript 代码中生效，而不需要在每个使用到相关内容的文件中单独进行声明。
 */

/**
 * declare global 必须在一个模块里才能生效，如果一个文件没有 import 或者 export，TypeScript 不会将该文件作为一个模块，
 * 所以使用了空的导入或者导出
 */
// import '';
export {};

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
    // 可以不导入而直接使用
    declare type Recordable<T = any> = Record<string, T>;

    declare type Indexable<T = any> = {
        [key: string]: T;
    };
}

// 还是需要导入的，因为有 import export
declare module ot {
    interface op {
        v: string;
        l: string;
    }
}
