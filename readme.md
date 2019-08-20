# Infinityf

## Infinity recursive function

infinityf makes javascript able to use infinity call stack if you have enought memory.

It works exactly the same as vanilla function.
There are ways to use infinity function:

###callback
Best performance. It receive return data in callback function.
Not support async.

Code is a little bit dirty, i don't recommend for the projects using dynamic function call.

###async
Bad performance(in non blocking code). It receive return data by await expression.
Support async.

I think if use this async infinity function as "async function", it will almost don't depress performance.

###generator
Good performance. It receive return data by yield expression.
Not support async.

I recommend this way for general projects.


## Installation

```bash
$ npm install infinityf
```


## Usage

```js
var fibo = (n) => {
    if(n <= 2)
        return 1;
    return fibo(n-1) + fibo(n-2);
};
console.log(fibo(10));
```
this code is the same as :

1.callback
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
console.log(infinityf.callback(infFibo,10));
```

2.async
```js
const infinityf = require("infinityf");

var infFibo = async (get,arg) => {
    if(arg <= 2)
        return 1;
    return await get(infFibo, arg-1) + await get(infFibo, arg-2);
};

infinityf.async(infFibo,10).then(returnValue => {
    console.log(returnValue);
});
```

3.generator
```js
const infinityf = require("infinityf");

var infFibo = function* (get,arg) {
    if(arg <= 2)
        return 1;
    return (yield get(infFibo, arg-1)) + (yield get(infFibo, arg-2));
};

console.log(infinityf.generator(infFibo,10));
```

## Functions / Types

### infinityf\[InfinityFunctionType\](InfinityFunction f, arg)
infinityf runs InfinityFunction f with arg and return result.

1.callback
```js
console.log(infinityf.callback(f,arg));
```

2.async
```js
infinityf.async(f,arg).then(returnedValue => {
    console.log(returnValue);
});
```

3.generator
```js
console.log(infinityf.generator(f,arg));
```

### InfinityFunctionType
String, "callback" or "async" or "generator"

### InfinityFunction
Function, it have to be same type as InfinityFunctionType.

1.callback
```js
let f = (get,arg) => {
    get(func, otherArg, returnedValue => {
        ...
    });
};
```
In callback infinity function / callback function, only call "get" once.

2.async
```js
let f = async (get,arg) => {
    let returnedValue = await get(func, otherArg);
    ...
};
```

3.generator
```js
let f = function* (get,arg) => {
    let returnedValue = yield get(func, otherArg); //use yield to ONLY call get function
    ...
}
```

## about get function

get function is used to get other InfinityFunction's result with args.
After get other InfinityFunction's result, it will call callback with result.


## Generator, Async function

### get function
Simple.

```js
let returnedValue = await get(func, arg); //IN ASYNC INFINITY FUNCTION
let returnedValue = yield get(func, arg); //IN GENERATOR INFINITY FUNCTION
```

### return
Simple..

```js
return returnValue; //IN ASYNC / GENERATOR INFINITY FUNCTION
```

just return.


## Callback function

### get function

After call the get function, do not use return because return don't do anything.
and I recommend to don't run anything after use get function.

```js
let myFunction = (get,arg) => {
    get(otherIF,7,data=>{
        console.log(`otherIF's result: ${data}`);
    });
    otherF(); //NOT GOOD.
};
```


### CallbackFunction, result => { ... }
CallbackFunction is not a real type(class).
CallbackFunction is made by user code, like this:

```js
let myFunction = (get,arg) => {
    get(otherIF,7,data=>{ //<= this is CallbackFunction
        console.log(`otherIF's result: ${data}`);
    });
};
```


### return
You can return the value in everywhere in InfinityFunction (callback).
InfinityFunction (callback) or CallbackFunction.

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