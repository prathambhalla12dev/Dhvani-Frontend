import {BASE_URL} from "./config.js"

const songSearchForm = document.getElementById("songSearchForm")
const songSearchInput = document.getElementById("songSearchFormInput")
const songSearchResult = document.getElementById("songSearchResult");

songSearchForm.addEventListener("submit", async function (e) {
    e.preventDefault()
    const title = songSearchInput.value;
    const response = await fetch(`${BASE_URL}//Dhvani/songs/get/id/by/title`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({title})
    });

    const result = await response.json();
    const message = result.message;
    const songId = result.data.song_id;

    songSearchResult.hidden = false;
    songSearchResult.textContent = message + " " + songId;
});