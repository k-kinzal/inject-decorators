'use strong';

import _ from 'lodash';

export default function Inject(...dependencies) {
  return (target) => {
    let depends = Array.from(dependencies).map((v) => {
      if (_.isFunction(v) && v.name.match(/^([A-Z]|bound [A-Z]|bound constructor)/)) {
        return new v();
      } else {
        return v;
      }
    });
    let stringDepends = dependencies.filter((v) => _.isString(v));

    let constructor = function() {
      var args = Array.from(arguments);
      if (args.length > dependencies.length) {
        args = args.slice(dependencies.length);
        if (args.length === stringDepends.length) {
          args = Array.from(arguments).slice(0, dependencies.length).map((v) => {
            if (args.length > 0 && _.isString(v)) {
              return args.shift();
            } else {
              return v;
            }
          });
        }

      }
      return new target(...args);
    };
    constructor.prototype = target.prototype;

    let c = constructor.bind(undefined, ...depends);
    c.$inject = stringDepends;

    return c;
  };
}
