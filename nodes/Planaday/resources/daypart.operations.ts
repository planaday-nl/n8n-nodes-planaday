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
				resource: ['daypart'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a daypart by ID',
				action: 'Get a daypart',
			},
			{
				name: 'Get Materials',
				value: 'getMaterials',
				description: 'Get materials for a daypart',
				action: 'Get materials for a daypart',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                               daypart:get                               */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Daypart ID',
		name: 'daypartId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['daypart'],
				operation: ['get', 'getMaterials'],
			},
		},
		description: 'The ID of the daypart',
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'get') {
		// Get a daypart by ID
		const daypartId = this.getNodeParameter('daypartId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/daypart/${daypartId}`);
	}

	if (operation === 'getMaterials') {
		// Get materials for a daypart
		const daypartId = this.getNodeParameter('daypartId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/daypart/${daypartId}/materials`);
	}
	
	return {};
}
