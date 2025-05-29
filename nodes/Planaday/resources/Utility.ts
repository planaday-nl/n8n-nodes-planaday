import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

/**
 * Executes the ping operation to the Planaday API
 */
export async function executePing(this: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	try {
		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'planadayApi', 
			{
				method: 'GET',
				url: `={{$credentials.apiUrl}}/v1/ping`, // Ensure correct credential access
				json: false, 
			},
		);

		const result = typeof responseData === 'string' ? { message: responseData } : responseData;
		
		// For a global operation like ping, we typically return one item of data.
		// If this function is guaranteed to be called only once, itemIndex might be irrelevant for pairedItem.
		returnData.push({
			json: result,
			// No pairedItem needed if it's a global action not tied to input items.
		});

	} catch (error) {
		if (this.continueOnFail()) {
			const errorData = { error: (error as Error).message };
			// itemIndex is passed, use it if an error needs to be associated with an (even conceptual) item.
			returnData.push({ json: errorData, pairedItem: { item: itemIndex } }); 
			return returnData;
		} else {
			const nodeError = new NodeOperationError(this.getNode(), error as Error, {
				description: `Ping operation failed: ${(error as Error).message}`,
				itemIndex,
			});
			throw nodeError;
		}
	}
	return returnData;
}
