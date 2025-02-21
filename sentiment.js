/**
 * Sends text to the sentiment analysis API.
 *
 * @format
 * @param {string} text - The extracted H1 text.
 * @returns {Promise<{label: string, score: number}>} - The sentiment analysis result.
 */

export async function analyzeSentiment(text) {
	try {
		// Edited fetch to work with my hardcoded result API
		const response = await fetch("http://localhost:8000/get-sentiment")
		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`)
		}
		const data = await response.json()
		return {
			label: data.label || "Unknown",
			score: data.score || 0.0,
		}
	} catch (error) {
		console.error("Error fetching sentiment analysis:", error)
		return { label: "Error", score: 0.0 }
	}
}
