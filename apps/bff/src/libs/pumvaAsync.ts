import { logger } from './logger';
import Pumva from './pumva';
// Automatically wrap all Pumva.xxx functions into promise-based versions
// Robust Promise wrapper for Pumva
export default new Proxy({}, {
  get(target : any, prop : string) {
    if (typeof (Pumva as any)[prop] === "function") {
      // Return a promise-wrapped version of the function
      return (...params: any) => {
        return new Promise((resolve, reject) => {
          (Pumva as any)[prop](...params, (error: any, result: unknown) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      };
    } else {
      // Throw clear error if function doesn't exist
      throw new Error(`PumvaAsync: '${prop}' is not a valid Pumva function.`);
    }
  }
});