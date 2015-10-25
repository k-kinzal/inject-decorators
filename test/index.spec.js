'use strict';

import Inject from '../src/index';
import assert from 'power-assert';

describe('Inject:', () => {
  it('should be same instance', () => {
    @Inject()
    class Foo {};

    let foo = new Foo();

    assert(foo instanceof Foo);
    assert(foo.constructor.name === 'Foo');
  });

  it('should primitive type is to be injected into the constructor', () => {
    let num = 1;
    let str = 'abc';
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
  });

  it('should array is to be injected into the constructor', () => {
    let arr = [];

    @Inject(arr)
    class Foo {
      constructor(arr) {
        this.arr = arr;
      }
    };

    let foo = new Foo();

    assert(foo.arr === arr);
  });

  it('should object is to be injected into the constructor', () => {
    let obj = {};

    @Inject(obj)
    class Foo {
      constructor(obj) {
        this.obj = obj;
      }
    };

    let foo = new Foo();

    assert(foo.obj === obj);
  });

  it('should function is to be injected into the constructor', () => {
    let fn = function() {};

    @Inject(fn)
    class Foo {
      constructor(fn) {
        this.fn = fn;
      }
    };

    let foo = new Foo();

    assert(foo.fn === fn);
  });

  it('should class is to be injected into the constructor', () => {
    class Foo {};

    @Inject(Foo)
    class Bar {
      constructor(foo) {
        this.foo = foo;
      }
    };

    let bar = new Bar();

    assert(bar.foo !== Foo);
    assert(bar.foo instanceof Foo);
  });

  it('should be able to inject to recursively constructor', () => {
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
  });

  it('should be able to inject to the constructor override arguments', () => {
    @Inject(1)
    class Foo {
      constructor(num) {
        this.num = num;
      }
    };

    let foo = new Foo(2);

    assert(foo.num === 2);
  });

  it('should be able to inject to the constructor override arguments', () => {
    @Inject(1)
    class Foo {
      constructor(num) {
        this.num = num;
      }
    };

    let foo = new Foo(2);

    assert(foo.num === 2);
  });

  it('should be able to inject to the constructor of the inherited class', () => {
    let num1 = 1;
    let num2 = 2;

    class Foo {
      constructor(num) {
        this.num1 = num;
      }
    };
    
    @Inject(num1, num2)
    class Bar extends Foo {
      constructor(num1, num2) {
        super(num1);

        this.num2 = num2;
      }
    }

    let bar = new Bar();

    assert(bar.num1 === num1);
    assert(bar.num2 === num2);
  });

  it('should be able to inject the parent class of the inherited class', () => {
    let num1 = 1;
    let num2 = 2;

    @Inject(num1)
    class Foo {
      constructor(num) {
        this.num1 = num;
      }
    };

    class Bar extends Foo { }
    
    @Inject(num2)
    class Baz extends Bar {
      constructor(num1, num2) {
        super(num1);

        this.num2 = num2;
      }
    }

    let baz = new Baz();

    assert(baz instanceof Baz);
    assert(baz instanceof Bar);
    assert(baz instanceof Foo);
    assert(baz.num1 === num1);
    assert(baz.num2 === num2);
  });

  it('should be able to override arguments the injected into the inherited parent class', () => {
    let num1 = 1;
    let num2 = 2;

    @Inject(num1)
    class Foo {
      constructor(num) {
        this.num1 = num;
      }
    };

    class Bar extends Foo { }
    
    @Inject(num2)
    class Baz extends Bar {
      constructor(num1, num2) {
        super(num1);

        this.num2 = num2;
      }
    }

    let baz = new Baz(3, 4);

    assert(baz.num1 === 3);
    assert(baz.num2 === 4);
  });

  it('should support $inject property in angular', (done) => {
    let num = 1;
    let obj = {};

    @Inject(num, '$rootScope', obj)
    class Foo {
      constructor(num, $scope, obj) {
        this.num = num;
        this.$scope = $scope;
        this.obj = obj;
      }
    }

    let jsdom = require('jsdom');
    jsdom.env(
      '<html ng-app="app"></html>',
      ['https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js'],
      function (err, window) {
        let module = window.angular.module('app', []);
        module.service('foo', Foo);
        module.run(function(foo) {
          assert(foo.$scope.constructor.name === 'n');
          assert(foo.num === num);
          assert(foo.obj === obj);
          done();
        });
      }
    );

  });

  it('should support $inject property in angular-decorators', (done) => {
    var decorators = require('angular-decorators');

    let num = 1;
    let obj = {};

    @decorators.Service('foo')
    @Inject(num, '$rootScope', obj)
    class Foo {
      constructor(num, $scope, obj) {
        this.num = num;
        this.$scope = $scope;
        this.obj = obj;
      }
    }

    let jsdom = require('jsdom');
    jsdom.env(
      '<html ng-app="app"></html>',
      ['https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js'],
      function (err, window) {
        global.angular = window.angular;

        var module = decorators.Module('app', []).add(Foo).publish();
        module.run(function(foo) {
          assert(foo.$scope.constructor.name === 'n');
          assert(foo.num === num);
          assert(foo.obj === obj);
          done();
        });
      }
    );

  });

});
