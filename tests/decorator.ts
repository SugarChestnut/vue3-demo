export {};

function simpleDecorator(target: any, context: any) {
    console.log('hi, this is ' + target);
    return target;
}

@simpleDecorator
class A {
    v: number = 3;
} // "hi"

function Greeter(value, context) {
    if (context.kind === 'class') {
        value.prototype.greet = function () {
            console.log('你好');
        };
    }
}

@Greeter
class User {
}

let u = new User();
// u.greet(); // "你好"
