import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { planadayApiRequest, planadayApiRequestAllItems } from '../GenericFunctions';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['extrafields'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many extra fields',
				action: 'Get many extra fields',
			},
		],
		default: 'getAll',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                           extrafields:getAll                            */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['extrafields'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['extrafields'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'getAll') {
		// Get all extra fields
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		
		if (returnAll) {
			return await planadayApiRequestAllItems.call(this, 'GET', '/extrafields');
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const qs = { limit };
			
			const response = await planadayApiRequest.call(this, 'GET', '/extrafields', {}, qs);
			return response.data || response;
		}
	}
	
	return {};
}
