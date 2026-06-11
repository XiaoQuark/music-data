# TESTING.md

## The website must contain a drop-down which lists four users

- Verified that the dropdown contains User 1, User 2, User 3 and User 4.
- Confirmed that all users can be selected in the browser.

## Selecting a user must display answers relevant to that user

- Selected Users 1, 2 and 3 and verified that the displayed answers update correctly when changing users.
- Compared the displayed results against the expected output table provided in the project brief.

## Question 1: Most listened song by number of listens

- Manually tested Users 1, 2 and 3 in the browser.
- Verified that the displayed song matches the expected output table.

## Question 2: Most listened artist by number of listens

- Manually tested Users 1, 2 and 3 in the browser.
- Verified that the displayed artist matches the expected output table.

## Question 3: Most listened song on Friday nights

- Manually tested Users 1, 2 and 3 in the browser.
- Verified that the displayed Friday night song matches the expected output table.
- Verified that the Friday Night Song section is hidden for User 3 because there are no Friday night listens.
- Unit tests in `tests/utils.test.mjs` verify Friday night filtering.

## Question 4: Listening time instead of number of listens

- Manually tested Users 1, 2 and 3 in the browser.
- Verified that song, artist and Friday night song results by listening time match the expected output table.
- Verified that the Friday night listening-time answer is hidden for User 3 because there are no Friday night listens.

## Question 5: Longest listening streak

- Manually tested Users 1, 2 and 3 in the browser.
- Verified that the displayed song and streak length match the expected output table.
- Unit tests in `tests/utils.test.mjs` verify longest streak calculation and tied streak behaviour.

## Question 6: Songs listened to every day

- Manually tested Users 1, 2 and 3 in the browser.
- Verified that Users 1 and 2 display the expected every day songs.
- Verified that the Every Day Songs section is hidden for User 3 because there are no songs listened to every day.
- Unit tests in `tests/utils.test.mjs`.

## Question 7: Top genres by number of listens

- Manually tested Users 1, 2 and 3 in the browser.
- Verified that the displayed genres match the expected output table.
- Verified that User 2 displays only the available genre and that the heading says "Top Genres".

## User 4 has no data

- Selected User 4 in the dropdown.
- Verified that a message is displayed informing the user that no listening data exists.
- Verified that all question sections are hidden when User 4 is selected.

## Questions which do not apply must be hidden

- Selected User 3 and verified that the Friday Night Song and the Every Day Songs sections are hidden as per the results table.
- Confirmed that no empty results or error messages are displayed.

## Unit tests must be written for at least one non-trivial function

- Unit tests were written in `tests/utils.test.mjs`.
- Ran `npm test` and confirmed that all tests pass successfully.

## Accessibility

- Ran Lighthouse accessibility audits throughout development.
- Verified a final Lighthouse Accessibility score of 100 for every tested view.
- Confirmed that all interactive elements can be reached and operated using keyboard navigation.
