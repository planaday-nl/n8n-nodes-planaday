import {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request';

/**
 * Make an API request to Planaday
 */
export async function planadayApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
) {
	const credentials = await this.getCredentials('planadayApi');
	const companyCode = credentials.companyCode as string;
	
	const options: OptionsWithUri = {
		method,
		headers: {
			'User-Agent': 'n8n-nodes-planaday',
		},
		body,
		qs: query,
		uri: uri || `https://${companyCode}.api.planaday.nl/v1${endpoint}`,
		json: true,
	};

	if (!Object.keys(body).length) {
		delete options.body;
	}

	if (!Object.keys(query).length) {
		delete options.qs;
	}

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'planadayApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to paginated Planaday endpoint
 * and return all results
 */
export async function planadayApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
) {
	const returnData: IDataObject[] = [];
	
	let responseData;
	query.page = 1;
	
	do {
		responseData = await planadayApiRequest.call(this, method, endpoint, body, query);
		returnData.push.apply(returnData, responseData.data || responseData);
		query.page++;
	} while (
		responseData.data && 
		responseData.data.length && 
		responseData.meta && 
		responseData.meta.current_page < responseData.meta.last_page
	);
	
	return returnData;
}

/**
 * Format date to YYYYMMDD as required by Planaday API
 */
export function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	
	return `${year}${month}${day}`;
}

/**
 * Format time to HH:mm as required by Planaday API
 */
export function formatTime(date: Date): string {
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	
	return `${hours}:${minutes}`;
}
