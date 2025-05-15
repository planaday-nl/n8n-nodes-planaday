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
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key for Planaday API authentication',
		},
		{
			displayName: 'Company Code',
			name: 'companyCode',
			type: 'string',
			default: '',
			required: true,
			description: 'Your company code in Planaday (e.g., "myname" from myname.planaday.nl)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{ $credentials.apiKey }}',
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ `https://${$credentials.companyCode}.api.planaday.nl/v1` }}',
			url: '/ping',
			method: 'GET',
		},
	};
}
