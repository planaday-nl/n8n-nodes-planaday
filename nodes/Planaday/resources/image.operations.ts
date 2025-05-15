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
				resource: ['image'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an image by ID',
				action: 'Get an image',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                                image:get                                */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Image ID',
		name: 'imageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['get'],
			},
		},
		description: 'The ID of the image',
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'get') {
		// Get an image by ID
		const imageId = this.getNodeParameter('imageId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/image/${imageId}`);
	}
	
	return {};
}
