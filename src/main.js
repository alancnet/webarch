var mainTemplate = require("./main.rt");
var React = require("react");
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function() {
        React.render(mainTemplate(), document.getElementsByTagName("body")[0]);
    });
}
// jest

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
