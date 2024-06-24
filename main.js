const ctrlIcon = document.querySelector("#ctrlIcon");
const progress = document.querySelector("#progress");
const songList = document.querySelector("#songList");
const song = document.querySelector(".songAudio");
const shuffleSongs = document.querySelector("#shuffleSongs");
const songTitle = document.querySelector(".song-title");
const songImage = document.querySelector(".song-img");
const prevSong = document.querySelector("#prev-song");
const nextSong = document.querySelector("#next-song");
const songSource = document.querySelector(".songSource");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");
const genreCard = document.querySelector(".genre-cards");
let shuffleActivated = false;
let songs = [];
let genres = [];
let index = 0;

//fetching songs from the server server
async function fetchSongs() {
    try {
        const endpoint =
            // "https://chummy-music-server.herokuapp.com/api/songList";
            "http://localhost:3000/api/songList";
        const songList = await fetch("./songList.json");
        const songGenre = await fetch("./songGenres.json");
        console.log(songList);
        songs = await songList.json();
        genres = await songGenre.json();
        console.log(songs, "songs");
        displayList(songs);
        displayGenres(genres);
    } catch (error) {
        console.error("error while fetching data:", error);
    }
}

shuffleSongs.addEventListener("click", () => {
    shuffleSongs.classList.toggle("active");
    shuffleActivated = !shuffleActivated;
});

genreCard.addEventListener("wheel", (event) => {
    event.preventDefault();
    genreCard.scrollLeft += event.deltaY;
    genreCard.style;
});

function displayList(data) {
    songList.innerHTML = ``;
    data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.classList.add("song");
        // setInterval(() => {
        //     listItem.style.backgroundColor = "rgb(245, 49, 146, 0.2)";
        // }, song.duration);
        listItem.innerHTML = `
            <div class="details">
                <p>${item.title}</p>
                <span>${item.duration}</span>
            </div>
            <div class="cover"></div>
        `;
        listItem.addEventListener("click", (e) => {
            console.log(e.target);
            selectSong(e, item);
            highlightSong(e);
        });
        songList.appendChild(listItem);
    });
}

function displayGenres(data) {
    data.forEach((genre) => {
        const card = document.createElement("div");
        card.classList.add("genre-card");
        card.innerHTML = `
            <img src="${genre.image}" class="genre-image"/>
            <p>${genre.genre}</p>
        `;
        genreCard.appendChild(card);
    });
}

function selectSong(e, item) {
    e.preventDefault();
    songTitle.innerHTML = "";
    songTitle.innerHTML = item.title;
    songImage.src = `${item.image}`;
    song.load();
    songSource.src = `${item.url}`;
    songSource.id = item.id;
    index = Number(songSource.id)
    console.log(songSource.id, songSource, "source dets");
    songPlay();
}

song.onloadedmetadata = function () {
    progress.max = song.duration;
    progress.value = song.currentTime;
};

function playPause() {
    if (ctrlIcon.classList.contains("fa-pause")) {
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
    } else {
        // song.play();
        song.play().catch((error) => {
            console.error("Playback failed:", error);
        });
        ctrlIcon.classList.remove("fa-play");
        ctrlIcon.classList.add("fa-pause");
    }
}

if (song.play()) {
    setInterval(() => {
        progress.value = song.currentTime;
    }, 500);
}

progress.onchange = function () {
    song.play();
    song.currentTime = progress.value;
    console.log(progress.value);
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
};

song.addEventListener("ended", () => {
    if (shuffleActivated) {
        let songNumber = Math.floor(Math.random() * songs.length);
        song.load();
        songSource.src = `${songs[songNumber].url}`;
        songPlay();
        songTitle.innerHTML = "";
        songTitle.innerHTML = songs[songNumber].title;
        songImage.src = `${songs[songNumber].image}`;
        songSource.id = songs[songNumber].id;
        console.log(songSource.id, "id at ended shuffled");
        // highlightSong(e);
    } else {
        if (index >= songs.length) {
            index = 0;
            song.load();
            console.log(index, "index");
            songSource.src = `${songs[index].url}`;
            songPlay();
            songTitle.innerHTML = "";
            songTitle.innerHTML = songs[index].title;
            songImage.src = `${songs[index].image}`;
            songSource.id = songs[index].id;
        } else if (index < songs.length) {
            song.load();
            console.log(index, "index");
            index = index + 1;
            console.log(index, "after plus 1");
            songSource.src = `${songs[index].url}`;
            songPlay();
            songTitle.innerHTML = "";
            songTitle.innerHTML = songs[index].title;
            songImage.src = `${songs[index].image}`;
            songSource.id = songs[index].id;
            console.log(songSource.id, "songId");
            console.log(index, "after plus 1");
        }
    }
});

// let i = 0
// let lastPlayedFIle = null

nextSong.addEventListener("click", (e) => {
    console.log(e.target);
    if (shuffleActivated) {
        let songNumber = Math.floor(Math.random() * songs.length);
        song.load();
        songSource.src = `${songs[songNumber].url}`;
        songPlay();
        songTitle.innerHTML = "";
        songTitle.innerHTML = songs[songNumber].title;
        songImage.src = `${songs[songNumber].image}`;
        // highlightSong(e);
    } else {
        console.log(songSource.id, "song here");
        if (songSource.id == "") {
            index = 0;
            songSource.id = 0;
            console.log("first");
        } else {
            index = Number(songSource.id) + 1;
            console.log("second");
        }
        if (index < songs.length) {
            song.load();
            console.log(index, "index");
            songSource.src = `${songs[index].url}`;
            songPlay();
            songTitle.innerHTML = "";
            songTitle.innerHTML = songs[index].title;
            songImage.src = `${songs[index].image}`;
            songSource.id = songs[index].id;
            // index = index + 1;
        } else if (index >= songs.length) {
            index = 0;
            song.load();
            console.log(index, "index");
            songSource.src = `${songs[index].url}`;
            songPlay();
            songTitle.innerHTML = "";
            songTitle.innerHTML = songs[index].title;
            songImage.src = `${songs[index].image}`;
            songSource.id = songs[index].id;
        }
    }
});

prevSong.addEventListener("click", (e) => {
    if (shuffleActivated) {
        let songNumber = Math.floor(Math.random() * songs.length);
        song.load();
        songSource.src = `${songs[songNumber].url}`;
        songPlay();
        songTitle.innerHTML = "";
        songTitle.innerHTML = songs[songNumber].title;
        songImage.src = `${songs[songNumber].image}`;
        // highlightSong(e);
    } else {
        console.log(songSource.id, "song here");
        if (songSource.id == "" && songSource.id === "0") {
            index = 0;
            songSource.id = 0;
            console.log("first");
        } else {
            index = Number(songSource.id) - 1;
            console.log("second");
        }

        if (index === songs.length - 1) {
            if (index === 0) {
                index = songs.length - 1;
            }
            index = 0;
            song.load();
            console.log(index, "index2");
            songSource.src = `${songs[index].url}`;
            songPlay();
            songTitle.innerHTML = "";
            songTitle.innerHTML = songs[index].title;
            songImage.src = `${songs[index].image}`;
            songSource.id = songs[index].id;
        } else if (index < songs.length && index > 0) {
            song.load();
            console.log(index, "index loaded");
            songSource.src = `${songs[index].url}`;
            songPlay();
            songTitle.innerHTML = "";
            songTitle.innerHTML = songs[index].title;
            songImage.src = `${songs[index].image}`;
            songSource.id = songs[index].id;
            // index = index + 1;
        }
    }
});

searchBtn.addEventListener("click", () => {
    let foundSong = null;

    if (searchInput.value === "") {
        alert("Search field cannot be empty.");
        return false;
    }

    for (let i = 0; i < songs.length; i++) {
        if (
            songs[i].title
                .toLowerCase()
                .includes(searchInput.value.toLowerCase())
        ) {
            foundSong = songs[i];
            break;
        }
    }

    if (foundSong) {
        song.load();
        songSource.src = `${foundSong.url}`;
        song.play();
        songTitle.innerHTML = "";
        songTitle.innerHTML = `${foundSong.title}`;
        songImage.src = `${foundSong.image}`;
        songSource.id = foundSong.id;
        index = Number(songSource.id)
        if (ctrlIcon.classList.contains("fa-play")) {
            ctrlIcon.classList.remove("fa-play");
            ctrlIcon.classList.add("fa-pause");
        }
    } else {
        alert("Song not found");
    }
});

function songPlay() {
    song.addEventListener(
        "canplaythrough",
        () => {
            song.play().catch((error) => {
                console.error("Playback failed:", error);
            });
        },
        { once: true }
    );
    ctrlIcon.classList.remove("fa-play");
    ctrlIcon.classList.add("fa-pause");
}

function highlightSong(e) {
    setInterval(() => {
        e.target.style.backgroundColor = "rgb(245, 49, 146, 0.2)";
    }, song.duration);
}

function loadTransition() {
    document.getElementById("body").setAttribute("style", "opacity: 1");
    document
        .getElementById("body")
        .setAttribute("style", "transform: translateY(0px)");
    document.getElementById("body").setAttribute("style", "transition: 1s");
}

document.querySelector(".controlIcon").addEventListener("click", playPause);
document.addEventListener("DOMContentLoaded", () => {
    fetchSongs();
    // playPause();
    loadTransition()
});

window.addEventListener("keydown", (event) => {
    console.log(event.code, "keycode");
    if (event.code === "Space" && ctrlIcon.classList.contains("fa-pause")) {
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
    } else if (event.code === "Space") {
        song.play().catch((error) => {
            console.error("Playback failed:", error);
        });
        ctrlIcon.classList.remove("fa-play");
        ctrlIcon.classList.add("fa-pause");
    }
});
