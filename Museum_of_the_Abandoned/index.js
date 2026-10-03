/* =========================================================
   MOON EXHIBITION — STORY SYSTEM
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
                src: "../Museum of the Abandoned/story_images/moon.png",
                title: "THE MOON",
                description: "",
                link: ""
            },

            {
                src: "../images/mars.png",
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
                src: "../Museum of the Abandoned/story_images/NASA stepped on the Moon.jpg",
                title: "NASA's Step on the Moon",
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

            Soon after, <b>Mariner 4</b> followed and successfully reached Mars<br>

            Since then, mission after mission, NASA has continued sending
            spacecraft to explore these worlds.
        `,

        footer: "",

        images: [

            {
                src: "../Museum of the Abandoned/story_images/Pioneer_1.jpg",
                title: "PIONEER 1",
                description: "",
                link:
                    "https://science.nasa.gov/mission/pioneer-1-able-2/"
            },

            {
                src: "../Museum of the Abandoned/story_images/Mariner 3.jpg",
                title: "Mariner 3",
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
                src: "../Museum of the Abandoned/story_images/Progressing.png",
                title: "",
                description:
                    ""
            }

        ]
    },


    /* =====================================================
       PAGE 05
    ====================================================== */

    {
        kicker:
            "YOUR JOURNEY BEGINS",

        title:
            "",

        text: `

            <b>But some machines have stopped responding, and some are about to.

            We can’t let their contributions be forgotten.<br><br>

            **We believe you are the one who can conquer space. Your journey begins here.**</b>?

        `,

        footer:
            "",

        images: [

            {
                src: "../Museum of the Abandoned/story_images/Inspiring.png",
                title: "",
                description:
                    ""
            }


        ]
    }

];


/* =========================================================
   CONFIGURATION
========================================================= */

const Home_MAP_PAGE =
    "../Space/space.html";


/*
    IMPORTANT:

    This is the time between images.

    3500 = 3.5 seconds
    5000 = 5 seconds
    2000 = 2 seconds
*/

const IMAGE_ROTATION_TIME = 3500;

const STORY_EXIT_TIME = 250;

const STORY_ENTER_TIME = 450;


/* =========================================================
   STATE
========================================================= */

let currentStory = 0;

let currentImage = 0;

let isAnimating = false;

let imageTimer = null;

let touchStartX = 0;

let touchStartY = 0;

let touchStartedInImagePanel = false;

let imageTouchStartX = 0;

let imageTouchStartY = 0;


/* =========================================================
   ELEMENTS
========================================================= */

const storyPanel =
    document.getElementById("storyPanel");

const imagePanel =
    document.getElementById("imagePanel");

const storyKicker =
    document.getElementById("storyKicker");

const storyTitle =
    document.getElementById("storyTitle");

const storyText =
    document.getElementById("storyText");

const storyFooterText =
    document.getElementById("storyFooterText");

const storyProgress =
    document.getElementById("storyProgress");

const imageTrack =
    document.getElementById("imageTrack");

const imageCounter =
    document.getElementById("imageCounter");

const imageTitle =
    document.getElementById("imageTitle");

const imageDescription =
    document.getElementById("imageDescription");

const imageDots =
    document.getElementById("imageDots");

const nextButton =
    document.getElementById("nextButton");

const nextButtonText =
    document.getElementById("nextButtonText");

const backButton =
    document.getElementById("backButton");

const skipButton =
    document.getElementById("skipButton");

const progressBar =
    document.getElementById("progressBar");


/* =========================================================
   HELPER — PAD NUMBER
========================================================= */

function padNumber(number) {

    return String(number).padStart(2, "0");

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
            ((currentStory + 1) /
                introStories.length) * 100;

        progressBar.style.width =
            `${progress}%`;

    }


    /*
        Back button
    */

    if (backButton) {

        backButton.classList.toggle(
            "disabled",
            currentStory === 0
        );

        backButton.setAttribute(
            "aria-disabled",
            currentStory === 0
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
   IMAGE DESCRIPTION
========================================================= */

function createImageDescription(image) {

    if (!imageDescription) {

        return;

    }


    imageDescription.innerHTML = "";


    /*
        Description
    */

    if (image.description) {

        const description =
            document.createElement("span");

        description.textContent =
            image.description;

        imageDescription.appendChild(
            description
        );

    }


    /*
        External link
    */

    if (image.link) {

        const link =
            document.createElement("a");

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

    createImageDescription(image);

}


/* =========================================================
   START / RESET IMAGE TIMER
========================================================= */

function startImageTimer() {

    /*
        ALWAYS clear the previous timer first.
    */

    if (imageTimer !== null) {

        clearTimeout(imageTimer);

        imageTimer = null;

    }


    /*
        Don't start during story animation.
    */

    if (isAnimating) {

        return;

    }


    const images =
        getCurrentImages();


    /*
        No images or only one image.
    */

    if (images.length <= 1) {

        return;

    }


    /*
        Use setTimeout instead of setInterval.

        This creates a fresh 3.5-second countdown
        after EVERY image.
    */

    imageTimer =
        setTimeout(
            () => {

                /*
                    Move to next image.
                */

                showImage(
                    currentImage + 1
                );

            },
            IMAGE_ROTATION_TIME
        );

}


/* =========================================================
   STOP IMAGE TIMER
========================================================= */

function stopImageTimer() {

    if (imageTimer !== null) {

        clearTimeout(imageTimer);

        imageTimer = null;

    }

}


/* =========================================================
   LOAD STORY IMAGES
========================================================= */

function loadStoryImages() {

    const images =
        getCurrentImages();


    /*
        Stop old timer.
    */

    stopImageTimer();


    /*
        Reset image.
    */

    currentImage = 0;


    /*
        Reset track.
    */

    if (imageTrack) {

        imageTrack.style.transform =
            "translateX(0)";

        imageTrack.innerHTML = "";

    }


    /*
        Reset dots.
    */

    if (imageDots) {

        imageDots.innerHTML = "";

    }


    /*
        No images.
    */

    if (!images.length) {

        updateImageInformation();

        return;

    }


    /*
        Create slides.
    */

    images.forEach(
        (image, index) => {

            const slide =
                document.createElement("div");


            slide.className =
                "image-slide";


            if (index === 0) {

                slide.classList.add(
                    "active"
                );

            }


            /*
                Image.
            */

            const img =
                document.createElement("img");


            img.src =
                image.src;

            img.alt =
                image.title ||
                "Moon exhibition image";

            img.loading =
                index === 0
                    ? "eager"
                    : "lazy";

            img.draggable =
                false;


            /*
                Image error.
            */

            img.addEventListener(
                "error",
                function () {

                    this.remove();

                    slide.classList.add(
                        "image-error"
                    );

                    slide.style.background = `
                        radial-gradient(
                            circle at center,
                            rgba(70,170,205,.28),
                            rgba(2,7,11,.96)
                        )
                    `;

                },
                {
                    once: true
                }
            );


            slide.appendChild(img);


            if (imageTrack) {

                imageTrack.appendChild(
                    slide
                );

            }


            /*
                Dot.
            */

            if (imageDots) {

                const dot =
                    document.createElement("button");


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


                /*
                    Dot click.
                */

                dot.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        showImage(index);

                    }
                );


                imageDots.appendChild(
                    dot
                );

            }

        }
    );


    /*
        Show first image information.
    */

    updateImageInformation();


    /*
        Start fresh 3.5 second countdown.
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
        Wrap around.
    */

    if (index >= images.length) {

        index = 0;

    }


    if (index < 0) {

        index =
            images.length - 1;

    }


    /*
        Update current image.
    */

    currentImage =
        index;


    /*
        Move slider.
    */

    if (imageTrack) {

        imageTrack.style.transform =
            `translateX(-${index * 100}%)`;

    }


    /*
        Update slide classes.
    */

    if (imageTrack) {

        const slides =
            imageTrack.querySelectorAll(
                ".image-slide"
            );


        slides.forEach(
            (slide, slideIndex) => {

                slide.classList.toggle(
                    "active",
                    slideIndex === index
                );

            }
        );

    }


    /*
        Update dots.
    */

    if (imageDots) {

        const dots =
            imageDots.querySelectorAll(
                ".image-dot"
            );


        dots.forEach(
            (dot, dotIndex) => {

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
        Update text.
    */

    updateImageInformation();


    /*
        IMPORTANT:

        Reset the timer AFTER changing image.

        So every image gets a complete
        3.5 second display time.
    */

    startImageTimer();

}


/* =========================================================
   CHANGE STORY
========================================================= */

function changeStory(direction) {

    /*
        Prevent double clicks.
    */

    if (isAnimating) {

        return;

    }


    /*
        Going beyond final story.
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
        Going before first story.
    */

    if (
        direction < 0 &&
        currentStory <= 0
    ) {

        return;

    }


    /*
        Lock animation.
    */

    isAnimating = true;


    /*
        Stop image timer.
    */

    stopImageTimer();


    /*
        Remove old enter classes.
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
        Animate out.
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
        Change story.
    */

    setTimeout(
        () => {

            currentStory +=
                direction;


            /*
                Update text.
            */

            updateStoryText();


            /*
                Load images.
            */

            loadStoryImages();


            /*
                Remove changing class.
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
                Enter animation.
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
                Finish animation.
            */

            setTimeout(
                () => {

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
                        Unlock.

                        loadStoryImages() was called
                        while isAnimating was true,
                        so start the timer again here.
                    */

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
   NEXT BUTTON
========================================================= */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        () => {

            changeStory(1);

        }
    );

}


/* =========================================================
   BACK BUTTON
========================================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

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
   SKIP INTRO
========================================================= */

if (skipButton) {

    skipButton.addEventListener(
        "click",
        enterMoonMap
    );

}


/* =========================================================
   ENTER MOON MAP
========================================================= */

function enterMoonMap() {

    if (
        document.body.classList.contains(
            "leaving"
        )
    ) {

        return;

    }


    /*
        Stop timer.
    */

    stopImageTimer();


    /*
        Lock.
    */

    isAnimating = true;


    /*
        Leaving animation.
    */

    document.body.classList.add(
        "leaving"
    );


    /*
        Navigate.
    */

    setTimeout(
        () => {

            window.location.href =
                Home_MAP_PAGE;

        },
        350
    );

}


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

document.addEventListener(
    "keydown",
    event => {

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
            Next.
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
            Previous.
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
            Enter.
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
            Space.
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
            Escape.
        */

        if (
            event.key === "Escape"
        ) {

            event.preventDefault();

            enterMoonMap();

        }

    }
);


/* =========================================================
   GENERAL TOUCH START
========================================================= */

document.addEventListener(
    "touchstart",
    event => {

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


        /*
            Remember whether touch started
            inside image panel.
        */

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


/* =========================================================
   GENERAL TOUCH END
========================================================= */

document.addEventListener(
    "touchend",
    event => {

        if (
            event.changedTouches.length !== 1
        ) {

            return;

        }


        /*
            Image panel has its own swipe handler.
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
            Ignore vertical gestures.
        */

        if (
            Math.abs(deltaX) < 50 ||
            Math.abs(deltaX) <
                Math.abs(deltaY)
        ) {

            return;

        }


        /*
            Swipe left.
        */

        if (deltaX < 0) {

            changeStory(1);

        }

        /*
            Swipe right.
        */

        else {

            changeStory(-1);

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   IMAGE TOUCH START
========================================================= */

if (imagePanel) {

    imagePanel.addEventListener(
        "touchstart",
        event => {

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

}


/* =========================================================
   IMAGE TOUCH END
========================================================= */

if (imagePanel) {

    imagePanel.addEventListener(
        "touchend",
        event => {

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
                Ignore vertical.
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
                Change image.

                showImage() automatically
                restarts the 3.5 second timer.
            */

            if (deltaX < 0) {

                showImage(
                    currentImage + 1
                );

            }

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
   REMOVE IMAGE PANEL CLICK TIMER LOGIC
=========================================================

   IMPORTANT:

   Do NOT add an imagePanel click handler
   that clears/restarts the timer.

   showImage() already handles the timer.

========================================================= */


/* =========================================================
   PREVENT IMAGE DRAGGING
========================================================= */

if (imagePanel) {

    imagePanel.addEventListener(
        "dragstart",
        event => {

            event.preventDefault();

        }
    );

}


/* =========================================================
   PREVENT IMAGE CONTEXT MENU
========================================================= */

if (imagePanel) {

    imagePanel.addEventListener(
        "contextmenu",
        event => {

            if (
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

document.addEventListener(
    "visibilitychange",
    () => {

        /*
            Browser hidden.
        */

        if (document.hidden) {

            stopImageTimer();

        }

        /*
            Browser visible.
        */

        else {

            startImageTimer();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeStorySystem() {

    currentStory =
        Math.max(
            0,
            Math.min(
                currentStory,
                introStories.length - 1
            )
        );


    /*
        Story text.
    */

    updateStoryText();


    /*
        Images.
    */

    loadStoryImages();

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
