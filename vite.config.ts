import { defineConfig, loadEnv } from 'vite';
// 导入类型
import type { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import autoprefixer from 'autoprefixer';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

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
    const env = loadEnv(mode, process.cwd());
    return defineConfig({
        root: process.cwd(), // 项目根路径，默认就是根目录，不需要设置
        base: '/demo', // 公共 uri
        publicDir: process.cwd() + 'public', // 默认就是根目录下 public 文件夹
        envPrefix: 'VITE_', // 环境变量以 VITE_ 开头，见 .env 文件
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
                dts: path.resolve(__dirname, './src/types/auto-imports.d.ts')
            }),
            Components({
                resolvers: [ElementPlusResolver()],
                dts: path.resolve(__dirname, './src/types/components.d.ts')
            })
        ],
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
            /**
             * __dirname 当前模块路径，等效 path.dirname()，指向 js 文件的绝对路径
             * ./ 表示 node 命令执行时所在目录的相对路径
             */
            alias: {
                '@': path.resolve(__dirname, './src'),
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
            },
            preserveSymlinks: true
        },
        // css 预处理配置
        css: {
            modules: {
                // 自定义csss属性名：name 表示文件名，local 表示类名
                generateScopedName: '[name]_[local]_[hash:base64:5]'
            },
            preprocessorOptions: {
                //define global scss variable
                scss: {
                    api: 'modern-compiler',
                    // 导出全局变量
                    additionalData: `@use "@/styles/theme.scss" as *;`
                }
            },
            postcss: {
                plugins: [
                    // 这个插件主要用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题。
                    autoprefixer({
                        // 指定目标浏览器
                        overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
                    })
                ]
            }
        },
        // 服务配置
        server: {
            hmr: true,
            host: true, // 或者指定 IP，相当于 0.0.0.0
            port: Number(env.VITE_APP_PORT),
            open: false, // 启动打开浏览器
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_APP_BASE_URL, // 访问路径 /xxx，转发到 target，同时改变访问源，放置跨域问题
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path): string => path.replace(new RegExp('^' + 'env.VITE_APP_BASE_API'), '') // 对 uri 进行匹配替换
                }
            }
        },
        // 编译
        build: {
            // target: "",  // 编译目标，不同版本的语法不同，可以自定义目标
            outDir: 'dist',
            sourcemap: false,
            manifest: false,
            chunkSizeWarningLimit: 2000, // 打包后单文件大小限制 kb
            /**
             * Rollup 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码，例如库或应用程序
             */
            rollupOptions: {
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
                        }
                    }
                ]
            },
            // 压缩插件
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            }
        }
    });
};
