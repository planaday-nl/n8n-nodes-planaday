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
				resource: ['location'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a location by ID',
				action: 'Get a location',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                               location:get                              */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['get'],
			},
		},
		description: 'The ID of the location',
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'get') {
		// Get a location by ID
		const locationId = this.getNodeParameter('locationId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/location/${locationId}`);
	}
	
	return {};
}
