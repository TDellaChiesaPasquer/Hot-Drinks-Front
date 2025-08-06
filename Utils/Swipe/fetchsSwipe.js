/**
 * Récupère la liste des profils (limité à 10).
 *
 * @param {string} baseUrl - URL de base de l'API (ex. "https://api.monsite.com").
 * @param {string} token   - Jeton d'authentification pour accéder à la route sécurisée.
 * @returns {Promise<Object>} Promise qui résout l’objet `{ result: boolean, profilList: Array }`.
 */
export async function fetchProfiles(baseUrl, token) {
	try {
		const response = await fetch(`${baseUrl}/profil`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		});
		return await response.json();
	} catch (err) {
		console.error("fetchProfiles erreur réseau :", err);
		throw err;
	}
}

/**
 * Envoie une action de swipe (like, superlike ou dislike) pour un profil.
 *
 * @param {string} baseUrl - URL de base de l'API (ex. "https://api.monsite.com").
 * @param {string} token   - Jeton d'authentification pour accéder à la route sécurisée.
 * @param {string} action  - Type de swipe : "like", "superlike" ou autre pour "dislike".
 * @param {string} userId  - Identifiant du profil cible à liker/disliker.
 * @returns {Promise<Object>} Promise qui résout l’objet de réponse, par exemple `{ result: boolean, likesList|superlikesList|dislikesList: [...]}`.
 */
export async function swipeProfile(baseUrl, token, action, userId) {
	try {
		const response = await fetch(`${baseUrl}/swipe`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			body: JSON.stringify({ action, userId }),
		});
		return await response.json();
	} catch (err) {
		console.error("swipeProfile erreur réseau :", err);
		throw err;
	}
}
