import assert from "node:assert";
import test from "node:test";
import { getFridayNightEvents } from "../src/utils.mjs";

// getFridayNightEvents
test("returns listens from Friday 5pm onwards", () => {
	const listenEvents = [
		{
			timestamp: "2024-08-02T16:59:59",
			seconds_since_midnight: 61199,
			song_id: "song-1",
		},
		{
			timestamp: "2024-08-02T17:00:00",
			seconds_since_midnight: 61200,
			song_id: "song-2",
		},
	];

	const result = getFridayNightEvents(listenEvents);

	const expected = [
		{
			timestamp: "2024-08-02T17:00:00",
			seconds_since_midnight: 61200,
			song_id: "song-2",
		},
	];

	assert.deepEqual(result, expected);
});

test("returns listens from Saturday before 4am", () => {
	const listenEvents = [
		{
			timestamp: "2024-08-03T03:59:59",
			seconds_since_midnight: 14399,
			song_id: "song-1",
		},
		{
			timestamp: "2024-08-03T04:00:00",
			seconds_since_midnight: 14400,
			song_id: "song-2",
		},
	];

	const result = getFridayNightEvents(listenEvents);

	const expected = [
		{
			timestamp: "2024-08-03T03:59:59",
			seconds_since_midnight: 14399,
			song_id: "song-1",
		},
	];

	assert.deepEqual(result, expected);
});

test("returns only Friday night listens, between 5pm and 4am", () => {
	const listenEvents = [
		{
			timestamp: "2024-08-01T20:00:00", // Thursday
			seconds_since_midnight: 72000,
			song_id: "song-1",
		},
		{
			timestamp: "2024-08-02T16:59:59", // Friday before 5pm
			seconds_since_midnight: 61199,
			song_id: "song-2",
		},
		{
			timestamp: "2024-08-02T17:00:00", // Friday at 5pm
			seconds_since_midnight: 61200,
			song_id: "song-3",
		},
		{
			timestamp: "2024-08-03T03:59:59", // Saturday before 4am
			seconds_since_midnight: 14399,
			song_id: "song-4",
		},
		{
			timestamp: "2024-08-03T04:00:00", // Saturday at 4am
			seconds_since_midnight: 14400,
			song_id: "song-5",
		},
	];

	const result = getFridayNightEvents(listenEvents);

	const expected = [
		{
			timestamp: "2024-08-02T17:00:00",
			seconds_since_midnight: 61200,
			song_id: "song-3",
		},
		{
			timestamp: "2024-08-03T03:59:59",
			seconds_since_midnight: 14399,
			song_id: "song-4",
		},
	];

	assert.deepEqual(result, expected);
});

test("returns an empty array when there are no Friday night listens", () => {
	const listenEvents = [
		{
			timestamp: "2024-08-05T20:00:00", // Monday
			seconds_since_midnight: 72000,
			song_id: "song-1",
		},
	];

	const result = getFridayNightEvents(listenEvents);

	assert.deepEqual(result, []);
});
