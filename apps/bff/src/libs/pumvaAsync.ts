/**
 * @fileoverview Promise-based wrapper for Pumva API functions.
 * Automatically converts all callback-based Pumva methods to Promise-based equivalents.
 * 
 * Features:
 * - Automatic Promise wrapping of all Pumva methods
 * - Robust error handling
 * - Dynamic proxy-based function mapping
 * - Consistent async/await support
 * 
 * Usage:
 * ```typescript
 * const user = await pumvaAsync.getCurrentUser(sessionId);
 * const games = await pumvaAsync.fetchGames(userId, sessionId);
 * ```
 * 
 * @module libs/pumvaAsync
 * @requires ./logger
 * @requires ./pumva
 * @author PUMVA Team
 */

import { logger } from './logger';
import Pumva from './pumva';

/**
 * Promise-based wrapper for all Pumva functions.
 * Uses a Proxy to automatically convert callback-based methods to Promise-based ones.
 * 
 * @type {Proxy<{}, any>}
 * @example
 * // Instead of: Pumva.getCurrentUser(sessionId, callback)
 * // Use: await pumvaAsync.getCurrentUser(sessionId)
 */
export default new Proxy({}, {
  get(target : any, prop : string) {
    if (typeof (Pumva as any)[prop] === "function") {
      /**
       * Returns a promise-wrapped version of the Pumva function
       * @param {...any} params - Function parameters (excluding callback)
       * @returns {Promise<any>} Promise that resolves with the function result
       */
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