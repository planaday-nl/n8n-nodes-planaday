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
				resource: ['instructor'],
			},
		},
		options: [
			{
				name: 'Add to Course',
				value: 'addToCourse',
				description: 'Add instructor to a course',
				action: 'Add instructor to a course',
			},
			{
				name: 'Add to Daypart',
				value: 'addToDaypart',
				description: 'Add instructor to a daypart',
				action: 'Add instructor to a daypart',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an instructor by ID',
				action: 'Get an instructor',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many instructors',
				action: 'Get many instructors',
			},
			{
				name: 'Remove From Course',
				value: 'removeFromCourse',
				description: 'Remove instructor from a course',
				action: 'Remove instructor from a course',
			},
			{
				name: 'Remove From Daypart',
				value: 'removeFromDaypart',
				description: 'Remove instructor from a daypart',
				action: 'Remove instructor from a daypart',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                              instructor:get                             */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Instructor ID',
		name: 'instructorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['instructor'],
				operation: ['get', 'addToDaypart', 'removeFromDaypart', 'addToCourse', 'removeFromCourse'],
			},
		},
		description: 'The ID of the instructor',
	},

	/* ---------------------------------------------------------------------- */
	/*                            instructor:getAll                            */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['instructor'],
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
				resource: ['instructor'],
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
				resource: ['instructor'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by instructor name',
			},
		],
	},

	/* ---------------------------------------------------------------------- */
	/*                       instructor:addToDaypart                           */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Daypart ID',
		name: 'daypartId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['instructor'],
				operation: ['addToDaypart', 'removeFromDaypart'],
			},
		},
		description: 'The ID of the daypart',
	},

	/* ---------------------------------------------------------------------- */
	/*                        instructor:addToCourse                           */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Course ID',
		name: 'courseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['instructor'],
				operation: ['addToCourse', 'removeFromCourse'],
			},
		},
		description: 'The ID of the course',
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'get') {
		// Get an instructor by ID
		const instructorId = this.getNodeParameter('instructorId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/instructor/${instructorId}`);
	}

	if (operation === 'getAll') {
		// Get all instructors
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as {
			name?: string;
		};
		
		const qs: Record<string, any> = {};
		
		if (filters.name) {
			qs.name = filters.name;
		}
		
		if (returnAll) {
			return await planadayApiRequestAllItems.call(this, 'GET', '/instructor', {}, qs);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			
			const response = await planadayApiRequest.call(this, 'GET', '/instructor', {}, qs);
			return response.data || response;
		}
	}

	if (operation === 'addToDaypart') {
		// Add instructor to a daypart
		const instructorId = this.getNodeParameter('instructorId', i) as string;
		const daypartId = this.getNodeParameter('daypartId', i) as string;
		
		return await planadayApiRequest.call(
			this, 
			'POST', 
			`/instructor/${instructorId}/daypart/${daypartId}`
		);
	}

	if (operation === 'removeFromDaypart') {
		// Remove instructor from a daypart
		const instructorId = this.getNodeParameter('instructorId', i) as string;
		const daypartId = this.getNodeParameter('daypartId', i) as string;
		
		return await planadayApiRequest.call(
			this, 
			'DELETE', 
			`/instructor/${instructorId}/daypart/${daypartId}`
		);
	}

	if (operation === 'addToCourse') {
		// Add instructor to a course
		const instructorId = this.getNodeParameter('instructorId', i) as string;
		const courseId = this.getNodeParameter('courseId', i) as string;
		
		return await planadayApiRequest.call(
			this, 
			'POST', 
			`/instructor/${instructorId}/course/${courseId}`
		);
	}

	if (operation === 'removeFromCourse') {
		// Remove instructor from a course
		const instructorId = this.getNodeParameter('instructorId', i) as string;
		const courseId = this.getNodeParameter('courseId', i) as string;
		
		return await planadayApiRequest.call(
			this, 
			'DELETE', 
			`/instructor/${instructorId}/course/${courseId}`
		);
	}
	
	return {};
}
