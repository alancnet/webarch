// jest
var mainTemplate = require("./main.rt");

mainTemplate(1123);

let a = 1234;
a += 1;

/**
 * Iterator for fibonacci numbers
 */
function* fib() {
    function* loop(pre, cur) {
        yield cur;
        yield* loop(cur, pre + cur);
    }

    yield* loop(0, 1);
}


function* take(iterable, n) {
    if (n > 0) {
        let next = iterable.next();
        if (!next.done) {
            yield next.value;
            yield* take(iterable, n - 1);
        }
    }
}

module.exports = {
    fib: fib,
    take: take
};
