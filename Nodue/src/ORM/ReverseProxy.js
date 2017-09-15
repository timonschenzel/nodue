module.exports = {
    get(target, property, receiver)
    {
        if (typeof target[property] == 'function') {
            return function(...args) {
                return new Proxy(target[property](...args), Nodue.ORM.Proxy);
            };
        }

        if (target[property] !== undefined) {
            return target[property];
        }

        if (typeof target.nodueModel[property] == 'function') {
            return function(...args) {
                return new Proxy(target.nodueModel[property](...args), Nodue.ORM.Proxy);
            };
        }

        if (target.nodueModel[property] !== undefined) {
            return new Proxy(target.nodueModel[property], Nodue.ORM.Proxy);
        }
    },

    set(target, property, value, receiver)
    {
        if (target[property] !== undefined) {
            target[property] = value;
        } else {
            target['updates'][property] = value;
        }

        return value;
    }
};
