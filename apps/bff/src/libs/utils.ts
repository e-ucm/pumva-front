/**
 * @fileoverview HTTP utility functions for making authenticated API requests.
 * Provides wrapper functions for common HTTP methods with JWT and API key support.
 * 
 * Features:
 * - Support for JWT Bearer tokens
 * - Support for API key authentication
 * - Consistent error handling
 * - Promise-based callbacks
 * 
 * @module libs/utils
 * @requires axios
 * @author PUMVA Team
 */

import axios from 'axios';

/**
 * Makes an authenticated POST request
 * @param {string} url - The URL to make the request to
 * @param {any} body - The request body data
 * @param {Function} callback - Callback function (error, data)
 * @param {string} [jwt] - Optional JWT token for Authorization header
 * @param {string} [apikey] - Optional API key for X-Api-Key header
 * @returns {void}
 */
export function post(url : string, body : any, callback : Function, jwt? : string, apikey? : string) {
	const headers: any = {};
	if (jwt) {
		headers['Authorization'] = `Bearer ${jwt}`;
	}
	if(apikey) {
		headers['X-Api-Key'] = `${apikey}`;
	}

	axios
		.post(url, body, { headers })
		.then((response : any) => {
			callback(null, response.data);
		})
		.catch((error : any) => {
			callback(error);
		});
}

/**
 * Makes an authenticated PATCH request
 * @param {string} url - The URL to make the request to
 * @param {any} body - The request body data  
 * @param {Function} callback - Callback function (error, data)
 * @param {string} [jwt] - Optional JWT token for Authorization header
 * @param {string} [apikey] - Optional API key for X-Api-Key header
 * @returns {void}
 */
export 	function patch(url : string, body : any, callback : Function, jwt? : string, apikey? : string) {
	const headers: any = {};
	if (jwt) {
		headers['Authorization'] = `Bearer ${jwt}`;
	}
	if(apikey) {
		headers['X-Api-Key'] = `${apikey}`;
	}
	axios
		.patch(url, body, { headers })
		.then((response : any) => callback(null, response.data))
		.catch((error : any) => callback(error));
}

/**
 * Makes an authenticated PUT request
 * @param {string} url - The URL to make the request to
 * @param {any} body - The request body data
 * @param {Function} callback - Callback function (error, data)
 * @param {string} [jwt] - Optional JWT token for Authorization header
 * @param {string} [apikey] - Optional API key for X-Api-Key header
 * @returns {void}
 */
export 	function put(url : string, body : any, callback : Function, jwt? : string, apikey? : string) {
	const headers: any = {};
	if (jwt) {
		headers['Authorization'] = `Bearer ${jwt}`;
	}
	if(apikey) {
		headers['X-Api-Key'] = `${apikey}`;
	}
	axios
		.put(url, body, { headers })
		.then((response : any) => callback(null, response.data))
		.catch((error : any) => callback(error));
}

/**
 * Makes an authenticated GET request
 * @param {string} url - The URL to make the request to
 * @param {Function} callback - Callback function (error, data)
 * @param {string} [jwt] - Optional JWT token for Authorization header
 * @param {string} [apikey] - Optional API key for X-Api-Key header
 * @returns {void}
 */
export function get(url : string, callback : Function, jwt? : string, apikey? : string) {
	const headers: any = {};
	if (jwt) {
		headers['Authorization'] = `Bearer ${jwt}`;
	}
	if(apikey) {
		headers['X-Api-Key'] = `${apikey}`;
	}
	axios
		.get(url, { headers })
		.then((response : any) => callback(null, response.data))
		.catch((error : any) => callback(error));
}

/**
 * Makes an authenticated DELETE request
 * @param {string} url - The URL to make the request to
 * @param {Function} callback - Callback function (error, data)
 * @param {string} [jwt] - Optional JWT token for Authorization header
 * @param {string} [apikey] - Optional API key for X-Api-Key header
 * @returns {void}
 */
export function del(url : string, callback : Function, jwt? : string, apikey? : string) {
	const headers: any = {};
	if (jwt) {
	  headers['Authorization'] = `Bearer ${jwt}`;
	}
	if(apikey) {
		headers['X-Api-Key'] = `${apikey}`;
	}
	axios
	  .delete(url, { headers })
	  .then((response : any) => callback(null, response.data))
	  .catch((error : any) => callback(error));
}