/**
 * Formats a date as a relative time string (e.g., "3 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();

	// Use actual current time for real-time relative dates
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	// Define time intervals in seconds
	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 30;
	const year = day * 365;

	if (diffInSeconds < minute) {
		return "just now";
	} else if (diffInSeconds < hour) {
		const minutes = Math.floor(diffInSeconds / minute);
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
	} else if (diffInSeconds < day) {
		const hours = Math.floor(diffInSeconds / hour);
		return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
	} else if (diffInSeconds < week) {
		const days = Math.floor(diffInSeconds / day);
		return `${days} ${days === 1 ? "day" : "days"} ago`;
	} else if (diffInSeconds < month) {
		const weeks = Math.floor(diffInSeconds / week);
		return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
	} else if (diffInSeconds < year) {
		const months = Math.floor(diffInSeconds / month);
		return `${months} ${months === 1 ? "month" : "months"} ago`;
	} else {
		const years = Math.floor(diffInSeconds / year);
		return `${years} ${years === 1 ? "year" : "years"} ago`;
	}
}
