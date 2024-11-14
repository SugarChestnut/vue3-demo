export {};

/**
 * 类的属性在顶层声明
 */
class Point {
    // ，
    /**
     * 通常认为 _ 开头的属性是私有属性
     * 由于 private 存在一些问题，即使添加了标识，也还是可以访问的，一般不推荐使用，可以使用 ES6 的标准，在属性前面添加 #
     */
    #x: number;

    // 可以赋予初始值
    y: number = 3;

    // 函数重载，先声明，再合并实现
    constructor();
    constructor(x: number, y: number);
    constructor(x?: number, y?: number) {
        if (typeof x === 'number' && typeof y === 'number') {
            // 实际调用的是 set 方法
            this.x = x;
            this.y = y;
        }
    }

    get x(): number {
        console.log('get', this.#x);
        return this.#x;
    }

    set x(x: number) {
        console.log('set', x);
        this.#x = x;
    }

    /**
     * 静态方法
     */
    static distance(p1: Point, p2: Point): number {
        return 1;
    }

    add(point: Point): Point {
        // this.x 实际调用的是 get 方法
        return new Point(this.x + point.x, this.y + point.y);
    }
}

let obj = new Point(3, 3).add(new Point(1, 1));
console.log(obj.x);
