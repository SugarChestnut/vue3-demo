# declare

declare 只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构。(一般出现在 .d.ts 文件中)
另外，所有 declare 语句都不会出现在编译后的文件里面。

配合 .d.ts 文件，如果一个声明文件的顶层作用域中没有 import && export，那么这个声明文件就是一个全局类声明文件。
那么其他文件使用其声明的类型的时候，就不需要通过 import 导入，而可以直接使用

属性索引 在类中
