export function capitalize(stringToCapitalize) {
	if (!stringToCapitalize || typeof stringToCapitalize !== "string") {
		return stringToCapitalize;
	}
	if (stringToCapitalize.length < 2) {
		return stringToCapitalize;
	}
	return stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.slice(1);
}
