import { useAuth } from 'context/auth.context';
import { useState } from 'react';

export const req = async (
	url,
	options = {
		method: 'GET',
		body: {},
	},
	headers
) => {
	const result = await fetch(url, {
		method: options.method,
		credentials: 'include',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...headers,
		},
		body: JSON.stringify({
			...options.body,
		}),
	});

	const response = await result.json();

	return response;
};

// export const API_URL = 'http://localhost:3001';
export const API_URL = 'https://w3auth.vercel.app';

const useRequest = ({ url }) => {
	const { auth } = useAuth();
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState(null);

	const sendRequest = async (option, options) => {
		setLoading(true);

		const response = await req(
			API_URL + url,
			{
				method: option,
				body: options,
			},
			{
				Accept: 'application/json',
				authorization: `Bearer ${auth.token}`,
			}
		);

		setLoading(false);
		setResponse(response);
	};

	const get = async (options) => {
		sendRequest('GET', options);
	};

	const post = async (options) => {
		sendRequest('POST', options);
	};

	return {
		loading,
		response,
		post,
		get,
	};
};

export default useRequest;
