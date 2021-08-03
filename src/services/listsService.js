import endPoints from "../endPoints.js"

export const listsService = {
	async fetch() {

		return await fetch(
			endPoints.listsAPIBaseEndPoint,
			{
				method: 'get'
			}
		).then(response => { return response.json(); });
	}
}