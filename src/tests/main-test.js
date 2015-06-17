let main = require("../main");


describe("fib()", () => {
    it("iterates infinitely", ()=> {
        var fit = main.fib();
        expect(fit.next().value).toBe(1);
        expect(fit.next().value).toBe(1);
        expect(fit.next().value).toBe(2);
        expect(fit.next().value).toBe(3);
        expect(fit.next().value).toBe(5);
        expect(fit.next().value).toBe(8);
        expect(fit.next().value).toBe(13);
        expect(fit.next().value).toBe(21);
    });
});

describe("take()", () => {
    it("Limits an iterator to n items", () => {
        let fit = main.fib();
        let state = {
            count: 0
        };
        for (let n in main.take(fit, 5)) {
            state.last = n;
            state.count++;
        }
        expect(state.count).toBe(5);
    });
});
