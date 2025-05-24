import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PlanadayApi implements ICredentialType {
	name = 'planadayApi';
	displayName = 'Planaday API';
	documentationUrl = 'https://apidocs.planaday.nl';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for Planaday API access',
		},
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://apitest.api.planaday.nl',
			required: true,
			description: 'The base URL for the Planaday API (e.g., https://api.planaday.nl for production)',
			placeholder: 'https://[customername].api.planaday.nl',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}/v1',
			url: '/ping',
			method: 'GET',
		},
	};
}
