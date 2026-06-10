import { getUserIDs, getListenEvents } from "./data.mjs";

const state = {
	users: null,
	selectedUser: null,
	userListenEvents: [],
};

const elements = {
	userSelect: null,
	userHeading: "",
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

function handleUserChange() {
	state.selectedUser = event.target.value;
	console.log(state.selectedUser);
	state.userListenEvents = getListenEvents(state.selectedUser) || [];
	console.log(state.userListenEvents);
	elements.userHeading.textContent = `User ${state.selectedUser} Listening Stats`;
}
