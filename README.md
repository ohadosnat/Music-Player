# Music Player
## **Using Vanilla JS, Tailwind CSS & HTML**
You can view this project [here](). <br>

## **The Idea**
Once again, As I continue my learning journey, I love doing all sorts of projects to practice what I've learned.
<br>
This time, I want to add functionality to one of my [Tailwind Collection](https://github.com/ohadosnat/tailwind-collection) designs, the **Car Music Interface**.
<br><br>
I wanted to make a simple music player that got the following features:
1. Switch songs (Next/Previous)
2. Allow the user to use the functionalities such as "Repeat" and "Shuffle".
3. Track current/total time in the song.
4. Dynamic Progress Bar that allows the user to skip certain parts
5. Change the theme's colour based on the song's album artwork (got the idea from Spotify's android notification song colour)
6. Real-Time Clock & Weather
<br>

With that in mind, I started to code (skipped the design since I used the same code from the Tailwind project).

## **The Development Process**
### **Rough Version (Testing)**
When I have an idea, I start with a **rough version**, with no styling and basic buttons, to see that everything works.<br>
![Rough Version of the project to make sure everything works](https://link) <br>
Some of the challenges I had to tackle in this stage were:
1. How to not have duplicates on the "Shuffle" mode:
    - At first, I thought `Math.random()` would do the job, but I quickly realised that it's not a good solution. As I continued to search for solutions, I came across **"Fisher-Yates Shuffle Modern Algorithm"**, which solved my problem right away!<br>
    **How I implemented it:**

        ```javascript
            // Fisher-Yates Shuffle Modern Algorithm
            for (let i = shuffledTracks.length; i > 1; i--) {
                let random = Math.floor(Math.random() * i);
                let temp = shuffledTracks[random];
                shuffledTracks[random] = shuffledTracks[i - 1];
                shuffledTracks[i - 1] = temp;
            };
        ```
2. How to make sure the song tracker is working on shuffle mode:
    - When a user switches off the shuffle mode. I find the index of the current song in the original array and set the tracker to that index.<br>
    **How I implemented it(Inside the function):**

        ```javascript
        tracker = tracks.findIndex(track => track.title === songTitle);
        ```
3. Tracking the Shuffle/Repeat mode status (if it's on/off):
    - In the rough version, I used a checkbox. But in the final version, I checked to see if the `active` class is on.<br>
    **How I implemented it(only the condition):**

        ```javascript
        if(!shuffleBtn.classList.contains('active')) {...}
        ```
4. How to load files that have spaces in their name:
    - I saw a few different solutions, but I ended up using encodeURI().<br>
    **How I implemented it(Inside the function):**

        ```javascript
        // BEFORE: assets/audio/things cant stay the same.mp3
        audioElement.src = encodeURI(file_path);
        // AFTER : assets/audio/things%20cant%20stay%20the%20same.mp3
        ```
        *To avoid uploading copyright music to GitHub, the files aren't in this project. I'm using an external source.*

<br>

### **Working with the final design**
After finishing all the functionalities that I wanted to achieve in the **rough version**, I moved on to implementing them in the final design, which was easy to do.<br>

**The Process:**
1. Re-organizing some elements inside the `HTML` file; and adding `ids` to them.
2. Making sure all the DOM manipulations and Repeat/Shuffle work:
    - Song title, artist, current time in song & song's duration.
    - Next/Previous & Repeat/Shuffle buttons
3. Change the theme's colour based on the song's album artwork:
    - The solution I found didn't work as I wanted. So I had to change it a bit. <br>
    **The Idea:** Creating a new `canvas` element with the image, size it down to `1x1` and grabbing the image data. After that, I'm also converting the colour data from `RGB` to `HSL` to control the saturation/lightness later on (using a function).
    - When I had the `HSL` data, I used it on the buttons and based on the lightness, I changed the color lightness so it would look good.
    - Also worth mentioning - The play/pause icon is the darker version of the main color.<br>
    **How I implemented it:**

        ```javascript
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
        ```
        Before the rest of the function runs, I added a `Promise` to verify if the image's data have fully loaded.
<br><br>
4. Working on the Clock - a recursive that is being updated every minute (based on how much time remains).
5. Progress Bar
    - Update the progress bar every second to the current time in the song.
    - Resetting the progress bar when switching songs.
    - When a user clicks on the progress bar, switch to that time in the song.
<br><br>
----

## **Future Ideas**
- Tracklist - switch songs, view their status (if being played or not) and their order.
- Adding weather degrees (top left).
- Adding Google Maps/Maps API when clicking on the Navigation icon (bottom left):
    - Get the user's current location
    - Switch between music and maps and keep the music on (with a small interface that shows the music).
- Volume functionality.
<br><br>

## **Conclustion**
This project started as a simple test but ended up as more, and I love it!<br>
I learned new concepts, learned how to debug better and how to tackle new challenges. And of course, how to be a better developer.
<br><br>
***As always, If you got any suggestions/feedback/tips about my code. Feel free to reach out and help me learn!*** 😄 <br>
That's all for today! See you next time!