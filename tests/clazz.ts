export {}

/**
 * 类的属性在顶层声明
 */
class Point {
    // ! 非空断言，表示后续肯定会为这个属性赋值，避免 typescript 检查错误
    // _ 表示是私有属性，所以可以设置 get set 方法
    _x!: number;
    // 可以赋予初始值
    y: number = 3;

    // 构造方法，如果没有提供值，就设置默认值 0
    // constructor();
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    get x(): number {
        return this.x;
    }

    set x(x: number) {
        this._x = x;
    }

    add(point: Point) {
        // return new Point(this.x + point.x, this.y + point.y);
    }
}

let obj = new Point(3, 3);
console.log(obj.x);
