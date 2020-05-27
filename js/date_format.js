function getCurrentDate() {
	let date = new Date();

	let months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"June",
		"July",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec"
	];

	let month = months[date.getMonth()];
	let day = addOrdinalNumber(date.getDate());

	function addOrdinalNumber(date) {
		switch (date) {
			case 1:
			case 21:
			case 31:
				date = date + "st";
				break;
			case 2:
			case 22:
				date = date + "nd";
			default:
				date = date + "th";
				break;
		}
		return date;
	}
	let finalFormat = `${month} ${day}`;
	return finalFormat;
}
