export function toDate(dateString) {
	const dates = dateString.split('-')
	const year = Number(dates[0])
	const month = Number(dates[1]) - 1
	const date = new Date(year, month)
	return date
}