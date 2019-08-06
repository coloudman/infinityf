# Infinityf

## Infinity recursive function

infinityf makes javascript able to use infinity call stack if you have enought memory.

## Installation

```bash
$ npm install infinityf
```


## Usage

```js
const infinityf = require("infinityf");

var infFibo = (get,arg) => {
    if(arg <= 2)
        return 1;
    get(infFibo, arg-1, (v1)=>{
        get(infFibo, arg-2, (v2)=> {
            return v1 + v2;
        });
    });
};
console.log(infinityf(infFibo,10));
```
this code is the same as :
```js
var fibo = (n) => {
    if(n <= 2)
        return 1;
    return fibo(n-1) + fibo(n-2);
};
console.log(fibo(10));
```
This library's performance is not good(use time, 1:35, vanilla:infinityf),
but it can be used to complex / deep data explore algorithm.

ex) tree, relational data


## Functions / Types

### infinityf(InfinityFunction f, arg)
infinityf runs InfinityFunction f with arg and return result.

### InfinityFunction, (get,arg)=>{ ... }
InfinityFunction is not a real type(class).
InfinityFunction is made by user code, like this:

```js
let myInfinityFunction = (get,arg) => {
    ...
};
```

InfinityFunction can have only one arg. (I will update it can use multiple args.)

### get(InfinityFunction f, arg, CallbackFunction callback)
get function is used to get other InfinityFunction's result with args.
After get other InfinityFunction's result, it will call callback with result.

After call the get function, do not use return because return don't do anything.
I recommend to don't run anything after use get function.

```js
let myInfinityFunction = (get,arg) => {
    get(otherIF,7,data=>{
        console.log(`otherF's result: ${data}`);
    });
    otherF(); //NOT GOOD.
};
```


### CallbackFunction, result => { ... }
CallbackFunction is not a real type(class).
CallbackFunction is made by user code, like this:

```js
let myInfinityFunction = (get,arg) => {
    get(otherIF,7,data=>{ //<= this is CallbackFunction
        console.log(`otherF's result: ${data}`);
    });
};
```


### Umm... How I can return the value?
You can return the value in everywhere in InfinityFunction.
IinfinityFunction or CallbackFunction.

this is a fibonacci number function:
```js
const infinityf = require("infinityf");

var infFibo = (get,arg) => {
    if(arg <= 2)
        return 1; //can return
    get(infFibo, arg-1, (v1)=>{
        get(infFibo, arg-2, (v2)=> {
            return v1 + v2; //can return in CallbackFunction
        });
    });
};
console.log(infinityf(infFibo,10));
```