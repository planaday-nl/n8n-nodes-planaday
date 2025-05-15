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
				resource: ['student'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a student by ID',
				action: 'Get a student',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new student',
				action: 'Create a student',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a student',
				action: 'Update a student',
			},
		],
		default: 'get',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                                student:get                              */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Student ID',
		name: 'studentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the student',
	},

	/* ---------------------------------------------------------------------- */
	/*                              student:create                             */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		description: 'The first name of the student',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		description: 'The last name of the student',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		description: 'The email of the student',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'The address of the student',
			},
			{
				displayName: 'Birth Date',
				name: 'birth_date',
				type: 'dateTime',
				default: '',
				description: 'The birth date of the student (YYYYMMDD)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'The city of the student',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'The country of the student',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'The email of the student',
			},
			{
				displayName: 'Extra Fields',
				name: 'extra_fields',
				type: 'json',
				default: '{}',
				description: 'Extra fields for the student in JSON format',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'The phone number of the student',
			},
			{
				displayName: 'Postal Code',
				name: 'postal_code',
				type: 'string',
				default: '',
				description: 'The postal code of the student',
			},
		],
	},

	/* ---------------------------------------------------------------------- */
	/*                              student:update                             */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'The address of the student',
			},
			{
				displayName: 'Birth Date',
				name: 'birth_date',
				type: 'dateTime',
				default: '',
				description: 'The birth date of the student (YYYYMMDD)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'The city of the student',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'The country of the student',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'name@email.com',
				description: 'The email of the student',
			},
			{
				displayName: 'Extra Fields',
				name: 'extra_fields',
				type: 'json',
				default: '{}',
				description: 'Extra fields for the student in JSON format',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'The first name of the student',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'The last name of the student',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'The phone number of the student',
			},
			{
				displayName: 'Postal Code',
				name: 'postal_code',
				type: 'string',
				default: '',
				description: 'The postal code of the student',
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
		// Get a student by ID
		const studentId = this.getNodeParameter('studentId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/student/${studentId}`);
	}

	if (operation === 'create') {
		// Create a new student
		const firstName = this.getNodeParameter('firstName', i) as string;
		const lastName = this.getNodeParameter('lastName', i) as string;
		const email = this.getNodeParameter('email', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as {
			phone?: string;
			address?: string;
			postal_code?: string;
			city?: string;
			country?: string;
			birth_date?: string;
			extra_fields?: string;
		};

		const body: Record<string, any> = {
			first_name: firstName,
			last_name: lastName,
			email,
		};

		if (additionalFields.phone) {
			body.phone = additionalFields.phone;
		}

		if (additionalFields.address) {
			body.address = additionalFields.address;
		}

		if (additionalFields.postal_code) {
			body.postal_code = additionalFields.postal_code;
		}

		if (additionalFields.city) {
			body.city = additionalFields.city;
		}

		if (additionalFields.country) {
			body.country = additionalFields.country;
		}

		if (additionalFields.birth_date) {
			// Convert to ISO string and extract the date part in YYYYMMDD format
			const date = new Date(additionalFields.birth_date);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			body.birth_date = `${year}${month}${day}`;
		}

		if (additionalFields.extra_fields) {
			try {
				body.extra_fields = JSON.parse(additionalFields.extra_fields);
			} catch (error) {
				throw new Error('Extra fields must be a valid JSON');
			}
		}

		return await planadayApiRequest.call(this, 'POST', '/student', body);
	}

	if (operation === 'update') {
		// Update a student
		const studentId = this.getNodeParameter('studentId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as {
			first_name?: string;
			last_name?: string;
			email?: string;
			phone?: string;
			address?: string;
			postal_code?: string;
			city?: string;
			country?: string;
			birth_date?: string;
			extra_fields?: string;
		};

		const body: Record<string, any> = {};

		if (updateFields.first_name) {
			body.first_name = updateFields.first_name;
		}

		if (updateFields.last_name) {
			body.last_name = updateFields.last_name;
		}

		if (updateFields.email) {
			body.email = updateFields.email;
		}

		if (updateFields.phone) {
			body.phone = updateFields.phone;
		}

		if (updateFields.address) {
			body.address = updateFields.address;
		}

		if (updateFields.postal_code) {
			body.postal_code = updateFields.postal_code;
		}

		if (updateFields.city) {
			body.city = updateFields.city;
		}

		if (updateFields.country) {
			body.country = updateFields.country;
		}

		if (updateFields.birth_date) {
			// Convert to ISO string and extract the date part in YYYYMMDD format
			const date = new Date(updateFields.birth_date);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			body.birth_date = `${year}${month}${day}`;
		}

		if (updateFields.extra_fields) {
			try {
				body.extra_fields = JSON.parse(updateFields.extra_fields);
			} catch (error) {
				throw new Error('Extra fields must be a valid JSON');
			}
		}

		return await planadayApiRequest.call(this, 'PUT', `/student/${studentId}`, body);
	}
	
	return {};
}
