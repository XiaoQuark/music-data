import { getUserIDs } from "./data.mjs";

const state = {
	users: null,
};

const elements = {
	userSelect: null,
};

window.onload = function () {
	elements.userSelect = document.getElementById("user-select");
	// document.querySelector("body").innerText =
	// 	`There are ${countUsers()} users`;
	state.users = getUserIDs();

	populateUserDropdown();
};

function populateUserDropdown() {
	for (const user of state.users) {
		const option = document.createElement("option");
		option.value = "user";
		option.textContent = `User ${user}`;
		elements.userSelect.appendChild(option);
	}
}
