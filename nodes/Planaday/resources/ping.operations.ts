import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { planadayApiRequest } from '../GenericFunctions';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ping'],
			},
		},
		options: [
			{
				name: 'Ping',
				value: 'ping',
				description: 'Test API connection',
				action: 'Test API connection',
			},
		],
		default: 'ping',
	},
];

export const fields: INodeProperties[] = [];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'ping') {
		// Ping the API to test connection
		return await planadayApiRequest.call(this, 'GET', '/ping');
	}
	
	return {};
}
