/* 
dropbox music link template
https://dl.dropboxusercontent.com/s/{link-path-here}
*/

// Player Queries
const playControl = document.querySelector('#playControl');
const durationTime = document.querySelector('#durationTime');
const currentTime = document.querySelector('#currentTime');

const nextSong = document.querySelector('#nextSong');
const prevSong = document.querySelector('#previousSong');
const shuffleBtn = document.querySelector('#shuffleSongs');
const repeatSongs = document.querySelector('#repeatSongs');

const progressBarContainer = document.querySelector('#progressBarContainer');
const progressBar = document.querySelector('#progressBar');
const progressBarCircle = document.querySelector('#progressBarCircle');

// Clock
const localTime = document.querySelector('#localTime');

// General
const container = document.querySelector('#container');
const musicIcon = document.querySelector('#musicIcon');

// Songs
const tracks = [
    { title: "Things Can't Stay The Same", artist: 'BROCKHAMPTON', album: 'Technical Difficulties', file_path: 'https://dl.dropboxusercontent.com/s/ihbwbojnn79qh62/things%20cant%20stay%20the%20same.mp3?dl=0', img: 'assets/img/things-cant-stay-the-same.png' },
    { title: 'N.S.T', artist: 'BROCKHAMPTON', album: 'Technical Difficulties', file_path: 'https://dl.dropboxusercontent.com/s/2al2814ut5yo55p/N.S.T.mp3?dl=0', img: 'assets/img/nst.png' },
    { title: 'Shiraz', artist: 'Action Bronson', album: 'Dr.Lecter', file_path: 'https://dl.dropboxusercontent.com/s/w7byivx26ldrke8/08%20-%20Shiraz.mp3?dl=0', img: 'assets/img/dr-lecter-action-bronson.jpg' },
    { title: 'Shadows', artist: 'Childish Gambino', album: 'Because the Internet', file_path: 'https://dl.dropboxusercontent.com/s/ecifs4hmord0ojr/06%20II.%20Shadows.m4a?dl=0', img: 'assets/img/bti-childish_gambino.jpg' },
    { title: 'U-N-I-T-Y', artist: 'Frank Ocean', album: 'Endless', file_path: 'https://dl.dropboxusercontent.com/s/xsg9k9pgty6qax0/Frank%20Ocean-%20U-N-I-T-Y.mp3?dl=0', img: 'assets/img/frank-ocean_endless.jpg' },
];

let shuffledTracks = tracks.map(track => track), // copy of the original array to shuffle.
    tracker = 0, // keeps tracks of which song is being displayed.
    currentTrackTime,
    audioElement = new Audio(),
    trackImg = new Image(),
    primaryColor,
    secondaryColor;

// gets current time for clock
const getTime = () => {
    let date = new Date(),
        hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
        mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
        timeLeft = 60000 - (date.getTime() % 60000);
    localTime.innerText = `${hours}:${mins}`;

    setTimeout(() => getTime(), timeLeft);
};

const updateInfo = song => {
    const { title, artist, album, img, file_path } = song;
    trackImg.src = img;
    getPixel(trackImg)
        .then((hsl) => setThemeColor(hsl))
        .catch(err => console.error(err));
    progressBar.style.width = '0%'
    progressBarCircle.style.left = '0%';

    container.style.backgroundImage = `url(${img})`;
    const html = `
        <h1 class="text-4xl font-medium tracking-wide mb-2">${title}</h1>
        <h4 class="text-2xl tracking-wide mb-4">${artist}</h4>
        `;
    songInfo.innerHTML = html;
    audioElement.src = encodeURI(file_path);
    audioElement.onloadedmetadata = () => {
        let totalMin = Math.floor((audioElement.duration / 60) % 60),
            totalSecs = Math.floor(audioElement.duration % 60) < 10 ? `0${Math.floor(audioElement.duration % 60)}` : Math.floor(audioElement.duration % 60);
        currentTime.innerText = '0:00';
        durationTime.innerText = `${totalMin}:${totalSecs}`;
    };
};

const updateCurrentTime = () => {
    let currentMin = Math.floor((audioElement.currentTime / 60) % 60),
        currentSec = Math.floor(audioElement.currentTime % 60) < 10 ? `0${Math.floor(audioElement.currentTime % 60)}` : Math.floor(audioElement.currentTime % 60);
    currentTime.innerText = `${currentMin}:${currentSec}`;
};

const playAudio = () => {
    if (!playControl.classList.contains('active')) {
        playControl.classList.add('active');
        audioElement.play();
        playControl.innerHTML = `
        <svg class="fill-current w-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27 6V26C26.9994 26.5302 26.7885 27.0386 26.4135 27.4135C26.0386 27.7885 25.5302 27.9994 25 28H20.5C19.9698 27.9994 19.4614 27.7885 19.0865 27.4135C18.7115 27.0386 18.5006 26.5302 18.5 26V6C18.5006 5.46975 18.7115 4.9614 19.0865 4.58646C19.4614 4.21151 19.9698 4.00061 20.5 4H25C25.5302 4.00061 26.0386 4.21151 26.4135 4.58646C26.7885 4.9614 26.9994 5.46975 27 6V6ZM11.5 4H7C6.46975 4.00061 5.9614 4.21151 5.58646 4.58646C5.21151 4.9614 5.00061 5.46975 5 6V26C5.00061 26.5302 5.21151 27.0386 5.58646 27.4135C5.9614 27.7885 6.46975 27.9994 7 28H11.5C12.0302 27.9994 12.5386 27.7885 12.9135 27.4135C13.2885 27.0386 13.4994 26.5302 13.5 26V6C13.4994 5.46975 13.2885 4.9614 12.9135 4.58646C12.5386 4.21151 12.0302 4.00061 11.5 4V4Z" />
        </svg>
        `;
        currentTrackTime = setInterval(() => {
            updateCurrentTime()
            // Progress Bar
            updateProgressBar(audioElement.currentTime, audioElement.duration);
            if (audioElement.ended && tracker === tracks.length - 1 && !repeatSongs.classList.contains('active')) {
                playControl.classList.remove('active');
                audioElement.pause();
                playControl.innerHTML = `
                <svg class="fill-current w-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M29.0391 14.293L11.043 3.29491C10.7398 3.10955 10.3928 3.0083 10.0376 3.00158C9.68232 2.99486 9.3317 3.0829 9.02178 3.25666C8.71186 3.43042 8.45383 3.68361 8.27425 3.99019C8.09466 4.29677 8 4.64566 8 5.00097V26.999C8.00029 27.3542 8.09513 27.7029 8.27479 28.0093C8.45445 28.3157 8.71244 28.5688 9.02226 28.7425C9.33208 28.9162 9.68255 29.0043 10.0377 28.9977C10.3928 28.9911 10.7398 28.8901 11.043 28.7051L29.0391 17.707C29.3314 17.5283 29.5729 17.2774 29.7405 16.9785C29.9081 16.6796 29.9961 16.3427 29.9961 16C29.9961 15.6573 29.9081 15.3204 29.7405 15.0215C29.5729 14.7226 29.3314 14.4717 29.0391 14.293V14.293Z" />
                </svg>
                `;
                clearInterval(currentTrackTime);
            } else if (audioElement.ended) {
                clearInterval(currentTrackTime);
                next();
                console.log('cleared!');
            }
        }, 1000);
    } else {
        playControl.classList.remove('active');
        audioElement.pause();
        playControl.innerHTML = `
        <svg class="fill-current w-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.0391 14.293L11.043 3.29491C10.7398 3.10955 10.3928 3.0083 10.0376 3.00158C9.68232 2.99486 9.3317 3.0829 9.02178 3.25666C8.71186 3.43042 8.45383 3.68361 8.27425 3.99019C8.09466 4.29677 8 4.64566 8 5.00097V26.999C8.00029 27.3542 8.09513 27.7029 8.27479 28.0093C8.45445 28.3157 8.71244 28.5688 9.02226 28.7425C9.33208 28.9162 9.68255 29.0043 10.0377 28.9977C10.3928 28.9911 10.7398 28.8901 11.043 28.7051L29.0391 17.707C29.3314 17.5283 29.5729 17.2774 29.7405 16.9785C29.9081 16.6796 29.9961 16.3427 29.9961 16C29.9961 15.6573 29.9081 15.3204 29.7405 15.0215C29.5729 14.7226 29.3314 14.4717 29.0391 14.293V14.293Z" />
        </svg>
        `;
        clearInterval(currentTrackTime);
    };
};


const getPixel = async (img) => {
    await new Promise((resolve) => {
        img.onload = () => resolve();
    })
    let canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    canvas.getContext('2d').drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
    let pixelData = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
    let hsl = RGBToHSL(pixelData[0], pixelData[1], pixelData[2]);
    return hsl;
};


function RGBToHSL(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        l = (cmax + cmin) / 2, // Calculate lightness
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)); // Calculate saturation

    // Calculate hue

    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l }
};

// Sets The Theme Color
const setThemeColor = (hsl) => {
    // Defines the primary & secondary color
    primaryColor = hsl.l < 60 ? `hsl(${hsl.h} ${hsl.s}% ${60}%)` : `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;
    secondaryColor = hsl.l > 70 ? `hsl(${hsl.h} ${hsl.s}% ${10}%)` : `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;

    // Elements by Order - Body -> Progress Bar -> Player Control -> Bottom Icons
    document.body.style.backgroundColor = primaryColor;

    progressBar.style.backgroundColor = primaryColor;
    progressBarCircle.style.backgroundColor = secondaryColor;

    playControl.style.backgroundColor = primaryColor;
    playControl.style.color = secondaryColor;
    shuffleBtn.style.color = shuffleBtn.classList.contains('active') ? primaryColor : 'white';
    repeatSongs.style.color = repeatSongs.classList.contains('active') ? primaryColor : 'white';

    musicIcon.style.color = primaryColor;
};


// Next, Previous, Shuffle, Repeat

const next = () => {
    if (shuffleBtn.classList.contains('active')) {
        if (tracker >= shuffledTracks.length - 1 && repeatSongs.classList.contains('active')) {
            tracker = 0;
            updateInfo(shuffledTracks[tracker]);
        } else if (tracker >= shuffledTracks.length - 1) {
            return;
        } else {
            tracker++;
            updateInfo(shuffledTracks[tracker]);
        };
    } else {
        if (tracker >= tracks.length - 1 && repeatSongs.classList.contains('active')) {
            tracker = 0;
            updateInfo(tracks[tracker]);
        } else if (tracker >= tracks.length - 1) {
            return;
        } else {
            tracker++;
            updateInfo(tracks[tracker]);
        }
    };
    clearInterval(currentTrackTime);
    playControl.classList.remove('active')
    playAudio();
};

const previous = () => {
    if (shuffleBtn.classList.contains('active')) {
        if (tracker <= 0 && repeatSongs.classList.contains('active')) {
            tracker = shuffledTracks.length - 1;
            updateInfo(shuffledTracks[tracker]);
        } else if (tracker <= 0) {
            return;
        } else {
            tracker--;
            updateInfo(shuffledTracks[tracker]);
        }
    } else {
        if (tracker <= 0 && repeatSongs.classList.contains('active')) {
            tracker = tracks.length - 1;
            updateInfo(tracks[tracker]);
        } else if (tracker <= 0) {
            return;

        } else {
            tracker--;
            updateInfo(tracks[tracker]);
        };
    };
    clearInterval(currentTrackTime);
    playControl.classList.remove('active')
    playAudio();
};

// Shuffle - Based on Fisher-Yates Shuffle Modern Algorithm
shuffleBtn.addEventListener('click', () => {
    if (!shuffleBtn.classList.contains('active')) {
        console.log('shuffled')
        shuffleBtn.classList.add('active')
        shuffleBtn.style.color = primaryColor;
        for (let i = shuffledTracks.length; i > 1; i--) {
            let random = Math.floor(Math.random() * i);
            let temp = shuffledTracks[random];
            shuffledTracks[random] = shuffledTracks[i - 1];
            shuffledTracks[i - 1] = temp;
        };
    } else {
        console.log('restored')
        shuffleBtn.classList.remove('active')
        shuffleBtn.style.color = 'white';
        let songTitle = songInfo.firstElementChild.textContent;
        tracker = tracks.findIndex(track => track.title === songTitle);
    };
});


repeatSongs.addEventListener('click', () => {
    if (!repeatSongs.classList.contains('active')) {
        console.log('repeat mode is active');
        repeatSongs.classList.add('active');
        repeatSongs.style.color = primaryColor;
    } else {
        console.log('repeat mode is disabled')
        repeatSongs.classList.remove('active');
        repeatSongs.style.color = 'white';
    };
});

const updateProgressBar = (current, duration) => {
    const progressPercent = (current / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressBarCircle.style.left = `${progressPercent}%`;
};

const setProgress = e => {
    const width = progressBarContainer.clientWidth,
        clickX = e.offsetX,
        duration = audioElement.duration;
    audioElement.currentTime = (clickX / width) * duration;
    updateProgressBar(audioElement.currentTime, duration);
    updateCurrentTime();
};

// Load first song & Event Listeners
getTime();
updateInfo(tracks[tracker]);
playControl.addEventListener('click', playAudio);
nextSong.addEventListener('click', next);
prevSong.addEventListener('click', previous);
progressBarContainer.addEventListener('click', setProgress);