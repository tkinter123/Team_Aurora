/* =========================================================
   MOON EXHIBITION — STORY SYSTEM
   Team_Aurora
========================================================= */


/* =========================================================
   STORY DATA
========================================================= */

const introStories = [

    /* =====================================================
       PAGE 01
    ====================================================== */

    {
        kicker: "",

        title: "Hi, Explorer!",

        text: `
            Do you know the average distances between the Moon and Earth,
            and Mars and Earth, are respectively <b>384,400 km</b> and
            <b>225 million km</b>?<br><br>

            But today, we are on our way to conquer them.
        `,

        footer: "",

        images: [

            {
                src: "./images/moon.png",
                title: "THE MOON",
                description: "",
                link: ""
            },

            {
                src: "./images/mars.png",
                title: "THE MARS",
                description: "",
                link: ""
            }

        ]
    },


    /* =====================================================
       PAGE 02
    ====================================================== */

    {
        kicker: "",

        title:
            "Have you ever thought about what turned the impossible into possible?",

        text: "",

        footer: "",

        images: [

            {
                src:
                    "./images/NASA_stepped_on_the_Moon.jpg",

                title:
                    "NASA's Step on the Moon",

                description: "",

                link:
                    "https://www.nasa.gov/history/flag-day-flying-high-the-stars-and-stripes-in-space/"
            }

        ]
    },


    /* =====================================================
       PAGE 03
    ====================================================== */

    {
        kicker: "",

        title: "",

        text: `
            About 68 years ago, in 1958, NASA began its journey towards
            the Moon with <b>Pioneer 1</b>, its first spacecraft, targeting
            lunar orbit.<br>

            And about 62 years ago, in 1964, NASA began its journey towards
            Mars with <b>Mariner 3</b>, its first Mars attempt.<br>

            Soon after, <b>Mariner 4</b> followed and successfully reached Mars.<br>

            Since then, mission after mission, NASA has continued sending
            spacecraft to explore these worlds.
        `,

        footer: "",

        images: [

            {
                src:
                    "./images/Pioneer_1.jpg",

                title:
                    "PIONEER 1",

                description: "",

                link:
                    "https://science.nasa.gov/mission/pioneer-1-able-2/"
            },

            {
                src:
                    "./Museum_of_the_Abandoned/story_images/Mariner_3.jpg",

                title:
                    "MARINER 3",

                description: "",

                link:
                    "https://science.nasa.gov/mission/mariner-3/"
            }

        ]
    },


    /* =====================================================
       PAGE 04
    ====================================================== */

    {
        kicker: "",

        title:
            "Every Mission Taught Us More",

        text: `
            They sent us vital information about these worlds, and based
            on that, we started our journey towards them.
        `,

        footer: "",

        images: [

            {
                src:
                    "./Museum_of_the_Abandoned/story_images/Progressing.png",

                title: "",

                description: "",

                link: ""
            }

        ]
    },


    /* =====================================================
       PAGE 05
    ====================================================== */

    {
        kicker:
            "YOUR JOURNEY BEGINS",

        title: "",

        text: `
            <b>
                But some machines have stopped responding, and some are about to.

                We can't let their contributions be forgotten.<br><br>

                We believe you are the one who can conquer space.
                Your journey begins here.
            </b>
        `,

        footer: "",

        images: [

            {
                src:
                    "./Museum_of_the_Abandoned/story_images/Inspiring.png",

                title: "",

                description: "",

                link: ""
            }

        ]
    }

];


/* =========================================================
   CONFIGURATION
========================================================= */


/*
   IMPORTANT:

   The main index.html is in the Team_Aurora ROOT.

   Therefore all exhibition images use:

   ./Museum_of_the_Abandoned/story_images/...
*/

const HOME_MAP_PAGE =
    "./Space/space.html";


/*
   Image rotation.
*/

const IMAGE_ROTATION_TIME =
    3500;


/*
   Story transition.
*/

const STORY_EXIT_TIME =
    250;

const STORY_ENTER_TIME =
    450;


/* =========================================================
   STATE
========================================================= */

let currentStory =
    0;

let currentImage =
    0;

let isAnimating =
    false;

let imageTimer =
    null;


/*
   General touch state.
*/

let touchStartX =
    0;

let touchStartY =
    0;

let touchStartedInImagePanel =
    false;


/*
   Image touch state.
*/

let imageTouchStartX =
    0;

let imageTouchStartY =
    0;


/* =========================================================
   DOM ELEMENTS
========================================================= */

let storyPanel;
let imagePanel;

let storyKicker;
let storyTitle;
let storyText;
let storyFooterText;
let storyProgress;

let imageTrack;
let imageCounter;
let imageTitle;
let imageDescription;
let imageDots;

let nextButton;
let nextButtonText;

let backButton;
let skipButton;

let progressBar;


/* =========================================================
   GET DOM ELEMENTS
========================================================= */

function getDOMElements() {

    storyPanel =
        document.getElementById("storyPanel");

    imagePanel =
        document.getElementById("imagePanel");

    storyKicker =
        document.getElementById("storyKicker");

    storyTitle =
        document.getElementById("storyTitle");

    storyText =
        document.getElementById("storyText");

    storyFooterText =
        document.getElementById("storyFooterText");

    storyProgress =
        document.getElementById("storyProgress");

    imageTrack =
        document.getElementById("imageTrack");

    imageCounter =
        document.getElementById("imageCounter");

    imageTitle =
        document.getElementById("imageTitle");

    imageDescription =
        document.getElementById("imageDescription");

    imageDots =
        document.getElementById("imageDots");

    nextButton =
        document.getElementById("nextButton");

    nextButtonText =
        document.getElementById("nextButtonText");

    backButton =
        document.getElementById("backButton");

    skipButton =
        document.getElementById("skipButton");

    progressBar =
        document.getElementById("progressBar");


    console.log(
        "================================="
    );

    console.log(
        "MOON EXHIBITION DOM INITIALIZED"
    );

    console.log(
        "storyPanel:",
        storyPanel
    );

    console.log(
        "imagePanel:",
        imagePanel
    );

    console.log(
        "imageTrack:",
        imageTrack
    );

}


/* =========================================================
   PAD NUMBER
========================================================= */

function padNumber(number) {

    return String(number)
        .padStart(2, "0");

}


/* =========================================================
   GET CURRENT STORY
========================================================= */

function getCurrentStory() {

    return (
        introStories[currentStory] || {
            images: []
        }
    );

}


/* =========================================================
   GET CURRENT IMAGES
========================================================= */

function getCurrentImages() {

    const story =
        getCurrentStory();

    return Array.isArray(story.images)
        ? story.images
        : [];

}


/* =========================================================
   UPDATE STORY TEXT
========================================================= */

function updateStoryText() {

    const story =
        getCurrentStory();


    /*
       Kicker
    */

    if (storyKicker) {

        storyKicker.textContent =
            story.kicker || "";

    }


    /*
       Title
    */

    if (storyTitle) {

        storyTitle.innerHTML =
            story.title || "";

    }


    /*
       Main text
    */

    if (storyText) {

        storyText.innerHTML =
            story.text || "";

    }


    /*
       Footer
    */

    if (storyFooterText) {

        storyFooterText.textContent =
            story.footer || "";

    }


    /*
       Story progress
    */

    if (storyProgress) {

        storyProgress.textContent =
            `${padNumber(currentStory + 1)} / ${padNumber(introStories.length)}`;

    }


    /*
       Panel numbers
    */

    const panelNumbers =
        document.querySelectorAll(
            ".panel-number"
        );


    if (panelNumbers.length >= 2) {

        panelNumbers[0].textContent =
            `STORY / ${padNumber(currentStory + 1)}`;

        panelNumbers[1].textContent =
            `ARCHIVE / ${padNumber(currentStory + 1)}`;

    }


    /*
       Progress bar
    */

    if (progressBar) {

        const progress =
            (
                (currentStory + 1) /
                introStories.length
            ) * 100;

        progressBar.style.width =
            `${progress}%`;

    }


    /*
       Back button
    */

    if (backButton) {

        const disabled =
            currentStory === 0;


        backButton.classList.toggle(
            "disabled",
            disabled
        );


        backButton.setAttribute(
            "aria-disabled",
            disabled
                ? "true"
                : "false"
        );

    }


    /*
       Next button
    */

    const isFinalStory =
        currentStory ===
        introStories.length - 1;


    if (nextButtonText) {

        nextButtonText.textContent =
            isFinalStory
                ? "↗"
                : "→";

    }


    if (nextButton) {

        nextButton.setAttribute(
            "aria-label",
            isFinalStory
                ? "Explore Moon map"
                : "Next story"
        );

    }

}


/* =========================================================
   CREATE IMAGE DESCRIPTION
========================================================= */

function createImageDescription(image) {

    if (!imageDescription) {

        return;

    }


    imageDescription.innerHTML =
        "";


    /*
       Description
    */

    if (image.description) {

        const description =
            document.createElement(
                "span"
            );


        description.textContent =
            image.description;


        imageDescription.appendChild(
            description
        );

    }


    /*
       External source link
    */

    if (image.link) {

        const link =
            document.createElement(
                "a"
            );


        link.href =
            image.link;


        link.textContent =
            "Explore source ↗";


        link.target =
            "_blank";


        link.rel =
            "noopener noreferrer";


        if (image.description) {

            imageDescription.appendChild(
                document.createElement("br")
            );

        }


        imageDescription.appendChild(
            link
        );

    }

}


/* =========================================================
   UPDATE IMAGE INFORMATION
========================================================= */

function updateImageInformation() {

    const images =
        getCurrentImages();


    /*
       No images
    */

    if (!images.length) {

        if (imageCounter) {

            imageCounter.textContent =
                "IMAGE 00 / 00";

        }


        if (imageTitle) {

            imageTitle.textContent =
                "";

        }


        if (imageDescription) {

            imageDescription.innerHTML =
                "";

        }


        return;

    }


    const image =
        images[currentImage];


    if (!image) {

        return;

    }


    /*
       Counter
    */

    if (imageCounter) {

        imageCounter.textContent =
            `IMAGE ${padNumber(currentImage + 1)} / ${padNumber(images.length)}`;

    }


    /*
       Title
    */

    if (imageTitle) {

        imageTitle.textContent =
            image.title || "";

    }


    /*
       Description
    */

    createImageDescription(
        image
    );

}


/* =========================================================
   STOP IMAGE TIMER
========================================================= */

function stopImageTimer() {

    if (imageTimer !== null) {

        clearTimeout(
            imageTimer
        );

        imageTimer =
            null;

    }

}


/* =========================================================
   START IMAGE TIMER
========================================================= */

function startImageTimer() {

    stopImageTimer();


    if (isAnimating) {

        return;

    }


    const images =
        getCurrentImages();


    if (images.length <= 1) {

        return;

    }


    imageTimer =
        setTimeout(
            function () {

                showImage(
                    currentImage + 1
                );

            },
            IMAGE_ROTATION_TIME
        );

}


/* =========================================================
   LOAD STORY IMAGES
========================================================= */

function loadStoryImages() {

    const images =
        getCurrentImages();


    /*
       Stop previous timer
    */

    stopImageTimer();


    /*
       Reset current image
    */

    currentImage =
        0;


    /*
       Clear image track
    */

    if (imageTrack) {

        imageTrack.innerHTML =
            "";

        imageTrack.style.transform =
            "translateX(0)";

    }


    /*
       Clear dots
    */

    if (imageDots) {

        imageDots.innerHTML =
            "";

    }


    /*
       No images
    */

    if (!images.length) {

        updateImageInformation();

        return;

    }


    /*
       Create images
    */

    images.forEach(
        function (image, index) {

            /*
               Slide
            */

            const slide =
                document.createElement(
                    "div"
                );


            slide.className =
                "image-slide";


            if (index === 0) {

                slide.classList.add(
                    "active"
                );

            }


            /*
               Image
            */

            const img =
                document.createElement(
                    "img"
                );


            /*
               IMPORTANT:

               These paths are relative to
               the ROOT index.html.
            */

            img.src =
                image.src;


            img.alt =
                image.title ||
                "Moon exhibition image";


            img.draggable =
                false;


            img.loading =
                index === 0
                    ? "eager"
                    : "lazy";


            /*
               Debug
            */

            console.log(
                "Loading image:",
                image.src
            );


            /*
               Image error
            */

            img.addEventListener(
                "error",
                function () {

                    console.error(
                        "================================="
                    );

                    console.error(
                        "IMAGE FAILED TO LOAD"
                    );

                    console.error(
                        "Path:",
                        image.src
                    );

                    console.error(
                        "Full URL:",
                        img.src
                    );

                    console.error(
                        "================================="
                    );


                    slide.classList.add(
                        "image-error"
                    );

                },
                {
                    once: true
                }
            );


            /*
               Image loaded
            */

            img.addEventListener(
                "load",
                function () {

                    console.log(
                        "IMAGE LOADED:",
                        image.src
                    );

                },
                {
                    once: true
                }
            );


            slide.appendChild(
                img
            );


            if (imageTrack) {

                imageTrack.appendChild(
                    slide
                );

            }


            /*
               Create dot
            */

            if (imageDots) {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type =
                    "button";


                dot.className =
                    "image-dot";


                if (index === 0) {

                    dot.classList.add(
                        "active"
                    );

                }


                dot.setAttribute(
                    "aria-label",
                    `View image ${index + 1}`
                );


                dot.setAttribute(
                    "aria-current",
                    index === 0
                        ? "true"
                        : "false"
                );


                dot.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        showImage(
                            index
                        );

                    }
                );


                imageDots.appendChild(
                    dot
                );

            }

        }
    );


    /*
       Update information
    */

    updateImageInformation();


    /*
       Start rotation
    */

    startImageTimer();

}


/* =========================================================
   SHOW IMAGE
========================================================= */

function showImage(index) {

    const images =
        getCurrentImages();


    if (!images.length) {

        return;

    }


    /*
       Wrap forward
    */

    if (
        index >= images.length
    ) {

        index =
            0;

    }


    /*
       Wrap backward
    */

    if (
        index < 0
    ) {

        index =
            images.length - 1;

    }


    currentImage =
        index;


    /*
       Move slider
    */

    if (imageTrack) {

        imageTrack.style.transform =
            `translateX(-${index * 100}%)`;

    }


    /*
       Update slides
    */

    if (imageTrack) {

        const slides =
            imageTrack.querySelectorAll(
                ".image-slide"
            );


        slides.forEach(
            function (slide, slideIndex) {

                slide.classList.toggle(
                    "active",
                    slideIndex === index
                );

            }
        );

    }


    /*
       Update dots
    */

    if (imageDots) {

        const dots =
            imageDots.querySelectorAll(
                ".image-dot"
            );


        dots.forEach(
            function (dot, dotIndex) {

                const active =
                    dotIndex === index;


                dot.classList.toggle(
                    "active",
                    active
                );


                dot.setAttribute(
                    "aria-current",
                    active
                        ? "true"
                        : "false"
                );

            }
        );

    }


    /*
       Update information
    */

    updateImageInformation();


    /*
       Restart timer
    */

    startImageTimer();

}


/* =========================================================
   CHANGE STORY
========================================================= */

function changeStory(direction) {

    /*
       Prevent multiple actions
    */

    if (isAnimating) {

        return;

    }


    /*
       Final story
    */

    if (
        direction > 0 &&
        currentStory >=
            introStories.length - 1
    ) {

        enterMoonMap();

        return;

    }


    /*
       Before first story
    */

    if (
        direction < 0 &&
        currentStory <= 0
    ) {

        return;

    }


    /*
       Lock animation
    */

    isAnimating =
        true;


    /*
       Stop image timer
    */

    stopImageTimer();


    /*
       Remove old enter classes
    */

    if (storyPanel) {

        storyPanel.classList.remove(
            "story-enter"
        );

    }


    if (imagePanel) {

        imagePanel.classList.remove(
            "story-enter"
        );

    }


    /*
       Exit animation
    */

    if (storyPanel) {

        storyPanel.classList.add(
            "story-changing"
        );

    }


    if (imagePanel) {

        imagePanel.classList.add(
            "story-changing"
        );

    }


    /*
       Wait for exit
    */

    setTimeout(
        function () {

            /*
               Change story
            */

            currentStory +=
                direction;


            /*
               Update text
            */

            updateStoryText();


            /*
               Load new images
            */

            loadStoryImages();


            /*
               Remove changing
            */

            if (storyPanel) {

                storyPanel.classList.remove(
                    "story-changing"
                );

            }


            if (imagePanel) {

                imagePanel.classList.remove(
                    "story-changing"
                );

            }


            /*
               Enter animation
            */

            if (storyPanel) {

                storyPanel.classList.add(
                    "story-enter"
                );

            }


            if (imagePanel) {

                imagePanel.classList.add(
                    "story-enter"
                );

            }


            /*
               Finish
            */

            setTimeout(
                function () {

                    if (storyPanel) {

                        storyPanel.classList.remove(
                            "story-enter"
                        );

                    }


                    if (imagePanel) {

                        imagePanel.classList.remove(
                            "story-enter"
                        );

                    }


                    isAnimating =
                        false;


                    startImageTimer();

                },
                STORY_ENTER_TIME
            );

        },
        STORY_EXIT_TIME
    );

}


/* =========================================================
   ENTER MOON MAP
========================================================= */

function enterMoonMap() {

    /*
       Don't navigate twice
    */

    if (
        document.body.classList.contains(
            "leaving"
        )
    ) {

        return;

    }


    /*
       Stop timer
    */

    stopImageTimer();


    /*
       Lock
    */

    isAnimating =
        true;


    /*
       Animation
    */

    document.body.classList.add(
        "leaving"
    );


    /*
       Navigate
    */

    setTimeout(
        function () {

            window.location.href =
                HOME_MAP_PAGE;

        },
        350
    );

}


/* =========================================================
   NEXT BUTTON
========================================================= */

function setupNextButton() {

    if (!nextButton) {

        return;

    }


    nextButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            changeStory(1);

        }
    );

}


/* =========================================================
   BACK BUTTON
========================================================= */

function setupBackButton() {

    if (!backButton) {

        return;

    }


    backButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (
                currentStory === 0 ||
                isAnimating
            ) {

                return;

            }


            changeStory(-1);

        }
    );

}


/* =========================================================
   SKIP BUTTON
========================================================= */

function setupSkipButton() {

    if (!skipButton) {

        return;

    }


    skipButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            enterMoonMap();

        }
    );

}


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

function setupKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        function (event) {

            const target =
                event.target;


            const tagName =
                target &&
                target.tagName
                    ? target.tagName.toUpperCase()
                    : "";


            const isInteractive =
                tagName === "BUTTON" ||
                tagName === "A" ||
                tagName === "INPUT" ||
                tagName === "TEXTAREA" ||
                tagName === "SELECT" ||
                tagName === "OPTION";


            /*
               Right
            */

            if (
                event.key === "ArrowRight"
            ) {

                if (isInteractive) {

                    return;

                }


                event.preventDefault();

                changeStory(1);

                return;

            }


            /*
               Left
            */

            if (
                event.key === "ArrowLeft"
            ) {

                if (isInteractive) {

                    return;

                }


                event.preventDefault();

                changeStory(-1);

                return;

            }


            /*
               Enter
            */

            if (
                event.key === "Enter"
            ) {

                if (isInteractive) {

                    return;

                }


                event.preventDefault();

                changeStory(1);

                return;

            }


            /*
               Space
            */

            if (
                event.key === " "
            ) {

                if (isInteractive) {

                    return;

                }


                event.preventDefault();

                changeStory(1);

                return;

            }


            /*
               Escape
            */

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                enterMoonMap();

            }

        }
    );

}


/* =========================================================
   GENERAL TOUCH
========================================================= */

function setupGeneralTouch() {

    document.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches.length !== 1
            ) {

                return;

            }


            const touch =
                event.touches[0];


            touchStartX =
                touch.clientX;


            touchStartY =
                touch.clientY;


            touchStartedInImagePanel =
                imagePanel
                    ? imagePanel.contains(
                        event.target
                    )
                    : false;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        function (event) {

            if (
                event.changedTouches.length !== 1
            ) {

                return;

            }


            /*
               Image panel has separate swipe
            */

            if (
                touchStartedInImagePanel
            ) {

                touchStartedInImagePanel =
                    false;

                return;

            }


            const touch =
                event.changedTouches[0];


            const deltaX =
                touch.clientX -
                touchStartX;


            const deltaY =
                touch.clientY -
                touchStartY;


            /*
               Ignore vertical swipe
            */

            if (
                Math.abs(deltaX) < 50 ||
                Math.abs(deltaX) <
                    Math.abs(deltaY)
            ) {

                return;

            }


            /*
               Swipe left
            */

            if (
                deltaX < 0
            ) {

                changeStory(1);

            }


            /*
               Swipe right
            */

            else {

                changeStory(-1);

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   IMAGE TOUCH
========================================================= */

function setupImageTouch() {

    if (!imagePanel) {

        return;

    }


    /*
       Touch start
    */

    imagePanel.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches.length !== 1
            ) {

                return;

            }


            const touch =
                event.touches[0];


            imageTouchStartX =
                touch.clientX;


            imageTouchStartY =
                touch.clientY;

        },
        {
            passive: true
        }
    );


    /*
       Touch end
    */

    imagePanel.addEventListener(
        "touchend",
        function (event) {

            if (
                event.changedTouches.length !== 1
            ) {

                return;

            }


            const touch =
                event.changedTouches[0];


            const deltaX =
                touch.clientX -
                imageTouchStartX;


            const deltaY =
                touch.clientY -
                imageTouchStartY;


            /*
               Ignore vertical movement
            */

            if (
                Math.abs(deltaX) < 40 ||
                Math.abs(deltaX) <
                    Math.abs(deltaY)
            ) {

                return;

            }


            const images =
                getCurrentImages();


            if (!images.length) {

                return;

            }


            /*
               Swipe left
            */

            if (
                deltaX < 0
            ) {

                showImage(
                    currentImage + 1
                );

            }


            /*
               Swipe right
            */

            else {

                showImage(
                    currentImage - 1
                );

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   IMAGE PROTECTION
========================================================= */

function setupImageProtection() {

    if (!imagePanel) {

        return;

    }


    /*
       Prevent dragging
    */

    imagePanel.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();

        }
    );


    /*
       Prevent right-click on images
    */

    imagePanel.addEventListener(
        "contextmenu",
        function (event) {

            if (
                event.target &&
                event.target.tagName === "IMG"
            ) {

                event.preventDefault();

            }

        }
    );

}


/* =========================================================
   VISIBILITY CHANGE
========================================================= */

function setupVisibilityChange() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.hidden
            ) {

                stopImageTimer();

            }

            else {

                startImageTimer();

            }

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeStorySystem() {

    console.log(
        "================================="
    );

    console.log(
        "MOON EXHIBITION STARTING"
    );

    console.log(
        "================================="
    );


    /*
       Get DOM
    */

    getDOMElements();


    /*
       Validate story index
    */

    currentStory =
        Math.max(
            0,
            Math.min(
                currentStory,
                introStories.length - 1
            )
        );


    /*
       Check important elements
    */

    if (!storyPanel) {

        console.warn(
            "Missing HTML element: #storyPanel"
        );

    }


    if (!imagePanel) {

        console.warn(
            "Missing HTML element: #imagePanel"
        );

    }


    if (!imageTrack) {

        console.warn(
            "Missing HTML element: #imageTrack"
        );

    }


    /*
       Initial story
    */

    updateStoryText();


    /*
       Initial images
    */

    loadStoryImages();


    /*
       Buttons
    */

    setupNextButton();

    setupBackButton();

    setupSkipButton();


    /*
       Keyboard
    */

    setupKeyboardNavigation();


    /*
       Touch
    */

    setupGeneralTouch();

    setupImageTouch();


    /*
       Image protection
    */

    setupImageProtection();


    /*
       Visibility
    */

    setupVisibilityChange();


    console.log(
        "Moon Exhibition initialized successfully."
    );

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeStorySystem,
        {
            once: true
        }
    );

}

else {

    initializeStorySystem();

}
