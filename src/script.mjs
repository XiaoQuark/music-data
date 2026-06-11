import { getUserIDs, getListenEvents, getSong } from "../data.mjs";
import {
	getSongId,
	getArtistName,
	getFridayNightEvents,
	getTopGenres,
	getMostListenedByCount,
	getMostListenedByTime,
	getLongestStreak,
	getEverydaySongs,
} from "./utils.mjs";

const state = {
	users: null,
	selectedUser: null,
	userListenEvents: [],
};

const elements = {
	userSelect: null,
	userHeading: null,
	dataSection: null,
	fridayNightArticle: null,
	everydaySongArticle: null,
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
	elements.fridayNightArticle = document.getElementById(
		"friday-night-article",
	);
	elements.everydaySongArticle = document.getElementById("every-day-article");
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

function handleUserChange(event) {
	state.selectedUser = event.target.value;
	state.userListenEvents = getListenEvents(state.selectedUser) || [];

	if (state.userListenEvents.length === 0) {
		elements.dataSection.hidden = true;
		elements.userHeading.textContent = `User ${state.selectedUser} has not listened to any songs`;

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

	if (fridayNightEvents.length === 0) {
		elements.fridayNightArticle.hidden = true;
	} else {
		elements.fridayNightArticle.hidden = false;
		const topFridayNightSongIdByCount = getMostListenedByCount(
			fridayNightEvents,
			getSongId,
		);
		const topFridayNightSongByCount = getSong(topFridayNightSongIdByCount);

		const topFridayNightSongIdByTime = getMostListenedByTime(
			fridayNightEvents,
			getSongId,
		);
		const topFridayNightSongByTime = getSong(topFridayNightSongIdByTime);

		elements.topFridayNightSongByCount.textContent = `By listens: ${topFridayNightSongByCount.title} by ${topFridayNightSongByCount.artist}`;
		elements.topFridayNightSongByTime.textContent = `By listening time: ${topFridayNightSongByTime.title} by ${topFridayNightSongByTime.artist}`;
	}

	const topSongIdByTime = getMostListenedByTime(
		state.userListenEvents,
		getSongId,
	);

	const topSongByTime = getSong(topSongIdByTime);

	const topArtistByTime = getMostListenedByTime(
		state.userListenEvents,
		getArtistName,
	);

	const longestStreak = getLongestStreak(state.userListenEvents);

	const everydaySongs = getEverydaySongs(state.userListenEvents);

	if (everydaySongs.length === 0) {
		elements.everydaySongArticle.hidden = true;
		elements.everydaySongList.textContent = "";
	} else {
		elements.everydaySongArticle.hidden = false;

		elements.everydaySongList.textContent = "";

		for (const song of everydaySongs) {
			const everydaySong = getSong(song);

			const songItem = document.createElement("li");
			songItem.classList.add("everyday-song");
			songItem.textContent = `${everydaySong.title} by ${everydaySong.artist}`;
			elements.everydaySongList.appendChild(songItem);
		}
	}

	const topGenres = getTopGenres(state.userListenEvents);

	elements.topSongByCount.textContent = `By listens: ${topSongByCount.title} by ${topSongByCount.artist}`;
	elements.topSongByTime.textContent = `By listening time: ${topSongByTime.title} by ${topSongByTime.artist}`;
	elements.topArtistByCount.textContent = `By listens: ${topArtistByCount}`;
	elements.topArtistByTime.textContent = `By listening time: ${topArtistByTime}`;

	elements.streakList.textContent = "";

	for (const song of longestStreak) {
		const streakSong = getSong(song.songId);
		const streakItem = document.createElement("li");

		streakItem.textContent = `${streakSong.title} - ${streakSong.artist}. Listened to ${song.streakLength} times in a row`;
		streakItem.classList.add("streak-song");
		elements.streakList.appendChild(streakItem);
	}

	elements.topGenresList.textContent = "";

	for (const genre of topGenres) {
		const genreItem = document.createElement("li");
		genreItem.classList.add("genre");
		genreItem.textContent = genre;
		elements.topGenresList.appendChild(genreItem);
	}
}
