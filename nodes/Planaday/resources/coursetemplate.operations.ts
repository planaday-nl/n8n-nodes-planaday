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
				resource: ['coursetemplate'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a course template by ID',
				action: 'Get a course template',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many course templates',
				action: 'Get many course templates',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                           coursetemplate:get                            */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Course Template ID',
		name: 'coursetemplateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['coursetemplate'],
				operation: ['get'],
			},
		},
		description: 'The ID of the course template',
	},

	/* ---------------------------------------------------------------------- */
	/*                          coursetemplate:getAll                          */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['coursetemplate'],
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
				resource: ['coursetemplate'],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['coursetemplate'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Filter by course template title',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'get') {
		// Get a course template by ID
		const coursetemplateId = this.getNodeParameter('coursetemplateId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/coursetemplate/${coursetemplateId}`);
	}

	if (operation === 'getAll') {
		// Get all course templates
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as {
			title?: string;
		};
		
		const qs: Record<string, any> = {};
		
		if (filters.title) {
			qs.title = filters.title;
		}
		
		if (returnAll) {
			return await planadayApiRequestAllItems.call(this, 'GET', '/coursetemplate', {}, qs);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			
			const response = await planadayApiRequest.call(this, 'GET', '/coursetemplate', {}, qs);
			return response.data || response;
		}
	}
	
	return {};
}
