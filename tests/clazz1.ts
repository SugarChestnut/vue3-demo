export {};

/**
 * 通过类型创建类对象
 */
class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

// typeof 获取类型
function create1(Clazz: typeof Point, x: number, y: number): Point {
    return new Clazz(x, y);
}

// 类只是构造函数的一种语法糖，本质上是构造函数的另一种写法
type PointClass = new (x: number, y: number) => Point;
function create2(Clazz: new (x: number, y: number) => Point, x: number, y: number): Point {
    return new Clazz(x, y);
}
// 对象形式
function create3(Clazz: { new (x: number, y: number): Point }, x: number, y: number): Point {
    return new Clazz(x, y);
}

// 通过抽取出构造接口
interface PointConstructor {
    new (x: number, y: number): Point;
}
function create4(Clazz: PointConstructor, x: number, y: number): Point {
    return new Clazz(x, y);
}

// 只要对象根类具有相同的结构，也可以是该类型
const p: Point = {
    x: 1,
    y: 2
};

