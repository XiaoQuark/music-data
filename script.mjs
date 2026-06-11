import { getUserIDs, getListenEvents, getSong } from "./data.mjs";

const state = {
	users: null,
	selectedUser: null,
	userListenEvents: [],
};

const elements = {
	userSelect: null,
	userHeading: null,
	dataSection: null,
	topSongByCount: null,
	topSongByTime: null,
	topArtistByCount: null,
	topArtistByTime: null,
	topFridayNightSongByCount: null,
	topFridayNightSongByTime: null,
	streakList: null,
	everydaySongList: null,
	topGenresList: null,
};

window.onload = function () {
	elements.userSelect = document.getElementById("user-select");
	elements.userHeading = document.getElementById("user-heading");
	elements.dataSection = document.getElementById("data-container");
	elements.topSongByCount = document.getElementById("song-most-listens");
	elements.topSongByTime = document.getElementById("song-most-listen-time");
	elements.topArtistByCount = document.getElementById("artist-most-listens");
	elements.topArtistByTime = document.getElementById(
		"artist-most-listen-time",
	);
	elements.topFridayNightSongByCount = document.getElementById(
		"friday-most-listens",
	);
	elements.topFridayNightSongByTime = document.getElementById(
		"friday-most-listen-time",
	);
	elements.streakList = document.getElementById("song-streak-list");
	elements.everydaySongList = document.getElementById("every-day-list");
	elements.topGenresList = document.getElementById("top-genres");

	elements.dataSection.hidden = true;

	state.users = getUserIDs();

	populateUserDropdown();

	elements.userSelect.addEventListener("change", handleUserChange);
};

function populateUserDropdown() {
	for (const user of state.users) {
		const option = document.createElement("option");
		option.value = user;
		option.textContent = `User ${user}`;
		elements.userSelect.appendChild(option);
	}
}

function getSongId(listenEvent) {
	return listenEvent.song_id;
}

function getArtistName(listenEvent) {
	return getSong(listenEvent.song_id).artist;
}

function getFridayNightEvents(listenEvents) {
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

function getGenreName(listenEvent) {
	return getSong(listenEvent.song_id).genre;
}

function getTopGenres(listenEvents) {
	const genreCounts = getCountsByListenEvents(listenEvents, getGenreName);

	return Object.entries(genreCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
		.map((genre) => genre[0]);
}

function handleUserChange(event) {
	state.selectedUser = event.target.value;
	state.userListenEvents = getListenEvents(state.selectedUser) || [];

	if (state.userListenEvents.length === 0) {
		elements.dataSection.hidden = true;
		elements.userHeading.textContent = `User ${state.selectedUser} has no listening data`;

		return;
	}

	elements.dataSection.hidden = false;

	elements.userHeading.textContent = `User ${state.selectedUser} Listening Stats`;

	const topSongIdByCount = getMostListenedByCount(
		state.userListenEvents,
		getSongId,
	);

	const topSongByCount = getSong(topSongIdByCount);

	const topArtistByCount = getMostListenedByCount(
		state.userListenEvents,
		getArtistName,
	);

	const fridayNightEvents = getFridayNightEvents(state.userListenEvents);

	const topFridayNightSongIdByCount = getMostListenedByCount(
		fridayNightEvents,
		getSongId,
	);

	const topFridayNightSongByCount = getSong(topFridayNightSongIdByCount);

	const topSongIdByTime = getMostListenedByTime(
		state.userListenEvents,
		getSongId,
	);

	const topSongByTime = getSong(topSongIdByTime);

	const topArtistByTime = getMostListenedByTime(
		state.userListenEvents,
		getArtistName,
	);

	const topFridayNightSongIdByTime = getMostListenedByTime(
		fridayNightEvents,
		getSongId,
	);

	const topFridayNightSongByTime = getSong(topFridayNightSongIdByTime);

	const longestStreak = getLongestStreak(state.userListenEvents);

	const everydaySongs = getEverydaySongs(state.userListenEvents);

	const topGenres = getTopGenres(state.userListenEvents);

	elements.topSongByCount.textContent = `By listens: ${topSongByCount.title} by ${topSongByCount.artist}`;
	elements.topSongByTime.textContent = `By listening time: ${topSongByTime.title} by ${topSongByTime.artist}`;
	elements.topArtistByCount.textContent = `By listens: ${topArtistByCount}`;
	elements.topArtistByTime.textContent = `By listening time: ${topArtistByTime}`;
	elements.topFridayNightSongByCount.textContent = `By listens: ${topFridayNightSongByCount.title} by ${topFridayNightSongByCount.artist}`;
	elements.topFridayNightSongByTime.textContent = `By listening time: ${topFridayNightSongByTime.title} by ${topFridayNightSongByTime.artist}`;

	elements.streakList.textContent = "";

	for (const song of longestStreak) {
		const streakSong = getSong(song.songId);
		const streakItem = document.createElement("li");

		streakItem.textContent = `${streakSong.title} - ${streakSong.artist}. Listened to ${song.streakLength} times in a row`;
		streakItem.classList.add("streak-song");
		elements.streakList.appendChild(streakItem);
	}

	elements.everydaySongList.textContent = "";

	for (const song of everydaySongs) {
		const everydaySong = getSong(song);
		console.log(everydaySong);
		const songItem = document.createElement("li");
		songItem.classList.add("everyday-song");
		songItem.textContent = `${everydaySong.title} by ${everydaySong.artist}`;
		elements.everydaySongList.appendChild(songItem);
	}

	elements.topGenresList.textContent = "";

	for (const genre of topGenres) {
		const genreItem = document.createElement("li");
		genreItem.classList.add("genre");
		genreItem.textContent = genre;
		elements.topGenresList.appendChild(genreItem);
	}
}

function getMostListenedByCount(listenEvents, getValueToCount) {
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

function getCountsByListenEvents(listenEvents, getValueToCount) {
	const counts = {};

	for (const event of listenEvents) {
		const value = getValueToCount(event);
		counts[value] = (counts[value] || 0) + 1;
	}

	return counts;
}

function getMostListenedByTime(listenEvents, getValueToCount) {
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

function getLongestStreak(listenEvents) {
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

function getEverydaySongs(listenEvents) {
	const dateGroups = {};
	for (const event of listenEvents) {
		const date = event.timestamp.slice(0, 10);
		if (!dateGroups[date]) {
			dateGroups[date] = new Set();
		}
		dateGroups[date].add(event.song_id);
	}

	const allDays = Object.values(dateGroups);
	console.log(allDays);
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

	console.log(everydaySongs);
	return everydaySongs;
}
