// ============================================================
// SMILY - FULL GAME SCRIPT
// ============================================================


// ============================================================
// ELEMENTS
// ============================================================

const tv = document.getElementById("tv");

const smily = document.getElementById("smily");
const staticImage = document.getElementById("static");

const dialogue = document.getElementById("dialogue");

const choices = document.getElementById("choices");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");


// ============================================================
// AUDIO
// ============================================================

const staticSound = new Audio("StaticSound.mp3");
const startSound = new Audio("StartSound.mp3");

const smilyTheme = new Audio("Smily theme.mp3");
const smilyTheme2 = new Audio("Smily theme 2.mp3");

const laughSound = new Audio("Laugh.mp3");
const endSound = new Audio("EndSound.mp3");


// Volume

staticSound.volume = 0.25;
startSound.volume = 0.35;

smilyTheme.volume = 0.15;
smilyTheme2.volume = 0.15;

laughSound.volume = 0.30;
endSound.volume = 0.35;


// Loop music

smilyTheme.loop = true;
smilyTheme2.loop = true;


// ============================================================
// VISIT SYSTEM
// ============================================================

const isReturningVisitor =
    localStorage.getItem("smilyVisited") === "true";


// ============================================================
// SECRET RESET
// SHIFT + R
// ============================================================

document.addEventListener("keydown", (event) => {

    if (
        event.shiftKey &&
        event.key.toLowerCase() === "r"
    ) {

        localStorage.removeItem(
            "smilyVisited"
        );

        sessionStorage.clear();

        location.reload();

    }

});


// ============================================================
// GAME STATE
// ============================================================

let smilyStarted = false;

let staticActive = false;

let ending = false;

let smilyShouldReturn = false;

let staticTimer = null;

let staticSwitcher = null;


// ============================================================
// INITIAL STATE
// ============================================================

smily.style.visibility =
    "hidden";

staticImage.style.visibility =
    "hidden";

staticImage.style.opacity =
    "0";

dialogue.style.visibility =
    "hidden";

choices.style.visibility =
    "hidden";


// ============================================================
// INTRO TEXT
// ============================================================

const introText =
    document.createElement("div");

introText.id =
    "introText";

introText.style.position =
    "fixed";

introText.style.left =
    "50%";

introText.style.top =
    "50%";

introText.style.transform =
    "translate(-50%, -50%)";

introText.style.color =
    "white";

introText.style.fontFamily =
    "monospace";

introText.style.fontSize =
    "clamp(25px, 4vw, 50px)";

introText.style.fontWeight =
    "bold";

introText.style.textAlign =
    "center";

introText.style.zIndex =
    "100";

introText.style.textShadow =
    "0 0 8px white";

document.body.appendChild(
    introText
);


// ============================================================
// WAIT
// ============================================================

function wait(seconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            seconds * 1000
        );

    });

}


// ============================================================
// WAIT FOR AUDIO
// ============================================================

function waitForAudio(audio) {

    return new Promise(resolve => {

        if (audio.ended) {

            resolve();

            return;

        }


        const finished = () => {

            resolve();

        };


        audio.addEventListener(
            "ended",
            finished,
            { once: true }
        );


        // Prevent the game getting stuck
        // if browser blocks audio

        if (
            audio.paused &&
            audio.currentTime === 0
        ) {

            setTimeout(() => {

                if (audio.paused) {

                    resolve();

                }

            }, 700);

        }

    });

}


// ============================================================
// SAY
// ============================================================

function say(text, seconds) {

    return new Promise(resolve => {

        if (ending) {

            resolve();

            return;

        }


        dialogue.textContent =
            text;

        dialogue.style.visibility =
            "visible";


        setTimeout(() => {

            resolve();

        }, seconds * 1000);

    });

}


// ============================================================
// CHOICES
// ============================================================

function showChoices(
    firstText,
    secondText
) {

    return new Promise(resolve => {

        choice1.textContent =
            firstText;

        choice2.textContent =
            secondText;


        choices.style.visibility =
            "visible";


        function firstChoice() {

            cleanup();

            resolve(1);

        }


        function secondChoice() {

            cleanup();

            resolve(2);

        }


        function cleanup() {

            choices.style.visibility =
                "hidden";


            choice1.removeEventListener(
                "click",
                firstChoice
            );


            choice2.removeEventListener(
                "click",
                secondChoice
            );

        }


        choice1.addEventListener(
            "click",
            firstChoice
        );


        choice2.addEventListener(
            "click",
            secondChoice
        );

    });

}


// ============================================================
// STATIC SYSTEM
// ============================================================

const staticImages = [
    "Static1.png",
    "Static2.png"
];


// ============================================================
// SCHEDULE STATIC
// ============================================================

function scheduleStatic() {

    if (
        !smilyStarted ||
        ending ||
        staticActive ||
        !smilyShouldReturn
    ) {

        return;

    }


    const nextStatic =
        Math.random() *
        (12000 - 3000) +
        3000;


    staticTimer =
        setTimeout(() => {

            startStatic();

        }, nextStatic);

}


// ============================================================
// START STATIC
// ============================================================

function startStatic() {

    if (
        !smilyStarted ||
        ending ||
        staticActive ||
        !smilyShouldReturn
    ) {

        return;

    }


    staticActive = true;


    // Remember that Smily should come back

    smilyShouldReturn = true;


    // ========================================================
    // HIDE SMILY
    // ========================================================

    smily.style.visibility =
        "hidden";


    // ========================================================
    // SHOW STATIC
    // ========================================================

    staticImage.style.visibility =
        "visible";

    staticImage.style.opacity =
        "1";


    // ========================================================
    // STATIC STARTS AT STATIC1
    // ========================================================

    let currentStatic = 0;

    staticImage.src =
        staticImages[
            currentStatic
        ];


    // ========================================================
    // PLAY STATIC SOUND
    // ========================================================

    staticSound.currentTime =
        0;

    staticSound.play().catch(() => {});


    // ========================================================
    // SWITCH STATIC EVERY 0.05 SECONDS
    // ========================================================

    staticSwitcher =
        setInterval(() => {

            currentStatic++;

            if (
                currentStatic >=
                staticImages.length
            ) {

                currentStatic = 0;

            }


            staticImage.src =
                staticImages[
                    currentStatic
                ];

        }, 50);


    // ========================================================
    // RANDOM DURATION
    // 0.2 - 0.75 SECONDS
    // ========================================================

    const duration =
        Math.random() *
        (750 - 200) +
        200;


    setTimeout(() => {

        // Stop animation

        if (staticSwitcher) {

            clearInterval(
                staticSwitcher
            );

            staticSwitcher =
                null;

        }


        // Hide static

        staticImage.style.opacity =
            "0";

        staticImage.style.visibility =
            "hidden";


        // Stop sound

        staticSound.pause();

        staticSound.currentTime =
            0;


        // ====================================================
        // BRING SMILY BACK
        // ====================================================

        if (
            smilyStarted &&
            !ending &&
            smilyShouldReturn
        ) {

            smily.style.visibility =
                "visible";

        }


        staticActive =
            false;


        // ====================================================
        // SCHEDULE NEXT STATIC
        // ====================================================

        scheduleStatic();


    }, duration);

}


// ============================================================
// STOP STATIC
// ============================================================

function stopStatic() {

    if (staticTimer) {

        clearTimeout(
            staticTimer
        );

        staticTimer =
            null;

    }


    if (staticSwitcher) {

        clearInterval(
            staticSwitcher
        );

        staticSwitcher =
            null;

    }


    staticActive =
        false;


    staticImage.style.opacity =
        "0";

    staticImage.style.visibility =
        "hidden";


    staticSound.pause();

    staticSound.currentTime =
        0;

}


// ============================================================
// START STATIC SYSTEM
// ============================================================

function startStaticSystem() {

    stopStatic();


    // Smily is allowed to return

    smilyShouldReturn =
        true;


    scheduleStatic();

}


// ============================================================
// INTRO
// ============================================================

async function startIntro() {


    // ========================================================
    // FIRST VISIT
    // ========================================================

    if (!isReturningVisitor) {

        await wait(3);


        introText.textContent =
            "...";


        await wait(2);


        introText.textContent =
            "Here goes nothing";

    }


    // ========================================================
    // RETURNING VISITOR
    // ========================================================

    else {

        await wait(3);


        introText.textContent =
            "here goes nothing...";

    }


    // ========================================================
    // START SOUND
    // ========================================================

    await wait(1);


    introText.textContent =
        "";


    startSound.currentTime =
        0;


    startSound.play().catch(() => {});


    await waitForAudio(
        startSound
    );


    // ========================================================
    // SMILY APPEARS
    // ========================================================

    introText.remove();


    smily.style.visibility =
        "visible";


    smilyStarted =
        true;


    // ========================================================
    // SAVE VISIT
    // ========================================================

    localStorage.setItem(
        "smilyVisited",
        "true"
    );


    // ========================================================
    // START STATIC SYSTEM
    // ========================================================

    startStaticSystem();


    // ========================================================
    // RETURNING VISITOR DIALOGUE
    // ========================================================

    if (isReturningVisitor) {

        await wait(2);


        await say(
            "Hmmm...",
            3
        );


        await say(
            "Hello human",
            3
        );


        await say(
            "You arleady know my name",
            3
        );

    }


    // ========================================================
    // FIRST VISIT DIALOGUE
    // ========================================================

    else {

        await wait(4);


        await say(
            "Hello",
            3
        );


        await say(
            "I am",
            3
        );


        await say(
            "Smily",
            3
        );

    }


    // ========================================================
    // MAIN DIALOGUE
    // ========================================================

    await beginMainDialogue();

}


// ============================================================
// MAIN DIALOGUE
// ============================================================

async function beginMainDialogue() {


    // ========================================================
    // THEME STARTS
    // ========================================================

    smilyTheme.currentTime =
        0;

    smilyTheme.play().catch(() => {});


    await say(
        "You know what is happening here don't you?",
        3
    );


    // ========================================================
    // FIRST CHOICE
    // ========================================================

    const firstChoice =
        await showChoices(
            "Yes",
            "No"
        );


    if (firstChoice === 2) {

        await noPath();

    }

    else {

        await yesPath();

    }

}


// ============================================================
// NO PATH
// ============================================================

async function noPath() {


    await say(
        "I will get the OLTIMATE-O",
        3
    );


    await say(
        "and i will use it to break out of this world",
        3.5
    );


    await say(
        "So i can finaly destroy everyone",
        3
    );


    await say(
        "you think you can stop me, human?",
        2
    );


    const secondChoice =
        await showChoices(
            "Yes",
            "No"
        );


    if (secondChoice === 1) {

        await say(
            "Your choice do not matter",
            2
        );

    }

    else {

        await say(
            "Exactly",
            2
        );

    }


    await laughingEnding();

}


// ============================================================
// YES PATH
// ============================================================

async function yesPath() {


    // ========================================================
    // STOP NORMAL STATIC TEMPORARILY
    // ========================================================

    stopStatic();

    smilyShouldReturn =
        true;


    // ========================================================
    // CHANGE MUSIC
    // ========================================================

    smilyTheme.pause();

    smilyTheme.currentTime =
        0;


    smilyTheme2.currentTime =
        0;

    smilyTheme2.play().catch(() => {});


    await say(
        "Pathetic",
        2
    );


    await say(
        "You just came here to beg for life",
        3
    );


    await showChoices(
        "Yes",
        "Yes"
    );


    await say(
        "I know.",
        2
    );


    // ========================================================
    // STOP SECOND THEME
    // ========================================================

    smilyTheme2.pause();

    smilyTheme2.currentTime =
        0;


    // ========================================================
    // SMILY SMILE
    // ========================================================

    stopStatic();

    smilyShouldReturn =
        false;


    smily.src =
        "SmilySmile.png";


    await wait(4);


    await say(
        "Cya later",
        2
    );


    await wait(2);


    await laughingEnding();

}


// ============================================================
// LAUGHING ENDING
// ============================================================

async function laughingEnding() {


    if (ending) {

        return;

    }


    ending =
        true;


    // ========================================================
    // COMPLETELY STOP STATIC
    // ========================================================

    stopStatic();


    smilyShouldReturn =
        false;


    // ========================================================
    // HIDE NORMAL STUFF
    // ========================================================

    dialogue.style.visibility =
        "hidden";


    choices.style.visibility =
        "hidden";


    smily.style.visibility =
        "hidden";


    // ========================================================
    // RED MODE
    // ========================================================

    tv.classList.add(
        "redMode"
    );


    // ========================================================
    // LAUGHING SMILY
    // ========================================================

    const laughing =
        document.createElement("img");


    laughing.src =
        "LaughingSmily.png";


    laughing.style.position =
        "absolute";


    laughing.style.width =
        "min(75vw, 700px)";


    laughing.style.maxHeight =
        "75vh";


    laughing.style.objectFit =
        "contain";


    laughing.style.zIndex =
        "12";


    laughing.style.pointerEvents =
        "none";


    tv.appendChild(
        laughing
    );


    // ========================================================
    // LAUGHING SMILY 2
    // ========================================================

    const laughing2 =
        document.createElement("img");


    laughing2.src =
        "LaughingSmily2.png";


    laughing2.style.position =
        "absolute";


    laughing2.style.width =
        "min(75vw, 700px)";


    laughing2.style.maxHeight =
        "75vh";


    laughing2.style.objectFit =
        "contain";


    laughing2.style.zIndex =
        "12";


    laughing2.style.pointerEvents =
        "none";


    laughing2.style.visibility =
        "hidden";


    tv.appendChild(
        laughing2
    );


    // ========================================================
    // NO SMILY MUSIC HERE
    // ========================================================

    smilyTheme.pause();

    smilyTheme2.pause();

    smilyTheme.currentTime =
        0;

    smilyTheme2.currentTime =
        0;


    // ========================================================
    // LAUGH SOUND
    // ========================================================

    laughSound.currentTime =
        0;


    laughSound.play().catch(() => {});


    // ========================================================
    // FRAME ANIMATION
    // ========================================================

    let frame =
        0;


    const laughAnimation =
        setInterval(() => {


            frame++;


            if (
                frame % 2 === 0
            ) {

                laughing.style.visibility =
                    "visible";


                laughing2.style.visibility =
                    "hidden";

            }

            else {

                laughing.style.visibility =
                    "hidden";


                laughing2.style.visibility =
                    "visible";

            }


        }, 250);


    // ========================================================
    // PROGRESSIVELY WORSE GLITCH
    // ========================================================

    let horrorLevel =
        0;


    const horrorAnimation =
        setInterval(() => {


            horrorLevel +=
                0.025;


            if (
                horrorLevel > 1
            ) {

                horrorLevel =
                    1;

            }


            // ------------------------------------------------
            // SCREEN SHAKE
            // ------------------------------------------------

            const shake =
                horrorLevel * 15;


            tv.style.transform =
                `translate(
                    ${(Math.random() - 0.5) * shake}px,
                    ${(Math.random() - 0.5) * shake}px
                )`;


            // ------------------------------------------------
            // DISTORTION
            // ------------------------------------------------

            const skew =
                (Math.random() - 0.5)
                *
                horrorLevel
                *
                25;


            const rotation =
                (Math.random() - 0.5)
                *
                horrorLevel
                *
                10;


            const scale =
                1 +
                (Math.random() - 0.5)
                *
                horrorLevel
                *
                0.35;


            laughing.style.transform =
                `skew(${skew}deg)
                 rotate(${rotation}deg)
                 scale(${scale})`;


            laughing2.style.transform =
                `skew(${-skew}deg)
                 rotate(${-rotation}deg)
                 scale(${scale})`;


            // ------------------------------------------------
            // FILTER
            // ------------------------------------------------

            const contrast =
                1 +
                horrorLevel * 2.5;


            const brightness =
                0.8 +
                Math.random()
                *
                horrorLevel
                *
                1.8;


            laughing.style.filter =
                `contrast(${contrast})
                 brightness(${brightness})
                 saturate(${1 + horrorLevel * 4})`;


            laughing2.style.filter =
                `contrast(${contrast})
                 brightness(${brightness})
                 saturate(${1 + horrorLevel * 4})`;


            // ------------------------------------------------
            // RED BACKGROUND
            // ------------------------------------------------

            const red =
                Math.floor(
                    50 +
                    horrorLevel * 120
                );


            tv.style.background =
                `rgb(${red}, 0, 0)`;


        }, 120);


    // ========================================================
    // DARK AFTER 10 SECONDS
    // ========================================================

    const darkTimer =
        setTimeout(() => {


            clearInterval(
                laughAnimation
            );


            clearInterval(
                horrorAnimation
            );


            laughing.remove();

            laughing2.remove();


            tv.classList.remove(
                "redMode"
            );


            tv.style.transform =
                "none";


            tv.style.background =
                "#000";


            staticImage.style.visibility =
                "hidden";


            smily.style.visibility =
                "hidden";


            dialogue.style.visibility =
                "hidden";


            choices.style.visibility =
                "hidden";


        }, 10000);


    // ========================================================
    // WAIT FOR LAUGH TO END
    // ========================================================

    laughSound.addEventListener(
        "ended",
        async () => {


            clearTimeout(
                darkTimer
            );


            clearInterval(
                laughAnimation
            );


            clearInterval(
                horrorAnimation
            );


            laughing.remove();

            laughing2.remove();


            tv.classList.remove(
                "redMode"
            );


            tv.style.transform =
                "none";


            tv.style.background =
                "#000";


            // =================================================
            // 3 SECONDS
            // =================================================

            await wait(3);


            // =================================================
            // END SOUND
            // =================================================

            endSound.currentTime =
                0;


            endSound.play().catch(() => {});


            await waitForAudio(
                endSound
            );


            websiteEnding();


        },
        {
            once: true
        }
    );

}


// ============================================================
// RANDOM SMILY MOVEMENT
// ============================================================

setInterval(() => {


    if (
        !smilyStarted ||
        staticActive ||
        ending ||
        !smilyShouldReturn
    ) {

        return;

    }


    if (
        Math.random() <
        0.35
    ) {


        smily.style.transform =
            `translate(
                ${Math.random() * 8 - 4}px,
                ${Math.random() * 8 - 4}px
            )`;


        setTimeout(() => {


            if (
                !staticActive &&
                !ending &&
                smilyShouldReturn
            ) {

                smily.style.transform =
                    "";

            }


        }, 80);

    }


}, 1000);


// ============================================================
// END WEBSITE
// ============================================================

function websiteEnding() {


    smilyTheme.pause();

    smilyTheme2.pause();

    laughSound.pause();

    staticSound.pause();


    // Try closing the tab

    window.close();


    // Most browsers block window.close()
    // for normal tabs, so make it completely black.

    setTimeout(() => {


        document.body.innerHTML =
            "";


        document.body.style.background =
            "#000";


        document.body.style.margin =
            "0";


        document.body.style.width =
            "100vw";


        document.body.style.height =
            "100vh";


        document.body.style.overflow =
            "hidden";


    }, 250);

}


// ============================================================
// START
// ============================================================

startIntro();