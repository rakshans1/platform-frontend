export const promisify = <T>(fn: Function) => {
  return async function(...args: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fn(...args, (err: any, result: T) => {
        if (err !== null) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };
};
