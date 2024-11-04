/**
 * 它出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。
 * 但是，自从有了 ES 模块，官方已经不推荐使用 namespace 了。
 */

namespace Test {
    // 只能内部使用，如果在命名空间外使用，需要导出
    export function get() {
        return 'namespace test';
    }

}

let ns = Test.get();