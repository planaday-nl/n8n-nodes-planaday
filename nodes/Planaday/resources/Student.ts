import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';

/**
 * Properties for the Student resource
 */
export const studentProperties: INodeProperties[] = [
	// Student Create Fields
	{
		displayName: 'First Name',
		name: 'firstname',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'First name of the student',
	},
	{
		displayName: 'Last Name',
		name: 'lastname',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Last name of the student',
	},
	{
		displayName: 'External ID',
		name: 'external_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'External identifier for the student',
	},
	{
		displayName: 'Company Name',
		name: 'company_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
				use_company_id: [false],
			},
		},
		default: '',
		description: 'Name of the company the student belongs to',
		required: true,
	},
	{
		displayName: 'Use Company ID',
		name: 'use_company_id',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		description: 'Whether to use company ID instead of name',
	},
	{
		displayName: 'Company ID',
		name: 'company_id',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
				use_company_id: [true],
			},
		},
		default: 0,
		description: 'ID of the company the student belongs to',
		required: true,
	},
	{
		displayName: 'Active',
		name: 'active',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['student'],
				operation: ['create'],
			},
		},
		description: 'Whether the student is active',
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
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'addressFields',
						displayName: 'Address',
						values: [
							{
								displayName: 'Street',
								name: 'street',
								type: 'string',
								default: '',
							},
							{
								displayName: 'House Number',
								name: 'housenumber',
								type: 'string',
								default: '',
							},
							{
								displayName: 'House Number Extension',
								name: 'housenumber_extension',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Postal Code',
								name: 'postalcode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Contact',
				name: 'contact',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'contactFields',
						displayName: 'Contact',
						values: [
							{
								displayName: 'Mobile Number',
								name: 'mobilenumber',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Business Email',
								name: 'emailaddress_business',
								type: 'string',
								default: '',
								placeholder: 'business@example.com',
							},
							{
								displayName: 'Private Email',
								name: 'emailaddress_private',
								type: 'string',
								default: '',
								placeholder: 'private@example.com',
							},
						],
					},
				],
			},
			{
				displayName: 'Date of Birth',
				name: 'date_of_birth',
				type: 'dateTime',
				default: '',
				description: 'Date of birth in YYYY-MM-DD format',
			},
			{
				displayName: 'Employment',
				name: 'employment',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'employmentFields',
						displayName: 'Employment',
						values: [
							{
								displayName: 'Start Date',
								name: 'startdate',
								type: 'dateTime',
								default: '',
								description: 'Employment start date in YYYY-MM-DD format',
							},
							{
								displayName: 'End Date',
								name: 'enddate',
								type: 'dateTime',
								default: '',
								description: 'Employment end date in YYYY-MM-DD format',
							},
						],
					},
				],
			},
			{
				displayName: 'Initials',
				name: 'initials',
				type: 'string',
				default: '',
				description: 'Initials of the student',
			},
			{
				displayName: 'Prefix',
				name: 'prefix',
				type: 'string',
				default: '',
				description: 'Name prefix (e.g., van, de)',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'Additional remarks about the student',
			},
		],
	},
];

/**
 * Creates a new student in Planaday
 */
export async function createStudent(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		// Get required fields
		const firstname = this.getNodeParameter('firstname', i) as string;
		const lastname = this.getNodeParameter('lastname', i) as string;
		const external_id = this.getNodeParameter('external_id', i) as string;
		const active = this.getNodeParameter('active', i) as boolean;
		const useCompanyId = this.getNodeParameter('use_company_id', i) as boolean;

		// Initialize the request body
		const body: Record<string, any> = {
			firstname,
			lastname,
			external_id,
			active,
			company: {},
		};

		// Set company information based on selection
		if (useCompanyId) {
			const companyId = this.getNodeParameter('company_id', i) as number;
			body.company.id = companyId;
		} else {
			const companyName = this.getNodeParameter('company_name', i) as string;
			body.company.name = companyName;
		}

		// Get additional fields
		const additionalFields = this.getNodeParameter('additionalFields', i) as Record<string, any>;

		// Add optional fields if provided
		if (additionalFields.initials) {
			body.initials = additionalFields.initials;
		}

		if (additionalFields.prefix) {
			body.prefix = additionalFields.prefix;
		}

		if (additionalFields.date_of_birth) {
			// Format date to YYYY-MM-DD
			const dateOfBirth = new Date(additionalFields.date_of_birth);
			body.date_of_birth = dateOfBirth.toISOString().split('T')[0];
		}

		if (additionalFields.remark) {
			body.remark = additionalFields.remark;
		}

		// Handle employment information
		if (additionalFields.employment?.employmentFields) {
			const employment: Record<string, string> = {};
			const employmentFields = additionalFields.employment.employmentFields;

			if (employmentFields.startdate) {
				const startDate = new Date(employmentFields.startdate);
				employment.startdate = startDate.toISOString().split('T')[0];
			}

			if (employmentFields.enddate) {
				const endDate = new Date(employmentFields.enddate);
				employment.enddate = endDate.toISOString().split('T')[0];
			}

			body.employment = employment;
		}

		// Handle address information
		if (additionalFields.address?.addressFields) {
			body.address = additionalFields.address.addressFields;
		}

		// Handle contact information
		if (additionalFields.contact?.contactFields) {
			body.contact = additionalFields.contact.contactFields;
		}

		// Make the API request
		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'planadayApi',
			{
				method: 'POST',
                                url: '/v1/student',
				body,
				json: true,
			},
		);

		// Process the response
		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData),
			{ itemData: { item: i } },
		);

		returnData.push(...executionData);
	} catch (error) {
		if (this.continueOnFail()) {
			const executionErrorData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray({ error: (error as Error).message }),
				{ itemData: { item: i } },
			);
			returnData.push(...executionErrorData);
		} else {
			throw new NodeOperationError(this.getNode(), error as Error, {
				itemIndex: i,
			});
		}
	}

	return returnData;
}
