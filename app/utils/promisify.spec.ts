import { expect } from "chai";
import { promisify } from "./promisify";

describe("promisifies a function", () => {
  const fn = (a: number, b: number, cb: Function) => {
    if (a + b !== 3) {
      cb(new Error("blja!"));
    }
    return cb(null, a + b);
  };

  it("New function resolves promise correctly", async () => {
    expect(await promisify(fn)(1, 2)).to.eq(3);
  });

  it("New function rejects promise if there's an error", () => {
    expect(promisify(fn)(1, 3)).to.be.rejectedWith("blja");
  });

  it("Passing context works", async () => {
    const anotherFn = function(this: { a: number }, b: number, cb: Function): void {
      if (this.a + b !== 3) {
        cb(new Error("blja!"));
      }
      return cb(null, this.a + b);
    };

    const context = {
      a: 2,
    };

    expect(await promisify(anotherFn.bind(context))(1)).to.eq(3);
  });

  it("double promisify does no harm", async () => {
    expect(await promisify(promisify(fn))(1, 2)).to.eq(3);
  });
});
