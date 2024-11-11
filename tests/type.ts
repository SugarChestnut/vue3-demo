interface MyInterface {
    toString(): string; // 继承的属性
    prop: number; // 自身的属性
}

const obj: MyInterface = {
    // 正确
    prop: 123,
    toString: () => {
        return 'aa';
    }
};
console.log(typeof obj);
console.log(obj.prop);
console.log(obj.toString());