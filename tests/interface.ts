export {}

/**
 * 表示带属性的普通对象
 */
interface interObject {
    $id: string;

    // 只读属性
    readonly name: string;

    age: number,

    // 后面的问号表示属性不一定存在
    addr?: string;

    /**
     * 对象属性索引(一般只有一个)，
     * 属性名只能是 string、number、symbol 三种类型，
     * 同时约束，所有属性名为 string 类型（下面示例） 的，属性值为 any 类型（下面示例）
     * 
     * interface A {
     *      [prop: number]: string;
     * }
     * const obj: A = ["a", "b", "c"];  可以表示成数组
     */
    [prop: string]: any;
}

/**
 * 表示函数类型，类似于函数的对象表示法
 * 
 * let f: {
 *      (o: interObject): string;
 * }
 */
interface interMethod {
    // 签名，没有输入参数，返回一个字符串
    (o: interObject): string;
}

/**
 * 表示构造函数
 */
interface interConstructor {
    new (message: string): Error
}

let obj: interObject = {
    id: "aa",
    name: "rtt",
    age: 30,
}

let m: interMethod = function () {
    return '接口表示函数类型';
};

console.log(m(obj));
