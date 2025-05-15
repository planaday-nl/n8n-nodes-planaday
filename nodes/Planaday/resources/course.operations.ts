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
				resource: ['course'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a course by ID',
				action: 'Get a course',
			},
			{
				name: 'Get Dayparts',
				value: 'getDayparts',
				description: 'Get dayparts for a course',
				action: 'Get dayparts for a course',
			},
			{
				name: 'Get Images',
				value: 'getImages',
				description: 'Get images for a course',
				action: 'Get images for a course',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many courses',
				action: 'Get many courses',
			},
			{
				name: 'Get Materials',
				value: 'getMaterials',
				description: 'Get materials for a course',
				action: 'Get materials for a course',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                                course:get                               */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Course ID',
		name: 'courseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['course'],
				operation: ['get', 'getDayparts', 'getMaterials', 'getImages'],
			},
		},
		description: 'The ID of the course',
	},

	/* ---------------------------------------------------------------------- */
	/*                              course:getAll                              */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['course'],
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
				resource: ['course'],
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
				resource: ['course'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Filter by course title',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				description: 'Filter by course start date (YYYYMMDD)',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				description: 'Filter by course end date (YYYYMMDD)',
			},
			{
				displayName: 'Location ID',
				name: 'location_id',
				type: 'string',
				default: '',
				description: 'Filter by location ID',
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
		// Get a course by ID
		const courseId = this.getNodeParameter('courseId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/course/${courseId}`);
	}

	if (operation === 'getAll') {
		// Get all courses
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as {
			title?: string;
			start_date?: string;
			end_date?: string;
			location_id?: string;
		};
		
		const qs: Record<string, any> = {};
		
		if (filters.title) {
			qs.title = filters.title;
		}
		
		if (filters.start_date) {
			// Convert to ISO string and extract the date part in YYYYMMDD format
			const date = new Date(filters.start_date);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			qs.start_date = `${year}${month}${day}`;
		}
		
		if (filters.end_date) {
			// Convert to ISO string and extract the date part in YYYYMMDD format
			const date = new Date(filters.end_date);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			qs.end_date = `${year}${month}${day}`;
		}
		
		if (filters.location_id) {
			qs.location_id = filters.location_id;
		}
		
		if (returnAll) {
			return await planadayApiRequestAllItems.call(this, 'GET', '/course', {}, qs);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			
			const response = await planadayApiRequest.call(this, 'GET', '/course', {}, qs);
			return response.data || response;
		}
	}

	if (operation === 'getDayparts') {
		// Get dayparts for a course
		const courseId = this.getNodeParameter('courseId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/course/${courseId}/dayparts`);
	}

	if (operation === 'getMaterials') {
		// Get materials for a course
		const courseId = this.getNodeParameter('courseId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/course/${courseId}/materials`);
	}

	if (operation === 'getImages') {
		// Get images for a course
		const courseId = this.getNodeParameter('courseId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/course/${courseId}/images`);
	}
	
	return {};
}
