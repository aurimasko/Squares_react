import endPoints from "../endPoints.js"

export const squaresService = {
	async calculateSquares(points) {	
		return await fetch(
			endPoints.squaresAPIBaseEndPoint,
			{
				method: 'post',
				headers: new Headers({
					"Content-Type": "application/json"
				}),
				body: JSON.stringify(points)
			}
		).then(response => { return response.json(); });
	}
}