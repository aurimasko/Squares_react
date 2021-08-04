import endPoints from "../endPoints.js"

export const listsService = {
	async fetch() {

		return await fetch(
			endPoints.listsAPIBaseEndPoint,
			{
				method: 'get'
			}
		).then(response => { return response.json(); });
	},
	async fetchById(id) {

		return await fetch(
			endPoints.listsAPIBaseEndPoint + '/' + id,
			{
				method: 'get'
			}
		).then(response => { return response.json(); });
	},	
	async createList(listName, points) {
		return await fetch(
			endPoints.listsAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Content-Type": "application/json-patch+json"
				}),
				body: JSON.stringify(
				{
					Name: listName,
					Points: points
				})
			}).then(response => { return response.json(); });
	},
	async updateList(list, points) {
		return await fetch(
			endPoints.listsAPIBaseEndPoint,
			{
				method: 'put',
				headers: new Headers({
					"Content-Type": "application/json-patch+json"
				}),
				body: JSON.stringify(
				{
					Id: list.id,
					Points: points
				})
			}).then(response => { return response.json(); });
	},
	async deleteList(list) {
		return await fetch(
			endPoints.listsAPIBaseEndPoint + '/' + list.id,
			{
				method: 'DELETE',
				headers: new Headers({
					"Content-Type": "application/json-patch+json"
				})
			}).then(response => { return response.json(); });
	}
}