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

    let constructor = function() {
      var args = Array.from(arguments);
      if (args.length > dependencies.length) {
        args = args.slice(dependencies.length);
      }
      return new target(...args);
    };
    constructor.prototype = target.prototype;

    return constructor.bind(undefined, ...depends);
  };
}
