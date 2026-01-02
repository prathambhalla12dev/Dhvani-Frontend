// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Mock database
const songsDatabase = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:42", url: "" },
    { id: 2, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23", url: "" },
    { id: 3, title: "Save Your Tears", artist: "The Weeknd", album: "After Hours", duration: "3:35", url: "" },
    { id: 4, title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: "2:58", url: "" },
    { id: 5, title: "Peaches", artist: "Justin Bieber", album: "Justice", duration: "3:18", url: "" },
    { id: 6, title: "drivers license", artist: "Olivia Rodrigo", album: "SOUR", duration: "4:02", url: "" },
    { id: 7, title: "Stay", artist: "The Kid LAROI", album: "Stay", duration: "2:21", url: "" },
    { id: 8, title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", duration: "3:58", url: "" },
    { id: 9, title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: "2:47", url: "" },
    { id: 10, title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights", duration: "3:20", url: "" },
    { id: 11, title: "Calm Down", artist: "Rema & Selena Gomez", album: "Rave & Roses", duration: "3:59", url: "" },
    { id: 12, title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer", duration: "3:20", url: "" },
    { id: 13, title: "Unholy", artist: "Sam Smith & Kim Petras", album: "Gloria", duration: "2:36", url: "" },
    { id: 14, title: "Vampire", artist: "Olivia Rodrigo", album: "GUTS", duration: "3:39", url: "" },
    { id: 15, title: "Cruel Summer", artist: "Taylor Swift", album: "Lover", duration: "2:58", url: "" },
    { id: 16, title: "Die For You", artist: "The Weeknd", album: "Starboy", duration: "4:20", url: "" },
    { id: 17, title: "Snooze", artist: "SZA", album: "SOS", duration: "3:22", url: "" },
    { id: 18, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54", url: "" }
];

const artistsDatabase = [
    { id: 1, name: "The Weeknd", genre: "R&B, Pop", songs: 245 },
    { id: 2, name: "Dua Lipa", genre: "Pop", songs: 89 },
    { id: 3, name: "Olivia Rodrigo", genre: "Pop, Rock", songs: 34 },
    { id: 4, name: "Justin Bieber", genre: "Pop, R&B", songs: 312 },
    { id: 5, name: "Glass Animals", genre: "Indie, Alternative", songs: 67 },
    { id: 6, name: "Harry Styles", genre: "Pop, Rock", songs: 98 },
    { id: 7, name: "Taylor Swift", genre: "Pop, Country", songs: 456 }
];

const popularSongs = [1, 2, 8, 9, 11, 12];
const recommendedSongs = [3, 5, 7, 10, 13, 14];

// State management
let currentSong = null;
let isPlaying = false;
let currentProgress = 0;
let currentVolume = 70;
let currentSearchTab = 'songs';
let likedSongs = [];
let recentlyPlayed = [
    songsDatabase[0],
    songsDatabase[1],
    songsDatabase[2],
    songsDatabase[3]
];

// DOM Elements
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const volumeSlider = document.getElementById('volumeSlider');
const volumeFill = document.getElementById('volumeFill');
const volumeIcon = document.getElementById('volumeIcon');
const greeting = document.getElementById('greeting');
const quickSearch = document.getElementById('quickSearch');
const mainSearch = document.getElementById('mainSearch');
const searchResults = document.getElementById('searchResults');
const currentTrack = document.getElementById('currentTrack');
const currentArtist = document.getElementById('currentArtist');
const recentlyPlayedList = document.getElementById('recentlyPlayed');
const likedContent = document.getElementById('likedContent');
const popularMusic = document.getElementById('popularMusic');
const recommendedMusic = document.getElementById('recommendedMusic');

// API Functions
async function searchSongsAPI(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/songs/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        return data.map(song => ({
            id: song.id,
            title: song.title,
            artist: song.artistName,
            artistId: song.artistId,
            album: '',
            duration: '',
            url: song.url
        }));
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

async function searchArtistsAPI(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/artists/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Set greeting based on time
function setGreeting() {
    const hour = new Date().getHours();
    let greetingText;

    if (hour >= 5 && hour < 12) {
        greetingText = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
        greetingText = 'Good afternoon';
    } else if (hour >= 17 && hour < 22) {
        greetingText = 'Good evening';
    } else {
        greetingText = 'Good night';
    }

    greeting.textContent = greetingText;
}

// Navigation
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        contentSections.forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}Section`).classList.add('active');
    });
});

// Search tabs
const searchTabs = document.querySelectorAll('.search-tab');
searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        currentSearchTab = tab.dataset.tab;
        searchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (mainSearch.value.trim()) {
            performSearch(mainSearch.value.trim());
        }
    });
});

// Search functionality
async function performSearch(query) {
    if (!query) {
        searchResults.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Start searching</h3>
                <p>Find your favorite songs and artists</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">⏳</div>
            <h3>Searching...</h3>
        </div>
    `;

    if (currentSearchTab === 'songs') {
        const apiResults = await searchSongsAPI(query);
        if (apiResults) {
            displaySongResults(apiResults);
        } else {
            const lowerQuery = query.toLowerCase();
            const results = songsDatabase.filter(song =>
                song.title.toLowerCase().includes(lowerQuery) ||
                song.artist.toLowerCase().includes(lowerQuery) ||
                (song.album && song.album.toLowerCase().includes(lowerQuery))
            );
            displaySongResults(results);
        }
    } else {
        const apiResults = await searchArtistsAPI(query);
        if (apiResults) {
            displayArtistResults(apiResults);
        } else {
            const lowerQuery = query.toLowerCase();
            const results = artistsDatabase.filter(artist =>
                artist.name.toLowerCase().includes(lowerQuery) ||
                artist.genre.toLowerCase().includes(lowerQuery)
            );
            displayArtistResults(results);
        }
    }
}

function displaySongResults(songs) {
    if (songs.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">😔</div>
                <h3>No songs found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = songs.map(song => `
        <div class="song-result" data-song-id="${song.id}">
            <div class="result-thumb"></div>
            <div class="result-info">
                <div class="result-title">${song.title}</div>
                <div class="result-meta">${song.artist}${song.album ? ' • ' + song.album : ''}</div>
            </div>
            <div class="result-actions">
                ${song.duration ? `<span class="recent-duration">${song.duration}</span>` : ''}
                <button class="like-btn ${likedSongs.includes(song.id) ? 'liked' : ''}" data-song-id="${song.id}">
                    ${likedSongs.includes(song.id) ? '❤️' : '🤍'}
                </button>
                <button class="play-item-btn">
                    <div class="play-item-icon"></div>
                </button>
            </div>
        </div>
    `).join('');

    attachSongResultListeners();
}

function displayArtistResults(artists) {
    if (artists.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">😔</div>
                <h3>No artists found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = artists.map(artist => `
        <div class="artist-result" data-artist-id="${artist.id}">
            <div class="result-thumb"></div>
            <div class="result-info">
                <div class="result-title">${artist.name}</div>
                <div class="result-meta">${artist.genre} • ${artist.songs} songs</div>
            </div>
        </div>
    `).join('');
}

function attachSongResultListeners() {
    const playButtons = document.querySelectorAll('.song-result .play-item-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.closest('.song-result').dataset.songId);
            let song = songsDatabase.find(s => s.id === songId);

            if (!song) {
                const resultElement = btn.closest('.song-result');
                const title = resultElement.querySelector('.result-title').textContent;
                const metaText = resultElement.querySelector('.result-meta').textContent;
                const artist = metaText.split(' • ')[0];

                song = {
                    id: songId,
                    title: title,
                    artist: artist,
                    album: '',
                    duration: '3:00',
                    url: ''
                };
            }
            playSong(song);
        });
    });

    const likeButtons = document.querySelectorAll('.song-result .like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.dataset.songId);
            toggleLike(songId, btn);
        });
    });
}

// Play song
function playSong(song) {
    currentSong = song;
    currentTrack.textContent = song.title;
    currentArtist.textContent = song.artist;

    playPauseBtn.disabled = false;
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    playPauseBtn.classList.add('playing');

    currentProgress = 0;
    progressFill.style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('totalTime').textContent = song.duration || '3:00';

    if (!recentlyPlayed.find(s => s.id === song.id)) {
        recentlyPlayed.unshift(song);
        if (recentlyPlayed.length > 10) {
            recentlyPlayed.pop();
        }
        renderRecentlyPlayed();
    }

    console.log('Playing song:', song.title, 'URL:', song.url);
}

// Like/Unlike song
function toggleLike(songId, btn) {
    const index = likedSongs.indexOf(songId);

    if (index > -1) {
        likedSongs.splice(index, 1);
        btn.textContent = '🤍';
        btn.classList.remove('liked');
    } else {
        likedSongs.push(songId);
        btn.textContent = '❤️';
        btn.classList.add('liked');
    }

    renderLikedSongs();
}

// Render recently played
function renderRecentlyPlayed() {
    recentlyPlayedList.innerHTML = recentlyPlayed.map(song => `
        <div class="recent-item" data-song-id="${song.id}">
            <div class="recent-thumb"></div>
            <div class="recent-info">
                <div class="recent-title">${song.title}</div>
                <div class="recent-meta">${song.artist}${song.album ? ' • ' + song.album : ''}</div>
            </div>
            <div class="recent-duration">${song.duration || '3:00'}</div>
            <button class="play-item-btn">
                <div class="play-item-icon"></div>
            </button>
        </div>
    `).join('');

    const playButtons = document.querySelectorAll('.recent-item .play-item-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.closest('.recent-item').dataset.songId);
            const song = recentlyPlayed.find(s => s.id === songId);
            if (song) playSong(song);
        });
    });
}

// Render liked songs
function renderLikedSongs() {
    const liked = songsDatabase.filter(song => likedSongs.includes(song.id));

    if (liked.length === 0) {
        likedContent.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">❤️</span>
                <h3>No liked songs yet</h3>
                <p>Songs you like will appear here</p>
            </div>
        `;
        return;
    }

    likedContent.innerHTML = liked.map(song => `
        <div class="recent-item" data-song-id="${song.id}">
            <div class="recent-thumb"></div>
            <div class="recent-info">
                <div class="recent-title">${song.title}</div>
                <div class="recent-meta">${song.artist} • ${song.album}</div>
            </div>
            <div class="recent-duration">${song.duration}</div>
            <button class="like-btn liked" data-song-id="${song.id}">❤️</button>
            <button class="play-item-btn">
                <div class="play-item-icon"></div>
            </button>
        </div>
    `).join('');

    const playButtons = likedContent.querySelectorAll('.play-item-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.closest('.recent-item').dataset.songId);
            const song = songsDatabase.find(s => s.id === songId);
            if (song) playSong(song);
        });
    });

    const likeButtons = likedContent.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.dataset.songId);
            toggleLike(songId, btn);
        });
    });
}

// Render popular music
function renderPopularMusic() {
    const popular = popularSongs.map(id => songsDatabase.find(s => s.id === id));

    popularMusic.innerHTML = popular.map(song => `
        <div class="music-card" data-song-id="${song.id}">
            <div class="album-art">
                <div class="play-btn">
                    <div class="play-btn-icon"></div>
                </div>
            </div>
            <div class="music-title">${song.title}</div>
            <div class="music-artist">${song.artist}</div>
        </div>
    `).join('');

    attachMusicCardListeners(popularMusic);
}

// Render recommended music
function renderRecommendedMusic() {
    const recommended = recommendedSongs.map(id => songsDatabase.find(s => s.id === id));

    recommendedMusic.innerHTML = recommended.map(song => `
        <div class="music-card" data-song-id="${song.id}">
            <div class="album-art">
                <div class="play-btn">
                    <div class="play-btn-icon"></div>
                </div>
            </div>
            <div class="music-title">${song.title}</div>
            <div class="music-artist">${song.artist}</div>
        </div>
    `).join('');

    attachMusicCardListeners(recommendedMusic);
}

// Attach listeners to music cards
function attachMusicCardListeners(container) {
    const playButtons = container.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(btn.closest('.music-card').dataset.songId);
            const song = songsDatabase.find(s => s.id === songId);
            if (song) playSong(song);
        });
    });
}

// Search event listeners
mainSearch.addEventListener('input', (e) => {
    performSearch(e.target.value.trim());
});

quickSearch.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query) {
        menuItems.forEach(i => i.classList.remove('active'));
        document.querySelector('[data-section="search"]').classList.add('active');
        contentSections.forEach(s => s.classList.remove('active'));
        document.getElementById('searchSection').classList.add('active');
        mainSearch.value = query;
        performSearch(query);
    }
});

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    if (!currentSong) return;

    isPlaying = !isPlaying;

    if (isPlaying) {
        playPauseBtn.textContent = '⏸';
        playPauseBtn.classList.add('playing');
    } else {
        playPauseBtn.textContent = '▶';
        playPauseBtn.classList.remove('playing');
    }
});

// Progress bar functionality
progressBar.addEventListener('click', (e) => {
    if (!currentSong) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;

    currentProgress = Math.max(0, Math.min(100, percentage));
    progressFill.style.width = currentProgress + '%';

    updateTimeDisplay();
});

function updateTimeDisplay() {
    if (!currentSong || !currentSong.duration) return;

    const durationParts = currentSong.duration.split(':');
    if (durationParts.length !== 2) return;

    const minutes = parseInt(durationParts[0]);
    const seconds = parseInt(durationParts[1]);

    if (isNaN(minutes) || isNaN(seconds)) return;

    const totalSeconds = minutes * 60 + seconds;
    const currentSeconds = Math.floor((totalSeconds * currentProgress) / 100);
    const min = Math.floor(currentSeconds / 60);
    const sec = currentSeconds % 60;

    document.getElementById('currentTime').textContent = `${min}:${sec.toString().padStart(2, '0')}`;
}

// Volume control
volumeSlider.addEventListener('click', (e) => {
    const rect = volumeSlider.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;

    currentVolume = Math.max(0, Math.min(100, percentage));
    volumeFill.style.width = currentVolume + '%';

    updateVolumeIcon();
});

volumeIcon.addEventListener('click', () => {
    if (currentVolume > 0) {
        currentVolume = 0;
        volumeIcon.textContent = '🔇';
    } else {
        currentVolume = 70;
        volumeIcon.textContent = '🔊';
    }
    volumeFill.style.width = currentVolume + '%';
});

function updateVolumeIcon() {
    if (currentVolume === 0) {
        volumeIcon.textContent = '🔇';
    } else if (currentVolume < 30) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

// Player control buttons
document.getElementById('prevBtn').addEventListener('click', () => {
    if (!currentSong) return;
    const currentIndex = recentlyPlayed.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
        playSong(recentlyPlayed[currentIndex - 1]);
    }
});

document.getElementById('backwardBtn').addEventListener('click', () => {
    if (!currentSong) return;
    currentProgress = Math.max(0, currentProgress - 10);
    progressFill.style.width = currentProgress + '%';
    updateTimeDisplay();
});

document.getElementById('forwardBtn').addEventListener('click', () => {
    if (!currentSong) return;
    currentProgress = Math.min(100, currentProgress + 10);
    progressFill.style.width = currentProgress + '%';
    updateTimeDisplay();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (!currentSong) return;
    const currentIndex = recentlyPlayed.findIndex(s => s.id === currentSong.id);
    if (currentIndex < recentlyPlayed.length - 1) {
        playSong(recentlyPlayed[currentIndex + 1]);
    }
});

// Initialize
setGreeting();
renderRecentlyPlayed();
renderLikedSongs();
renderPopularMusic();
renderRecommendedMusic();
performSearch('');

// Simulate progress when playing
setInterval(() => {
    if (isPlaying && currentSong && currentProgress < 100) {
        currentProgress += 0.1;
        progressFill.style.width = currentProgress + '%';
        updateTimeDisplay();

        if (currentProgress >= 100) {
            isPlaying = false;
            playPauseBtn.textContent = '▶';
            playPauseBtn.classList.remove('playing');
            currentProgress = 0;
        }
    }
}, 100);