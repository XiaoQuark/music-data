import { getUserIDs, getListenEvents, getSong } from "./data.mjs";

const state = {
	users: null,
	selectedUser: null,
	userListenEvents: [],
};

const elements = {
	userSelect: null,
	userHeading: "",
	topSong: "",
	topArtist: "",
	topFridayNightSong: "",
};

window.onload = function () {
	elements.userSelect = document.getElementById("user-select");
	elements.userHeading = document.getElementById("user-heading");
	elements.topSong = document.getElementById("song-most-listens");
	elements.topArtist = document.getElementById("artist-most-listens");
	elements.topFridayNightSong = document.getElementById(
		"friday-most-listens",
	);

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
	console.log(state.selectedUser);
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

	elements.topSong.textContent = `By listens: ${topSongByCount.title} by ${topSongByCount.artist}`;
	elements.topArtist.textContent = `By listens: ${topArtistByCount}`;
	elements.topFridayNightSong.textContent = `By listens: ${topFridayNightSongByCount.title} by ${topFridayNightSongByCount.artist}`;
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
