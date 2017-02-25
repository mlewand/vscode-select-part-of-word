const CHAR_TYPE = {
	OTHER: 1,
	UPPER_CASE: 2,
	LOWER_CASE: 3,
	WHITESPACE: 4,
	NUMBER: 5
};

module.exports = {
	CHAR_TYPE: CHAR_TYPE,

	regExpMapping: {
		[ CHAR_TYPE.LOWER_CASE ]: /[a-z]/,
		[ CHAR_TYPE.UPPER_CASE ]: /[A-Z]/,
		[ CHAR_TYPE.NUMBER ]: /[0-9]/,
		[ CHAR_TYPE.WHITESPACE ]: /\s/
	},
	// RegExp to match anything BUT the type referenced by a key.
	regExpExcludeMapping: {
		[ CHAR_TYPE.LOWER_CASE ]: /(?![a-z\u00C0-\u017F])./,
		[ CHAR_TYPE.UPPER_CASE ]: /(?![A-Z\u00C0-\u017F])./,
		[ CHAR_TYPE.NUMBER ]: /(?![0-9])./,
		[ CHAR_TYPE.OTHER ]: /[a-zA-Z0-9\u00C0-\u017F]/,
		[ CHAR_TYPE.WHITESPACE ]: /[^\s]/
	}
};