
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.setAttribute('data-theme', 'light');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'light') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    const DISCORD_USER_ID = '1360653904051966124';

    const statusText = document.getElementById('listening-text');
    const spotifyIcon = document.querySelector('.spotify-icon');
    const statusDot = document.querySelector('.status-indicator');

    // Game Status Elements
    const gameStatusDiv = document.querySelector('.game-status');
    const gameText = document.getElementById('game-text');

    // Loading Screen Logic
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loading-screen');
        // Optional: Small delay to ensure animations feel smooth
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    });

    async function fetchLanyard() {
        if (DISCORD_USER_ID === 'USER_ID_HERE' || DISCORD_USER_ID.length < 15) {
            statusText.innerText = 'Set ID in script.js';
            return;
        }

        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            if (data.success) {
                const { spotify, discord_status, discord_user, activities } = data.data;

                if (discord_user) {
                    const avatarImg = document.querySelector('.avatar');
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=512`;
                    avatarImg.src = avatarUrl;
                }

                updateStatusDot(discord_status);

                const listeningDiv = document.querySelector('.listening-status');

                // Logic: Spotify > Game > Default
                let gameActivity = activities.find(act => act.type === 0);

                if (spotify) {
                    // Show Spotify
                    listeningDiv.style.display = 'flex';
                    gameStatusDiv.style.display = 'none';
                    spotifyIcon.style.display = 'inline-block';
                    statusText.innerHTML = `Listening to <strong>${spotify.song}</strong> by <strong>${spotify.artist.split(';')[0]}</strong>`;
                } else if (gameActivity) {
                    // Show Game
                    listeningDiv.style.display = 'none';
                    gameStatusDiv.style.display = 'flex';
                    gameText.innerHTML = `Playing <strong>${gameActivity.name}</strong>`;
                } else {
                    // Default
                    listeningDiv.style.display = 'flex';
                    gameStatusDiv.style.display = 'none';
                    spotifyIcon.style.display = 'none';
                    statusText.innerHTML = `Not listening to anything right now`;
                }

            } else {
                statusText.innerText = 'User not found';
            }
        } catch (error) {
            console.error('Lanyard API Error:', error);
            statusText.innerText = 'Offline/Error';
        }
    }

    function updateStatusDot(status) {
        statusDot.className = 'status-indicator';

        switch (status) {
            case 'online':
                statusDot.classList.add('status-online');
                statusDot.innerHTML = '';
                break;
            case 'idle':
                statusDot.classList.add('status-idle');
                statusDot.innerHTML = '<i class="fas fa-moon" style="font-size:10px; color: #000;"></i>';
                break;
            case 'dnd':
                statusDot.classList.add('status-dnd');
                statusDot.innerHTML = '';
                break;
            default:
                statusDot.classList.add('status-offline');
                statusDot.innerHTML = '';
        }
    }

    fetchLanyard();
    setInterval(fetchLanyard, 30000);

});