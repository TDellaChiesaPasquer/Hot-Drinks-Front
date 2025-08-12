/**
 * Met la première lettre d'une chaîne de caractères en majusculed
 *
 * @param {string} stringToCapitalize - La chaîne à capitaliser
 * @returns {string} La chaîne avec la première lettre en majuscule, ou la valeur d'origine si invalide
 */
export function capitalize(stringToCapitalize) {
	if (!stringToCapitalize || typeof stringToCapitalize !== "string") {
		return stringToCapitalize;
	}
	if (stringToCapitalize.length < 2) {
		return stringToCapitalize;
	}
	return stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.slice(1);
}
