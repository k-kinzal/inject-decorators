'use strong';

import _ from 'lodash';

export default function Inject(...dependencies) {
  return (target) => {
    let depends = aggregatParentDependencies(target, Array.from(dependencies)).map((v) => {
      if (_.isFunction(v) && v.name.match(/^([A-Z])/)) {
        return new v();
      } else {
        return v;
      }
    });
    let stringDepends = dependencies.filter((v) => _.isString(v));

    let Constructor = function() {
      var args = arguments.length > 0 ? Array.from(arguments) : depends;
      if (arguments.length === stringDepends.length) {
        args = depends.map((v) => {
          if (args.length > 0 && _.isString(v)) {
            return args.shift();
          } else {
            return v;
          }
        });
      }

      target.prototype.constructor.apply(this, args);
    };

    Object.setPrototypeOf(Constructor, target);
    Constructor.prototype = Object.create(target.prototype, {
      constructor: {
        value: Constructor,
        enumerable: false,
        writable: true,
        configurable: true
      }, 
    });

    Object.defineProperty(Constructor, 'name', {writable: true});
    Constructor.name = target.name;

    Constructor.$$dependencies = depends;
    Constructor.$inject = stringDepends;

    return Constructor;
  };
}

function aggregatParentDependencies(target, dependencies) {
  if ('$$dependencies' in target) {
    let depends = target.$$dependencies || [];
    depends.forEach((v) => {
      dependencies.unshift(v);
    });

    dependencies = aggregatParentDependencies(target.prototype, dependencies);
  }

  return dependencies;
}
