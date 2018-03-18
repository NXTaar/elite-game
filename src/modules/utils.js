export const isEqual = (a, b) => {
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
        return Object.is(a, b);
    } else {
        let aKeys = Object.keys(a),
            bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) return false;

        for (let i = 0; i < aKeys.length; i++) {
            if (!isEqual(a[aKeys[i]], b[aKeys[i]])) return false;
        }

        return true;
    }
}

export const kebabToClassCamelcase = str =>
    str.match(/([^\/]+)(?=\.\w+$)/)[0]
        .toLowerCase()
        .replace(/(\b|-)\w/g, m => m.toUpperCase().replace(/-/, ''))