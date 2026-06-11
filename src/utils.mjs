import { getSong } from "../data.mjs";

export function getSongId(listenEvent) {
	return listenEvent.song_id;
}
export function getArtistName(listenEvent) {
	return getSong(listenEvent.song_id).artist;
}
export function getGenreName(listenEvent) {
	return getSong(listenEvent.song_id).genre;
}

export function getFridayNightEvents(listenEvents) {
	const fridayNightStart = 17 * 60 * 60;
	const fridayNightEnd = 4 * 60 * 60;

	const friday = 5;
	const saturday = 6;

	const filteredEvents = [];

	for (const event of listenEvents) {
		const eventDay = new Date(event.timestamp).getDay();
		const eventTime = event.seconds_since_midnight;

		if (
			(eventDay === friday && eventTime >= fridayNightStart) ||
			(eventDay === saturday && eventTime < fridayNightEnd)
		) {
			filteredEvents.push(event);
		}
	}

	return filteredEvents;
}
export function getTopGenres(listenEvents) {
	const genreCounts = getCountsByListenEvents(listenEvents, getGenreName);

	return Object.entries(genreCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
		.map((genre) => genre[0]);
}
export function getMostListenedByCount(listenEvents, getValueToCount) {
	const counts = getCountsByListenEvents(listenEvents, getValueToCount);

	let maxCount = 0;
	let mostListened;

	for (const value in counts) {
		if (counts[value] > maxCount) {
			maxCount = counts[value];
			mostListened = value;
		}
	}
	return mostListened;
}
export function getCountsByListenEvents(listenEvents, getValueToCount) {
	const counts = {};

	for (const event of listenEvents) {
		const value = getValueToCount(event);
		counts[value] = (counts[value] || 0) + 1;
	}

	return counts;
}
export function getMostListenedByTime(listenEvents, getValueToCount) {
	const counts = {};
	let maxCount = 0;
	let mostListened;
	for (const event of listenEvents) {
		const value = getValueToCount(event);
		counts[value] =
			(counts[value] || 0) + getSong(event.song_id).duration_seconds;

		if (counts[value] > maxCount) {
			maxCount = counts[value];
			mostListened = value;
		}
	}
	return mostListened;
}
export function getLongestStreak(listenEvents) {
	let currentSong = listenEvents[0].song_id;
	let currentStreak = 1;

	let maxSong = currentSong;
	let maxStreak = 1;

	for (let i = 1; i < listenEvents.length; i++) {
		if (listenEvents[i].song_id === currentSong) {
			currentStreak += 1;
		} else {
			if (currentStreak > maxStreak) {
				maxStreak = currentStreak;
				maxSong = currentSong;
			}
			currentSong = listenEvents[i].song_id;
			currentStreak = 1;
		}
	}

	if (currentStreak > maxStreak) {
		maxStreak = currentStreak;
		maxSong = currentSong;
	}

	return [
		{
			songId: maxSong,
			streakLength: maxStreak,
		},
	];
}
export function getEverydaySongs(listenEvents) {
	const dateGroups = {};
	for (const event of listenEvents) {
		const date = event.timestamp.slice(0, 10);
		if (!dateGroups[date]) {
			dateGroups[date] = new Set();
		}
		dateGroups[date].add(event.song_id);
	}

	const allDays = Object.values(dateGroups);

	const firstDay = allDays[0];

	const everydaySongs = [];

	for (const songId of firstDay) {
		let appearsEveryday = true;

		for (const day of allDays) {
			if (!day.has(songId)) {
				appearsEveryday = false;
				break;
			}
		}

		if (appearsEveryday) {
			everydaySongs.push(songId);
		}
	}

	return everydaySongs;
}
