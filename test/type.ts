let arr1: Array<number> = [1, 2, 3]; // 存在版本问题，es2022 版本后会被移除
let arr2: Number[] = [1, 2, 3]

arr2[3] = 4;
// arr2.length = 2;

console.log(arr2); // [1, 2]