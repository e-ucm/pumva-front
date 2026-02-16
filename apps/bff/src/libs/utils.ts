import axios from 'axios';

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