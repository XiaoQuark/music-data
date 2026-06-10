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
};

window.onload = function () {
	elements.userSelect = document.getElementById("user-select");
	elements.userHeading = document.getElementById("user-heading");
	// document.querySelector("body").innerText =
	// 	`There are ${countUsers()} users`;
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

function handleUserChange(event) {
	state.selectedUser = event.target.value;
	console.log(state.selectedUser);
	state.userListenEvents = getListenEvents(state.selectedUser) || [];

	elements.userHeading.textContent = `User ${state.selectedUser} Listening Stats`;

	elements.topSong = document.getElementById("song-most-listens");
	const topSongIdByCount = getMostListenedSongByCount(state.userListenEvents);
	const topSongByCount = getSong(topSongIdByCount);
	elements.topSong.textContent = `By listens: ${topSongByCount.title} by ${topSongByCount.artist}`;
}

function getMostListenedSongByCount(listenEvents) {
	const counts = {};
	let max = 0;
	let result;
	for (const event of listenEvents) {
		const songId = event.song_id;
		counts[songId] = (counts[songId] || 0) + 1;
		if (counts[songId] > max) {
			max = counts[songId];
			result = songId;
		}
	}
	console.log(counts);
	console.log(result);
	return result;
}
