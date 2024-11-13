/**
 * 接口表示带属性的普通对象
 * 
 * interface 和 type 的区别
 */
interface interObject<Id extends string, Num extends number> {
    // $id: Id;

    // 只读属性
    readonly name: string;

    age: Num,

    // 后面价格问号表示属性不一定存在
    addr?: string;

    // 索引签名，额外的属性
    [propName: string]: any;
}

let obj: interObject<string, number> = {
    id: "aa",
    name: "rtt",
    age: 30,
}

/**
 * 接口表示函数类型
 */
interface interMethod {
    // 签名，没有输入参数，返回一个字符串
    (o: interObject<string, number>): string;
}
let m: interMethod = function () {
    return '接口表示函数类型';
};

console.log(m(obj));
