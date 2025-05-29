import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import { createStudent, studentProperties, baseProperties } from './resources';
import { executePing } from './resources/Utility'; // Import executePing

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
		properties: [ // studentProperties will only show if resource is student
			...baseProperties,
			...studentProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		if (resource === 'utility') {
			if (operation === 'ping') {
				// Call executePing once. Pass 0 as a placeholder itemIndex.
				returnData = await executePing.call(this, 0);
				return [returnData]; // Return after the ping operation
			}
			// Potentially other utility operations here
		} else if (resource === 'student') {
			// Loop for item-based operations like student creation
			for (let i = 0; i < items.length; i++) {
				try {
					if (operation === 'create') {
						const studentData = await createStudent.call(this, i);
						returnData.push(...studentData);
					}
					// Potentially other student operations here
				} catch (error) {
					if (this.continueOnFail()) {
						// Return the error for the current item and continue with the next.
						returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
						continue;
					}
					// If not continue on fail, rethrow the error to fail the node execution.
					throw error;
				}
			}
		}
		// Add other resources handling here if any

		return [returnData];
	}
}
