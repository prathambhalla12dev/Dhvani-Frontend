const artistName = document.getElementById("artistName");
const songTitle = document.getElementById("songTitle");
const songUrl = document.getElementById("songUrl");
const songArtist = document.getElementById("songArtist");
const addArtistButton = document.getElementById("addArtistButton");
const addSongButton = document.getElementById("addSongButton");
const resultAddArtist = document.getElementById("resultAddArtist");
const resultAddSong = document.getElementById("resultAddSong");

addArtistButton.addEventListener("click", async function () {
  const payload = {
    name: artistName.value,
  };

  try {
    const response = await fetch("http://localhost:8080/api/admin/artists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.successful) {
      resultAddArtist.textContent = "Artist added successfully";
      resultAddArtist.style.color = "green";
      artistName.value = "";
    } else {
      resultAddArtist.textContent = data.message || "Failed to add artist";
      resultAddArtist.style.color = "red";
    }
  } catch (error) {
    resultAddArtist.textContent = "Server error";
    resultAddArtist.style.color = "red";
  }
});

addSongButton.addEventListener("click", async function () {
  const payload = {
    title: songTitle.value,
    url: songUrl.value,
    artistName: songArtist.value,
  };

  try {
    const response = await fetch("http://localhost:8080/api/admin/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.successful) {
      resultAddSong.textContent = "Song added successfully";
      resultAddSong.style.color = "green";
      songTitle.value = "";
      songUrl.value = "";
      songArtist.value = "";
    } else {
      resultAddSong.textContent = data.message || "Failed to add song";
      resultAddSong.style.color = "red";
    }
  } catch (error) {
    resultAddSong.textContent = "Server error";
    resultAddSong.style.color = "red";
  }
});
