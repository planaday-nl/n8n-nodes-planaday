import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { planadayApiRequest } from './GenericFunctions';
import * as booking from './resources/booking.operations';
import * as company from './resources/company.operations';
import * as course from './resources/course.operations';
import * as coursetemplate from './resources/coursetemplate.operations';
import * as daypart from './resources/daypart.operations';
import * as extrafields from './resources/extrafields.operations';
import * as image from './resources/image.operations';
import * as instructor from './resources/instructor.operations';
import * as label from './resources/label.operations';
import * as location from './resources/location.operations';
import * as ping from './resources/ping.operations';
import * as student from './resources/student.operations';

export class Planaday implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planaday',
		name: 'planaday',
		icon: 'file:planaday.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Planaday API',
		defaults: {
			name: 'Planaday',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'planadayApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Booking',
						value: 'booking',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Course',
						value: 'course',
					},
					{
						name: 'Course Template',
						value: 'coursetemplate',
					},
					{
						name: 'Daypart',
						value: 'daypart',
					},
					{
						name: 'Extra Field',
						value: 'extrafields',
					},
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Instructor',
						value: 'instructor',
					},
					{
						name: 'Label',
						value: 'label',
					},
					{
						name: 'Location',
						value: 'location',
					},
					{
						name: 'Ping',
						value: 'ping',
					},
					{
						name: 'Student',
						value: 'student',
					},
				],
				default: 'booking',
			},
			
			// BOOKING OPERATIONS
			...booking.operations,
			...booking.fields,
			
			// COMPANY OPERATIONS
			...company.operations,
			...company.fields,
			
			// COURSE OPERATIONS
			...course.operations,
			...course.fields,
			
			// COURSETEMPLATE OPERATIONS
			...coursetemplate.operations,
			...coursetemplate.fields,
			
			// DAYPART OPERATIONS
			...daypart.operations,
			...daypart.fields,
			
			// EXTRAFIELDS OPERATIONS
			...extrafields.operations,
			...extrafields.fields,
			
			// IMAGE OPERATIONS
			...image.operations,
			...image.fields,
			
			// INSTRUCTOR OPERATIONS
			...instructor.operations,
			...instructor.fields,
			
			// LABEL OPERATIONS
			...label.operations,
			...label.fields,
			
			// LOCATION OPERATIONS
			...location.operations,
			...location.fields,
			
			// PING OPERATIONS
			...ping.operations,
			...ping.fields,
			
			// STUDENT OPERATIONS
			...student.operations,
			...student.fields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		let responseData;
		
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		
		for (let i = 0; i < items.length; i++) {
			try {
				// BOOKING
				if (resource === 'booking') {
					responseData = await booking.execute.call(this, operation, i);
				}
				
				// COMPANY
				else if (resource === 'company') {
					responseData = await company.execute.call(this, operation, i);
				}
				
				// COURSE
				else if (resource === 'course') {
					responseData = await course.execute.call(this, operation, i);
				}
				
				// COURSETEMPLATE
				else if (resource === 'coursetemplate') {
					responseData = await coursetemplate.execute.call(this, operation, i);
				}
				
				// DAYPART
				else if (resource === 'daypart') {
					responseData = await daypart.execute.call(this, operation, i);
				}
				
				// EXTRAFIELDS
				else if (resource === 'extrafields') {
					responseData = await extrafields.execute.call(this, operation, i);
				}
				
				// IMAGE
				else if (resource === 'image') {
					responseData = await image.execute.call(this, operation, i);
				}
				
				// INSTRUCTOR
				else if (resource === 'instructor') {
					responseData = await instructor.execute.call(this, operation, i);
				}
				
				// LABEL
				else if (resource === 'label') {
					responseData = await label.execute.call(this, operation, i);
				}
				
				// LOCATION
				else if (resource === 'location') {
					responseData = await location.execute.call(this, operation, i);
				}
				
				// PING
				else if (resource === 'ping') {
					responseData = await ping.execute.call(this, operation, i);
				}
				
				// STUDENT
				else if (resource === 'student') {
					responseData = await student.execute.call(this, operation, i);
				}
				
				else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not implemented!`);
				}
				
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}
		
		return [returnData];
	}
}
