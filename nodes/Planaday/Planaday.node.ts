import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError
} from 'n8n-workflow';

export class Planaday implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planaday',
		name: 'planaday',
		icon: 'file:planaday.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Planaday API',
		defaults: {
			name: 'Planaday',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'planadayApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.apiUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Student',
						value: 'student',
					},
				],
				default: 'student',
			},
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
						name: 'Create',
						value: 'create',
						description: 'Create a new student',
						action: 'Create a student',
					},
				],
				default: 'create',
			},
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
										displayName: 'Postal Code',
										name: 'postal_code',
										type: 'string',
										default: '',
									},
									{
										displayName: 'City',
										name: 'city',
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
										displayName: 'Mobile',
										name: 'mobile',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Email',
										name: 'email',
										type: 'string',
										default: '',
										placeholder: 'name@email.com',
									},
								],
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'student') {
					if (operation === 'create') {
						const firstname = this.getNodeParameter('firstname', i) as string;
						const lastname = this.getNodeParameter('lastname', i) as string;
						const external_id = this.getNodeParameter('external_id', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;

						const body: any = {
							firstname,
							lastname,
							external_id,
						};

						if (additionalFields.initials) {
							body.initials = additionalFields.initials;
						}

						if (additionalFields.prefix) {
							body.prefix = additionalFields.prefix;
						}

						if (additionalFields.date_of_birth) {
							body.date_of_birth = additionalFields.date_of_birth;
						}

						if (additionalFields.address?.addressFields) {
							body.address = additionalFields.address.addressFields;
						}

						if (additionalFields.contact?.contactFields) {
							body.contact = additionalFields.contact.contactFields;
						}

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'planadayApi',
							{
								method: 'POST',
								url: '/student',
								body,
								json: true,
							},
						);

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);

						returnData.push(...executionData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
