import React from "react";
import router from "react-router";
import routes from "./routes.rt";

export function run(hash, target) {
    router.run(routes(), hash, (Root) => {
        React.render(<Root />, target);
    });

}

/**
 * Iterator for fibonacci numbers
 */
export function* fib() {
    function* cons(val, fun) {
        yield val;
        yield* fun();
    }
    function loop2(pre, cur) {
        return cons(pre, ()=>loop2(cur, pre + cur));
    }
    //function* loop(pre, cur) {
    //    yield cur;
    //    yield* loop(cur, pre + cur);
    //}

    yield* loop2(0, 1);
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
