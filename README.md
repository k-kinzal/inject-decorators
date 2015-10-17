# inject-decorators

Simple dependency injector.

## Get started

```
npm install --save-dev inject-decorators
```

## Usage

```
let num = 1;
let str = "abc";
let bool = true;
let symbol = Symbol();

@Inject(num, str, bool, symbol)
class Foo {
  constructor(num, str, bool, symbol) {
    this.num = num;
    this.str = str;
    this.bool = bool;
    this.symbol = symbol;
  }
};

let foo = new Foo();

assert(foo.num === num);
assert(foo.str === str);
assert(foo.bool === bool);
assert(foo.symbol === symbol);
```

```
class Foo {};

@Inject(Foo)
class Bar {
  constructor(foo) {
    this.foo = foo;
  }
};

@Inject(Bar)
class Baz {
  constructor(bar) {
    this.bar = bar;
  }
}

let baz = new Baz();

assert(baz instanceof Baz);
assert(baz.bar instanceof Bar);
assert(baz.bar.foo instanceof Foo);
```