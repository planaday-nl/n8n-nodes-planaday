import { INodeProperties } from 'n8n-workflow';

/**
 * Base properties for the Planaday node
 */
export const baseProperties: INodeProperties[] = [
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
];
