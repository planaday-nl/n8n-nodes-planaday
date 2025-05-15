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
				resource: ['booking'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a booking',
				action: 'Create a booking',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a booking',
				action: 'Delete a booking',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a booking by ID',
				action: 'Get a booking',
			},
			{
				name: 'Mark as Paid',
				value: 'markAsPaid',
				description: 'Mark a booking as paid',
				action: 'Mark a booking as paid',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a booking',
				action: 'Update a booking',
			},
		],
		default: 'create',
	},
];

export const fields: INodeProperties[] = [
	/* ---------------------------------------------------------------------- */
	/*                                booking:get                              */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Booking ID',
		name: 'bookingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['get', 'update', 'delete', 'markAsPaid'],
			},
		},
		description: 'The ID of the booking',
	},

	/* ---------------------------------------------------------------------- */
	/*                              booking:create                             */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Course ID',
		name: 'courseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['create'],
			},
		},
		description: 'The ID of the course to book',
	},
	{
		displayName: 'Student ID',
		name: 'studentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['create'],
			},
		},
		description: 'The ID of the student',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Comment for the booking',
			},
			{
				displayName: 'Attributes',
				name: 'attributes',
				type: 'json',
				default: '{}',
				description: 'Attributes for the booking in JSON format',
			},
			{
				displayName: 'Invoice Address',
				name: 'invoice_address',
				type: 'json',
				default: '{}',
				description: 'Invoice address for the booking in JSON format',
			},
		],
	},

	/* ---------------------------------------------------------------------- */
	/*                              booking:update                             */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Comment for the booking',
			},
			{
				displayName: 'Attributes',
				name: 'attributes',
				type: 'json',
				default: '{}',
				description: 'Attributes for the booking in JSON format',
			},
			{
				displayName: 'Invoice Address',
				name: 'invoice_address',
				type: 'json',
				default: '{}',
				description: 'Invoice address for the booking in JSON format',
			},
		],
	},

	/* ---------------------------------------------------------------------- */
	/*                            booking:markAsPaid                           */
	/* ---------------------------------------------------------------------- */
	{
		displayName: 'Payment Details',
		name: 'paymentDetails',
		type: 'collection',
		placeholder: 'Add Payment Details',
		default: {},
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['markAsPaid'],
			},
		},
		options: [
			{
				displayName: 'Payment Method',
				name: 'payment_method',
				type: 'options',
				options: [
					{
						name: 'Bank Transfer',
						value: 'bank_transfer',
					},
					{
						name: 'Cash',
						value: 'cash',
					},
					{
						name: 'Credit Card',
						value: 'credit_card',
					},
					{
						name: 'Other',
						value: 'other',
					},
				],
				default: 'bank_transfer',
				description: 'Method of payment',
			},
			{
				displayName: 'Payment Date',
				name: 'payment_date',
				type: 'dateTime',
				default: '',
				description: 'Date of payment',
			},
			{
				displayName: 'Payment Reference',
				name: 'payment_reference',
				type: 'string',
				default: '',
				description: 'Reference for the payment',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
) {
	if (operation === 'create') {
		// Create a new booking
		const courseId = this.getNodeParameter('courseId', i) as string;
		const studentId = this.getNodeParameter('studentId', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as {
			comment?: string;
			attributes?: string;
			invoice_address?: string;
		};

		const body: Record<string, any> = {
			course_id: courseId,
			student_id: studentId,
		};

		if (additionalFields.comment) {
			body.comment = additionalFields.comment;
		}

		if (additionalFields.attributes) {
			try {
				body.attributes = JSON.parse(additionalFields.attributes);
			} catch (error) {
				throw new Error('Attributes must be a valid JSON');
			}
		}

		if (additionalFields.invoice_address) {
			try {
				body.invoice_address = JSON.parse(additionalFields.invoice_address);
			} catch (error) {
				throw new Error('Invoice address must be a valid JSON');
			}
		}

		return await planadayApiRequest.call(this, 'POST', '/booking', body);
	}

	if (operation === 'get') {
		// Get a booking by ID
		const bookingId = this.getNodeParameter('bookingId', i) as string;
		return await planadayApiRequest.call(this, 'GET', `/booking/${bookingId}`);
	}

	if (operation === 'update') {
		// Update a booking
		const bookingId = this.getNodeParameter('bookingId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as {
			comment?: string;
			attributes?: string;
			invoice_address?: string;
		};

		const body: Record<string, any> = {};

		if (updateFields.comment) {
			body.comment = updateFields.comment;
		}

		if (updateFields.attributes) {
			try {
				body.attributes = JSON.parse(updateFields.attributes);
			} catch (error) {
				throw new Error('Attributes must be a valid JSON');
			}
		}

		if (updateFields.invoice_address) {
			try {
				body.invoice_address = JSON.parse(updateFields.invoice_address);
			} catch (error) {
				throw new Error('Invoice address must be a valid JSON');
			}
		}

		return await planadayApiRequest.call(this, 'PUT', `/booking/${bookingId}`, body);
	}

	if (operation === 'delete') {
		// Delete a booking
		const bookingId = this.getNodeParameter('bookingId', i) as string;
		return await planadayApiRequest.call(this, 'DELETE', `/booking/${bookingId}`);
	}

	if (operation === 'markAsPaid') {
		// Mark a booking as paid
		const bookingId = this.getNodeParameter('bookingId', i) as string;
		const paymentDetails = this.getNodeParameter('paymentDetails', i) as {
			payment_method?: string;
			payment_date?: string;
			payment_reference?: string;
		};

		const body: Record<string, any> = {};

		if (paymentDetails.payment_method) {
			body.payment_method = paymentDetails.payment_method;
		}

		if (paymentDetails.payment_date) {
			// Convert to ISO string and extract the date part
			const date = new Date(paymentDetails.payment_date);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			body.payment_date = `${year}${month}${day}`;
		}

		if (paymentDetails.payment_reference) {
			body.payment_reference = paymentDetails.payment_reference;
		}

		return await planadayApiRequest.call(this, 'POST', `/booking/${bookingId}/paid`, body);
	}
	
	return {};
}
