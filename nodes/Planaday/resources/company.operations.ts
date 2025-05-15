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
				resource: ['company'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get company details',
				action: 'Get company details',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many companies',
				action: 'Get many companies',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                                company:get                              */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['company'],
				operation: ['get'],
			},
		},
		description: 'The ID of the company',
	},

	/* ---------------------------------------------------------------------- */
	/*                               company:getAll                            */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['company'],
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
				resource: ['company'],
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
				resource: ['company'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by company name',
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
		// Get a company by ID
		const companyId = this.getNodeParameter('companyId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/company/${companyId}`);
	}

	if (operation === 'getAll') {
		// Get all companies
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as {
			name?: string;
		};
		
		const qs: Record<string, any> = {};
		
		if (filters.name) {
			qs.name = filters.name;
		}
		
		if (returnAll) {
			return await planadayApiRequestAllItems.call(this, 'GET', '/company', {}, qs);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			
			const response = await planadayApiRequest.call(this, 'GET', '/company', {}, qs);
			return response.data || response;
		}
	}
	
	return {};
}
