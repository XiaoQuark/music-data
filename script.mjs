import { getUserIDs, getListenEvents, getSong } from "./data.mjs";

const state = {
	users: null,
	selectedUser: null,
	userListenEvents: [],
};

const elements = {
	userSelect: null,
	userHeading: "",
	topSongByCount: null,
	topSongByTime: null,
	topArtistByCount: null,
	topArtistByTime: null,
	topFridayNightSongByCount: null,
	topFridayNightSongByTime: null,
	streakList: null,
};

window.onload = function () {
	elements.userSelect = document.getElementById("user-select");
	elements.userHeading = document.getElementById("user-heading");
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
	console.log(filteredEvents);
	return filteredEvents;
}

function handleUserChange(event) {
	state.selectedUser = event.target.value;
	state.userListenEvents = getListenEvents(state.selectedUser) || [];

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

	elements.topSongByCount.textContent = `By listens: ${topSongByCount.title} by ${topSongByCount.artist}`;
	elements.topSongByTime.textContent = `By listening time: ${topSongByTime.title} by ${topSongByTime.artist}`;
	elements.topArtistByCount.textContent = `By listens: ${topArtistByCount}`;
	elements.topArtistByTime.textContent = `By listening time: ${topArtistByTime}`;
	elements.topFridayNightSongByCount.textContent = `By listens: ${topFridayNightSongByCount.title} by ${topFridayNightSongByCount.artist}`;
	elements.topFridayNightSongByTime.textContent = `By listening time: ${topFridayNightSongByTime.title} by ${topFridayNightSongByTime.artist}`;

	elements.streakList.textContent = "";

	for (const song of longestStreak) {
		console.log(song);
		const streakSong = getSong(song.songId);
		const streakItem = document.createElement("li");
		console.log(streakSong);
		streakItem.textContent = `${streakSong.title} - ${streakSong.artist}. Listened to ${song.streakLength} times in a row`;
		streakItem.classList.add("streak-song");
		elements.streakList.appendChild(streakItem);
	}
}

function getMostListenedByCount(listenEvents, getValueToCount) {
	const counts = {};
	let maxCount = 0;
	let mostListened;
	for (const event of listenEvents) {
		const value = getValueToCount(event);
		counts[value] = (counts[value] || 0) + 1;

		if (counts[value] > maxCount) {
			maxCount = counts[value];
			mostListened = value;
		}
	}
	return mostListened;
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
