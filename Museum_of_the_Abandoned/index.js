

const introStories = [

    {
        kicker: "THE BEGINNING",

        title: "Hi, Explorer!",

        text: `
            Do you know the average distances between the Moon and Earth,
            and Mars and Earth, are respectively <b>384,400 km</b> and
            <b>225 million km</b>?
            <br><br>
            But today, we are on our way to conquer them.
        `,

        footer: "BEGINNING OF LUNAR EXPLORATION",

        images: [

            {
                src: "./images/moon.png",
                title: "THE MOON",
                description: "Our closest celestial neighbor.",
                link: ""
            },

            {
                src: "./images/mars.png",
                title: "MARS",
                description: "The next frontier beyond the Moon.",
                link: ""
            }

        ]
    },

    {
        kicker: "THE IMPOSSIBLE",

        title:
            "Have you ever thought about what turned the impossible into possible?",

        text: `
            Every great journey begins with someone willing to look beyond
            what seems impossible.
        `,

        footer: "THE FIRST GIANT STEP",

        images: [

            {
                src:
                    "./images/NASA_stepped_on_the_Moon.jpg",

                title:
                    "NASA'S STEP ON THE MOON",

                description:
                    "Humanity's historic journey to the lunar surface.",

                link:
                    "https://www.nasa.gov/history/flag-day-flying-high-the-stars-and-stripes-in-space/"
            }

        ]
    },

    {
        kicker: "THE FIRST MISSIONS",

        title:
            "The Journey Begins",

        text: `
            About 68 years ago, in 1958, NASA began its journey towards
            the Moon with <b>Pioneer 1</b>, its first spacecraft, targeting
            lunar orbit.
            <br><br>

            And about 62 years ago, in 1964, NASA began its journey towards
            Mars with <b>Mariner 3</b>, its first Mars attempt.
            <br><br>

            Soon after, <b>Mariner 4</b> followed and successfully reached Mars.
            <br><br>

            Since then, mission after mission, NASA has continued sending
            spacecraft to explore these worlds.
        `,

        footer: "MISSION AFTER MISSION",

        images: [

            {
                src:
                    "./images/Pioneer_1.jpg",

                title:
                    "PIONEER 1",

                description:
                    "One of NASA's earliest lunar spacecraft missions.",

                link:
                    "https://science.nasa.gov/mission/pioneer-1-able-2/"
            },

            {
                src:
                    "./images/Mariner_3.jpg",

                title:
                    "MARINER 3",

                description:
                    "NASA's first attempt to reach Mars.",

                link:
                    "https://science.nasa.gov/mission/mariner-3/"
            }

        ]
    },

    {
        kicker: "KNOWLEDGE",

        title:
            "Every Mission Taught Us More",

        text: `
            They sent us vital information about these worlds, and based
            on that, we started our journey towards them.
        `,

        footer: "KNOWLEDGE BECOMES PROGRESS",

        images: [

            {
                src:
                    "./images/progressing.png",

                title:
                    "THE JOURNEY CONTINUES",

                description:
                    "Each mission adds another piece to the story of exploration.",

                link: ""
            }

        ]
    },

    {
        kicker:
            "YOUR JOURNEY BEGINS",

        title:
            "The Machines Are Waiting",

        text: `
            <b>
                But some machines have stopped responding, and some are about to.

                We can't let their contributions be forgotten.
                <br><br>

                We believe you are the one who can conquer space.
                Your journey begins here.
            </b>
        `,

        footer:
            "THE NEXT CHAPTER IS YOURS",

        images: [

            {
                src:
                    "./images/final.png",

                title:
                    "YOUR JOURNEY BEGINS",

                description:
                    "Step forward and begin your exploration.",

                link: ""
            }

        ]
    }

];

const HOME_MAP_PAGE =
    "./Space/space.html";

const IMAGE_ROTATION_TIME =
    3500;

const STORY_EXIT_TIME =
    250;

const STORY_ENTER_TIME =
    450;

const SELECTED_VOICE =
    "Microsoft Zira";

const STORY_VOICE_RATE =
    0.88;

const STORY_VOICE_PITCH =
    1.05;

const STORY_VOICE_VOLUME =
    1.0;

const STORY_VOICE_LANGUAGE =
    "en-US";

const STORY_VOICE_ENABLED =
    false;

const STORY_VOICE_DELAY =
    150;

const speechSupported =
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

let availableStoryVoices = [];

function loadStoryVoices() {

    if (!speechSupported) {
        return [];
    }

    availableStoryVoices =
        window.speechSynthesis.getVoices();

    console.log(
        "Available speech voices:",
        availableStoryVoices
    );

    return availableStoryVoices;
}

if (speechSupported && STORY_VOICE_ENABLED) {

    window.speechSynthesis.onvoiceschanged =
        function () {

            loadStoryVoices();

        };

    loadStoryVoices();
}

window.addEventListener(
    "languagechange",
    () => {

        stopStoryVoice();
        updateStoryText();
        updateImageInformation();

        if (!isAnimating) {
            speakCurrentStory();
        }

    }
);

function getStoryVoice() {

    if (!speechSupported) {
        return null;
    }

    let voices =
        window.speechSynthesis.getVoices();

    if (voices.length) {

        availableStoryVoices =
            voices;

    }

    if (!voices.length) {

        voices =
            availableStoryVoices;

    }

    if (!voices.length) {

        console.warn(
            "No speech voices available."
        );

        return null;

    }

    if (window.ProjectLanguage?.isBangla) {

        return voices.find(
            voice =>
                voice.lang
                    .toLowerCase()
                    .startsWith("bn")
        ) || null;

    }

    const selectedVoice =
        voices.find(
            function (voice) {

                return voice.name
                    .toLowerCase()
                    .includes(
                        SELECTED_VOICE.toLowerCase()
                    );

            }
        );

    if (selectedVoice) {

        console.log(
            "Selected voice:",
            selectedVoice.name
        );

        return selectedVoice;

    }

    const englishUS =
        voices.find(
            function (voice) {

                return (
                    voice.lang ===
                    STORY_VOICE_LANGUAGE
                );

            }
        );

    if (englishUS) {

        console.warn(
            `Voice "${SELECTED_VOICE}" not found. ` +
            `Using "${englishUS.name}".`
        );

        return englishUS;

    }

    const anyEnglish =
        voices.find(
            function (voice) {

                return voice.lang
                    .toLowerCase()
                    .startsWith("en");

            }
        );

    if (anyEnglish) {

        console.warn(
            `Using English voice "${anyEnglish.name}".`
        );

        return anyEnglish;

    }

    return voices[0] || null;

}

function getSpeechText(html) {

    if (!html) {
        return "";
    }

    const temporaryElement =
        document.createElement("div");

    temporaryElement.innerHTML =
        html;

    const breaks =
        temporaryElement.querySelectorAll("br");

    breaks.forEach(
        function (br) {

            br.replaceWith(" ");

        }
    );

    let text =
        temporaryElement.textContent ||
        temporaryElement.innerText ||
        "";

    text =
        text
            .replace(/\s+/g, " ")
            .trim();

    return text;

}

function stopStoryVoice() {

    if (!speechSupported) {
        return;
    }

    window.speechSynthesis.cancel();

}

function speakCurrentStory() {

    if (!STORY_VOICE_ENABLED) {
        return;
    }

    if (!speechSupported) {

        console.warn(
            "Speech synthesis is not supported."
        );

        return;

    }

    const story =
        getCurrentStory();

    const localizedStory =
        getLocalizedStory(story);

    if (!story) {
        return;
    }

    stopStoryVoice();

    const parts = [];

    if (localizedStory.kicker || story.kicker) {

        parts.push(
            getSpeechText(
                localizedStory.kicker || story.kicker
            )
        );

    }

    if (localizedStory.title || story.title) {

        parts.push(
            getSpeechText(
                localizedStory.title || story.title
            )
        );

    }

    if (localizedStory.text || story.text) {

        parts.push(
            getSpeechText(
                localizedStory.text || story.text
            )
        );

    }

    const narration =
        parts
            .filter(Boolean)
            .join(". ");

    if (!narration) {
        return;
    }

    setTimeout(
        function () {

            if (!STORY_VOICE_ENABLED) {
                return;
            }

            const currentStoryAtStart =
                getCurrentStory();

            if (
                currentStoryAtStart !== story
            ) {

                return;

            }

            const utterance =
                new SpeechSynthesisUtterance(
                    narration
                );

            utterance.rate =
                STORY_VOICE_RATE;

            utterance.pitch =
                STORY_VOICE_PITCH;

            utterance.volume =
                STORY_VOICE_VOLUME;

            utterance.lang =
                window.ProjectLanguage?.isBangla
                    ? "bn-BD"
                    : STORY_VOICE_LANGUAGE;

            const voice =
                getStoryVoice();

            if (voice) {

                utterance.voice =
                    voice;

                if (!window.ProjectLanguage?.isBangla) {
                    utterance.lang = voice.lang;
                }

            }

            utterance.onstart =
                function () {

                    console.log(
                        "Narration started."
                    );

                };

            utterance.onend =
                function () {

                    console.log(
                        "Narration finished."
                    );

                };

            utterance.onerror =
                function (event) {

                    console.warn(
                        "Speech error:",
                        event
                    );

                };

            window.speechSynthesis.speak(
                utterance
            );

        },
        STORY_VOICE_DELAY
    );

}

let currentStory =
    0;

let currentImage =
    0;

let isAnimating =
    false;

let imageTimer =
    null;

let touchStartX =
    0;

let touchStartY =
    0;

let touchStartedInImagePanel =
    false;

let imageTouchStartX =
    0;

let imageTouchStartY =
    0;

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

function getDOMElements() {

    storyPanel =
        document.getElementById(
            "storyPanel"
        );

    imagePanel =
        document.getElementById(
            "imagePanel"
        );

    storyKicker =
        document.getElementById(
            "storyKicker"
        );

    storyTitle =
        document.getElementById(
            "storyTitle"
        );

    storyText =
        document.getElementById(
            "storyText"
        );

    storyFooterText =
        document.getElementById(
            "storyFooterText"
        );

    storyProgress =
        document.getElementById(
            "storyProgress"
        );

    imageTrack =
        document.getElementById(
            "imageTrack"
        );

    imageCounter =
        document.getElementById(
            "imageCounter"
        );

    imageTitle =
        document.getElementById(
            "imageTitle"
        );

    imageDescription =
        document.getElementById(
            "imageDescription"
        );

    imageDots =
        document.getElementById(
            "imageDots"
        );

    nextButton =
        document.getElementById(
            "nextButton"
        );

    nextButtonText =
        document.getElementById(
            "nextButtonText"
        );

    backButton =
        document.getElementById(
            "backButton"
        );

    skipButton =
        document.getElementById(
            "skipButton"
        );

    progressBar =
        document.getElementById(
            "progressBar"
        );

}

function padNumber(number) {

    return String(number)
        .padStart(2, "0");

}

function getCurrentStory() {

    return (
        introStories[currentStory] || {
            images: []
        }
    );

}

function getLocalizedStory(story = getCurrentStory()) {

    if (
        window.ProjectLanguage?.isBangla &&
        Array.isArray(window.introStoriesBangla)
    ) {

        return window.introStoriesBangla[currentStory] || story;

    }

    return story;

}

function getLocalizedImage(image, index) {

    const localizedStory =
        getLocalizedStory();

    return localizedStory.images?.[index] || image;

}

function getCurrentImages() {

    const story =
        getCurrentStory();

    return Array.isArray(story.images)
        ? story.images
        : [];

}

function updateStoryText() {

    const story =
        getCurrentStory();

    const localizedStory =
        getLocalizedStory(story);

    if (storyKicker) {

        storyKicker.textContent =
            localizedStory.kicker || story.kicker || "";

    }

    if (storyTitle) {

        storyTitle.innerHTML =
            localizedStory.title || story.title || "";

    }

    if (storyText) {

        storyText.innerHTML =
            localizedStory.text || story.text || "";

    }

    if (storyFooterText) {

        storyFooterText.textContent =
            localizedStory.footer || story.footer || "";

    }

    if (storyProgress) {

        const currentNumber =
            window.ProjectLanguage?.formatNumber(padNumber(currentStory + 1)) ||
            padNumber(currentStory + 1);

        const totalNumber =
            window.ProjectLanguage?.formatNumber(padNumber(introStories.length)) ||
            padNumber(introStories.length);

        storyProgress.textContent =
            `${currentNumber} / ${totalNumber}`;

    }

    const panelNumbers =
        document.querySelectorAll(
            ".panel-number"
        );

    if (panelNumbers.length >= 2) {

        const storyNumber =
            window.ProjectLanguage?.formatNumber(padNumber(currentStory + 1)) ||
            padNumber(currentStory + 1);

        panelNumbers[0].textContent =
            `${window.ProjectLanguage?.isBangla ? "গল্প" : "STORY"} / ${storyNumber}`;

        panelNumbers[1].textContent =
            `${window.ProjectLanguage?.isBangla ? "সংরক্ষণাগার" : "ARCHIVE"} / ${storyNumber}`;

    }

    if (progressBar) {

        const progress =
            (
                (currentStory + 1) /
                introStories.length
            ) * 100;

        progressBar.style.width =
            `${progress}%`;

    }

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

function createImageDescription(image) {

    if (!imageDescription) {
        return;
    }

    imageDescription.innerHTML =
        "";

    const imageIndex =
        getCurrentImages().indexOf(image);

    const localizedImage =
        getLocalizedImage(image, imageIndex);

    if (localizedImage.description || image.description) {

        const description =
            document.createElement(
                "span"
            );

        description.textContent =
            localizedImage.description || image.description;

        imageDescription.appendChild(
            description
        );

    }

    if (image.link) {

        const link =
            document.createElement(
                "a"
            );

        link.href =
            image.link;

        link.textContent =
            window.ProjectLanguage?.translate("Explore source ↗") || "Explore source ↗";

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

function updateImageInformation() {

    const images =
        getCurrentImages();

    if (!images.length) {

        if (imageCounter) {

            imageCounter.textContent =
                window.ProjectLanguage?.isBangla
                    ? "ছবি ০০ / ০০"
                    : "IMAGE 00 / 00";

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

    if (imageCounter) {

        imageCounter.textContent =
            `${window.ProjectLanguage?.isBangla ? "ছবি" : "IMAGE"} ${window.ProjectLanguage?.formatNumber(padNumber(currentImage + 1)) || padNumber(currentImage + 1)} / ${window.ProjectLanguage?.formatNumber(padNumber(images.length)) || padNumber(images.length)}`;

    }

    if (imageTitle) {

        const localizedImage =
            getLocalizedImage(image, currentImage);

        imageTitle.textContent =
            localizedImage.title || image.title || "";

    }

    createImageDescription(
        image
    );

}

function stopImageTimer() {

    if (imageTimer !== null) {

        clearTimeout(
            imageTimer
        );

        imageTimer =
            null;

    }

}

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

function loadStoryImages() {

    const images =
        getCurrentImages();

    stopImageTimer();

    currentImage =
        0;

    if (imageTrack) {

        imageTrack.innerHTML =
            "";

        imageTrack.style.transform =
            "translateX(0)";

    }

    if (imageDots) {

        imageDots.innerHTML =
            "";

    }

    if (!images.length) {

        updateImageInformation();

        return;

    }

    images.forEach(
        function (image, index) {

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

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                image.src;

            img.alt =
                getLocalizedImage(image, index).title ||
                image.title ||
                "Moon exhibition image";

            img.draggable =
                false;

            img.loading =
                index === 0
                    ? "eager"
                    : "lazy";

            img.addEventListener(
                "error",
                function () {

                    console.error(
                        "IMAGE FAILED:",
                        image.src
                    );

                    slide.classList.add(
                        "image-error"
                    );

                },
                {
                    once: true
                }
            );

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
                    `${window.ProjectLanguage?.translate("View image") || "View image"} ${index + 1}`
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

    updateImageInformation();

    startImageTimer();

}

function showImage(index) {

    const images =
        getCurrentImages();

    if (!images.length) {
        return;
    }

    if (
        index >= images.length
    ) {

        index =
            0;

    }

    if (
        index < 0
    ) {

        index =
            images.length - 1;

    }

    currentImage =
        index;

    if (imageTrack) {

        imageTrack.style.transform =
            `translateX(-${index * 100}%)`;

    }

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

    updateImageInformation();

    startImageTimer();

}

function changeStory(direction) {

    if (isAnimating) {
        return;
    }

    if (
        direction > 0 &&
        currentStory >=
            introStories.length - 1
    ) {

        enterMoonMap();

        return;

    }

    if (
        direction < 0 &&
        currentStory <= 0
    ) {

        return;

    }

    stopStoryVoice();

    isAnimating =
        true;

    stopImageTimer();

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

    setTimeout(
        function () {

            currentStory +=
                direction;

            updateStoryText();

            loadStoryImages();

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

                    speakCurrentStory();

                },
                STORY_ENTER_TIME
            );

        },
        STORY_EXIT_TIME
    );

}

function enterMoonMap() {

    if (
        document.body.classList.contains(
            "leaving"
        )
    ) {

        return;

    }

    stopStoryVoice();

    stopImageTimer();

    isAnimating =
        true;

    document.body.classList.add(
        "leaving"
    );

    setTimeout(
        function () {

            window.location.href =
                window.ProjectLanguage?.withLanguage(HOME_MAP_PAGE) ||
                HOME_MAP_PAGE;

        },
        350
    );

}

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

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                enterMoonMap();

            }

        }
    );

}

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

            if (
                Math.abs(deltaX) < 50 ||
                Math.abs(deltaX) <
                    Math.abs(deltaY)
            ) {

                return;

            }

            if (
                deltaX < 0
            ) {

                changeStory(1);

            }

            else {

                changeStory(-1);

            }

        },
        {
            passive: true
        }
    );

}

function setupImageTouch() {

    if (!imagePanel) {
        return;
    }

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

            if (
                deltaX < 0
            ) {

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

function setupImageProtection() {

    if (!imagePanel) {
        return;
    }

    imagePanel.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();

        }
    );

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

function setupVisibilityChange() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.hidden
            ) {

                stopImageTimer();

                stopStoryVoice();

            }

            else {

                startImageTimer();

                speakCurrentStory();

            }

        }
    );

}

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

    getDOMElements();

    currentStory =
        Math.max(
            0,
            Math.min(
                currentStory,
                introStories.length - 1
            )
        );

    updateStoryText();

    loadStoryImages();

    setupNextButton();

    setupBackButton();

    setupSkipButton();

    setupKeyboardNavigation();

    setupGeneralTouch();

    setupImageTouch();

    setupImageProtection();

    setupVisibilityChange();

    setTimeout(
        function () {

            speakCurrentStory();

        },
        STORY_VOICE_DELAY
    );

    console.log(
        "Moon Exhibition initialized successfully."
    );

    console.log(
        "Stories:",
        introStories.length
    );

    console.log(
        "Speech supported:",
        speechSupported
    );

    console.log(
        "Selected voice:",
        SELECTED_VOICE
    );

}

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
