import React from "react";
import router from "react-router";
import routes from "./routes.rt";

export function run(hash, target) {
    router.run(routes(), hash, (Root) => {
        React.render(React.createElement(Root, {}), target);
    });

}

/**
 * Iterator for fibonacci numbers
 */
export function* fib() {
    function* loop(pre, cur) {
        yield cur;
        yield* loop(cur, pre + cur);
    }

    yield* loop(0, 1);
}


export function* take(iterable, n) {
    if (n > 0) {
        let next = iterable.next();
        if (!next.done) {
            yield next.value;
            yield* take(iterable, n - 1);
        }
    }
}



if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () =>
            run(router.HashLocation, document.body)
    );
}
