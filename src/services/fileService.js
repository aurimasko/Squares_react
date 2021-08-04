import endPoints from "../endPoints.js"

export const fileService = {
	async importFile(file) {

		const formData = new FormData();
		formData.append('InputFile', file);
				
		return await fetch(
			endPoints.fileAPIBaseEndPoint,
			{
				method: 'post',
				body: formData
			}
		).then(response => { return response.json(); });
	}
}