import { defineConfig, loadEnv } from 'vite';
// 导入类型
import type { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const OUT_PUT_DIR: string = 'dist';
/**
 * __dirname 当前模块路径，等效 path.dirname()，指向 js 文件的绝对路径
 * ./ 表示 node 命令执行时所在目录的相对路径
 */
const pathSrc: string = path.resolve(__dirname, './src');

/**
 * https://vite.dev/config/
 *
 * export 一个函数，函数期望传入一个符合 ConfigEnv 类型的对象，并且从这个传入的对象中解构出名为 mode 的属性值，
 * 在函数内部就可以直接使用这个 mode 值，返回一个 UserConfig
 * 可以简单的写成 (mode) => {}
 *
 * @type {import ('vite').UserConfig}}
 */
export default ({ mode }: ConfigEnv): UserConfig => {
    /**
     * 获取环境
     * 默认 mode = development，通过 --mode 参数修改
     * mode = dev，则会加载 .env.dev 文件的配置
     */
    const env: Record<string, string> = loadEnv(mode, process.cwd());
    return defineConfig({
        root: process.cwd(), // 项目根路径，默认就是根目录，不需要设置
        base: '/demo', // 公共 uri
        publicDir: process.cwd() + 'public', // 默认就是根目录下 public 文件夹
        plugins: [vue() /*splitVendorChunkPlugin()*/],
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
            // 路径别名
            alias: {
                '@': pathSrc,
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
            },
            preserveSymlinks: true,
        },
        css: {
            preprocessorOptions: {
                //define global scss variable
                scss: {
                    additionalData: `@use "@/styles/theme.scss" as *;`,
                },
            },
        },
        // 服务配置
        server: {
            hmr: true,
            host: true, // 或者指定 IP，相当于 0.0.0.0
            port: Number(env.VITE_X_APP_PORT),
            open: false, // 启动打开浏览器
            proxy: {
                [env.VITE_X_APP_BASE_API]: {
                    target: env.VITE_X_APP_BASE_URL, // 访问路径 /xxx，转发到 target，同时改变访问源，放置跨域问题
                    changeOrigin: true,
                    rewrite: (path): string => path.replace(new RegExp('^' + '/xxx'), ''), // 对 uri 进行匹配替换
                },
            },
        },
        build: {
            // target: "",  // 编译目标，不同版本的语法不同，可以自定义目标
            outDir: OUT_PUT_DIR,
            // 生成源码地图
            sourcemap: false,
            manifest: false,
            chunkSizeWarningLimit: 2000, // 打包后单文件大小限制 kb
            rollupOptions: {
                /**
                 * Rollup 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码，例如库或应用程序
                 */
                // input: {},
                // plugins: [],
                output: [
                    {
                        /**
                         * https://rollupjs.org/configuration-options/
                         * [name] 为 manualChunks 函数的输出
                         */
                        // dir: "",
                        chunkFileNames: 'static/js/[name]-[hash].js', // 非入口模块，如 import 的文件
                        entryFileNames: 'static/js/[name]-[hash].js', // 入口模块文件
                        assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 静态资源文件
                        /**
                         * 可以为键值对或者函数
                         * 当函数返回字符串的时候，那么该模块和其依赖被放到一个自定义chunk中
                         * 将不同的页面打包到不同的chunk中，只有用户访问该页面的时候才会被加载
                         * @param id 文件绝对路径
                         * @returns
                         */
                        manualChunks: (id) => {
                            if (id.includes('node_modules')) {
                                return id.split('node_modules/')[1].split('/')[1];
                            }
                        },
                    },
                ],
            },
            // 压缩插件
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
    });
};
