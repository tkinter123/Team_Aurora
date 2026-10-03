/* =========================================================
   MOON EXHIBITION
========================================================= */


/* =========================================================
   MAP CONFIG
========================================================= */

const MOON_BASE_SIZE = 420;

const MOON_MIN_ZOOM = 0.35;

const MOON_MAX_ZOOM = 8;


/* =========================================================
   VIEW STATE
========================================================= */

let zoom = 1;

let panX = 0;

let panY = 0;

let isDragging = false;

let dragStartX = 0;

let dragStartY = 0;

let startPanX = 0;

let startPanY = 0;


/* =========================================================
   ELEMENTS
========================================================= */

const planetMap =
    document.getElementById("planetMap");

const moonWorld =
    document.getElementById("moonWorld");

const moonImage =
    document.getElementById("moonImage");

const spacecraftLayer =
    document.getElementById("spacecraftLayer");


/* =========================================================
   LUNAR SITES
=========================================================

   latitude / longitude
   --------------------
   Keep these as the real geographic coordinates.

   displayOffset
   -------------
   ONLY changes the visual position on screen.

   x = right / left
   y = down / up

   type
   ----
   "landed"  = landing/impact marker
   "orbited" = spacecraft image
========================================================= */

const lunarSites = [

    {
        name: "Ranger 7",

        latitude: -10.6333,
        longitude: -20.6000,

        type: "impact",

        displayOffset: {
            x: 0,
            y: 0
        }
    },

    {
        name: "Surveyor 3",

        latitude: -3.0000,
        longitude: -23.4100,

        type: "landed",

        displayOffset: {
            x: 0,
            y: 0
        }
    },

    {
        name: "Lunar Orbiter 5",

        latitude: 0,
        longitude: -70,

        type: "orbited",

        displayOffset: {
            x: 0,
            y: -35
        }
    },

    {
        name: "Surveyor 7",

        latitude: -40.9700,
        longitude: -11.4400,

        type: "landed",

        displayOffset: {
            x: 0,
            y: 0
        }
    },

    {
        name: "Apollo 11",

        latitude: 0.67416,
        longitude: 23.47314,

        type: "landed",

        displayOffset: {
            x: 100,
            y: 20
        }
    },

    {
        name: "Apollo 12",

        latitude: -3.0128,
        longitude: -23.4219,

        type: "landed",

        displayOffset: {
            x: 0,
            y: 0
        }
    },

    {
        name: "Apollo 15",

        latitude: 26.13239,
        longitude: 3.63330,

        type: "landed",

        displayOffset: {
            x: 0,
            y: 0
        }
    },

    {
        name: "Apollo 17",

        latitude: 20.1911,
        longitude: 30.7723,

        type: "landed",

        displayOffset: {
            x: 0,
            y: 0
        }
    },

    {
        name: "LCROSS",

        latitude: -84.6796,
        longitude: -48.7093,

        type: "impact",

        displayOffset: {
            x: 0,
            y: 0
        }
    }

];


/* =========================================================
   SPACECRAFT IMAGES
========================================================= */

const spacecraftImages = {

    "Ranger 7":
        "moon_images/Ranger 7.png",

    "Surveyor 3":
        "moon_images/Surveyor 3.png",

    "Lunar Orbiter 5":
        "moon_images/Lunar Orbiter 5.png",

    "Surveyor 7":
        "moon_images/Surveyor 7.png",

    "Apollo 11":
        "moon_images/Apollo 11.png",

    "Apollo 12":
        "moon_images/Apollo 12.png",

    "Apollo 15":
        "moon_images/Apollo 15.png",

    "Apollo 17":
        "moon_images/Apollo 17.png",

    "LCROSS":
        "moon_images/LCROSS.png"

};


/* =========================================================
   STORIES
========================================================= */

const stories = {

    "Apollo 11": [

        {
            kicker: "THE BEGINNING",
            title: "A Journey to the Moon",
            text: "Apollo 11 carried humanity's first crew to the lunar surface. The mission transformed the Moon from a distant world into a place where humans could work, experiment, and leave scientific instruments behind."
        },

        {
            kicker: "THE HARDWARE",
            title: "More Than a Spacecraft",
            text: "Apollo 11 was an entire system of hardware: the Command Module Columbia, the Lunar Module Eagle, scientific instruments, communications equipment, and systems that kept three astronauts alive during the journey."
        },

        {
            kicker: "ON THE SURFACE",
            title: "Science Was Left Behind",
            text: "The astronauts deployed instruments including a Solar Wind Composition Experiment, seismic experiments, and a Laser Ranging Retroreflector."
        },

        {
            kicker: "AFTER THE MISSION",
            title: "When Humans Left",
            text: "The astronauts returned to Earth, but much of the hardware remained on the Moon. The equipment became part of the permanent human footprint on another world."
        },

        {
            kicker: "LEGACY",
            title: "The Mission Continues",
            text: "The hardware may no longer travel, but the scientific knowledge it enabled continues to connect later lunar missions with the beginning of human exploration on the Moon."
        }

    ],


    "Apollo 12": [

        {
            kicker: "THE MISSION",
            title: "Precision Landing",
            text: "Apollo 12 demonstrated that humans could deliberately land near a scientifically important target. The crew reached the Ocean of Storms and conducted a detailed exploration of the lunar surface."
        },

        {
            kicker: "A NEARBY MACHINE",
            title: "Surveyor 3",
            text: "The Apollo 12 landing site was only about 600 feet from Surveyor 3, a robotic spacecraft that had arrived on the Moon more than two years earlier."
        },

        {
            kicker: "HARDWARE RECOVERED",
            title: "The Camera Came Home",
            text: "Astronauts Charles Conrad Jr. and Alan Bean approached Surveyor 3 and recovered its television camera and other components for examination on Earth."
        },

        {
            kicker: "WHY IT MATTERED",
            title: "A Robotic Mission Met a Human One",
            text: "Apollo 12 created an unusual link between two generations of lunar exploration: a robotic spacecraft sent first, followed years later by astronauts who physically examined it."
        },

        {
            kicker: "TODAY",
            title: "An Artifact on Another World",
            text: "Surveyor 3 remains part of the history of lunar exploration. Its story demonstrates that hardware left behind can continue to produce scientific and engineering knowledge."
        }

    ],


    "Surveyor 3": [

        {
            kicker: "1967",
            title: "Landing Before Apollo",
            text: "Surveyor 3 softly landed on the Moon on April 20, 1967. Its mission was to study the lunar surface and determine whether the terrain could support future crewed lunar missions."
        },

        {
            kicker: "THE HARDWARE",
            title: "A Robot Built for the Moon",
            text: "Surveyor 3 carried a television camera, a surface sampler, and scientific instruments designed to investigate the lunar soil directly."
        },

        {
            kicker: "6,326 IMAGES",
            title: "Seeing the Lunar Surface",
            text: "The spacecraft returned 6,326 television pictures. These observations helped scientists understand the surface conditions that future astronauts would encounter."
        },

        {
            kicker: "APOLLO 12",
            title: "Humans Returned to the Robot",
            text: "Two years later, Apollo 12 astronauts landed nearby and visited Surveyor 3. They recovered its television camera and other components for examination on Earth."
        },

        {
            kicker: "THE LEGACY",
            title: "A Machine That Became Evidence",
            text: "Surveyor 3 became more than a spacecraft that completed a mission. Its hardware became physical evidence that could be examined by humans after spending years on another world."
        }

    ],


    "Apollo 15": [

        {
            kicker: "J-TYPE MISSION",
            title: "Going Further",
            text: "Apollo 15 was the first of the longer J-type Apollo missions. It expanded the scientific and operational capability of lunar surface exploration."
        },

        {
            kicker: "MOBILITY",
            title: "The Lunar Roving Vehicle",
            text: "Apollo 15 deployed the Lunar Roving Vehicle, giving astronauts much greater mobility across the lunar surface."
        },

        {
            kicker: "SCIENCE",
            title: "Hadley-Apennine",
            text: "The crew explored the Hadley-Apennine region, collecting geological observations and samples while deploying scientific equipment."
        },

        {
            kicker: "HARDWARE LEFT BEHIND",
            title: "ALSEP",
            text: "The Apollo Lunar Surface Experiments Package contained scientific instruments designed to continue collecting measurements after the astronauts departed."
        },

        {
            kicker: "LEGACY",
            title: "A More Capable Lunar Laboratory",
            text: "Apollo 15 demonstrated how increased mobility, longer surface operations, and scientific hardware could transform the scale of lunar exploration."
        }

    ],


    "Apollo 17": [

        {
            kicker: "THE FINAL APOLLO",
            title: "The Last Lunar Landing",
            text: "Apollo 17 was the final Apollo mission to land humans on the Moon. It combined extended surface operations with a substantial scientific program."
        },

        {
            kicker: "TAURUS-LITTROW",
            title: "A Geological Expedition",
            text: "The crew explored the Taurus-Littrow valley, investigating the lunar terrain and collecting geological samples."
        },

        {
            kicker: "MOBILITY",
            title: "The Lunar Roving Vehicle",
            text: "The Lunar Roving Vehicle allowed the astronauts to travel much farther from the Lunar Module than earlier missions could."
        },

        {
            kicker: "SCIENCE",
            title: "A Long Scientific Record",
            text: "Scientific instruments left on the lunar surface extended measurements beyond the period when the astronauts were physically present."
        },

        {
            kicker: "THE END OF AN ERA",
            title: "Hardware Remains",
            text: "When Apollo 17 left the Moon, the final crewed lunar landing site became another location containing the hardware of human exploration."
        }

    ],


    "Ranger 7": [

        {
            kicker: "1964",
            title: "Ranger 7",
            text: "Ranger 7 was a NASA robotic lunar mission designed to obtain high-resolution photographs of the Moon before impact."
        },

        {
            kicker: "THE CAMERA SYSTEM",
            title: "Seeing the Moon Up Close",
            text: "The spacecraft carried television cameras that transmitted increasingly detailed images as it approached the lunar surface."
        },

        {
            kicker: "IMPACT",
            title: "A Mission Measured in Images",
            text: "Ranger 7 successfully returned thousands of photographs before impacting the lunar surface."
        },

        {
            kicker: "WHY IT MATTERED",
            title: "Preparing for Lunar Exploration",
            text: "The photographs provided important information about the lunar terrain and supported later lunar exploration planning."
        },

        {
            kicker: "LEGACY",
            title: "The First Close Look",
            text: "Ranger 7 became an important step in the progression of robotic lunar exploration."
        }

    ],


    "Lunar Orbiter 5": [

        {
            kicker: "1967",
            title: "Mapping the Moon",
            text: "Lunar Orbiter 5 was part of NASA's Lunar Orbiter program, which photographed and mapped large areas of the lunar surface."
        },

        {
            kicker: "THE MISSION",
            title: "A Camera in Lunar Orbit",
            text: "The spacecraft operated from lunar orbit and captured photographs of the surface for scientific study and mission planning."
        },

        {
            kicker: "SURVEYING LANDING SITES",
            title: "Finding Places to Land",
            text: "Lunar Orbiter imagery helped identify and characterize potential landing areas for later crewed and robotic missions."
        },

        {
            kicker: "GLOBAL COVERAGE",
            title: "A Larger View of the Moon",
            text: "The Lunar Orbiter program expanded knowledge of the lunar surface beyond what could be observed from individual landing sites."
        },

        {
            kicker: "LEGACY",
            title: "The Moon From Above",
            text: "Lunar Orbiter 5 contributed to the growing photographic record of Earth's natural satellite."
        }

    ],


    "Surveyor 7": [

        {
            kicker: "1968",
            title: "Surveyor 7",
            text: "Surveyor 7 was the final spacecraft in NASA's Surveyor series. It landed in the lunar highlands and conducted detailed investigations of the surface."
        },

        {
            kicker: "THE ROBOT",
            title: "A Scientific Workstation",
            text: "Surveyor 7 carried imaging equipment and instruments designed to investigate the physical properties and composition of the lunar surface."
        },

        {
            kicker: "THE LANDING SITE",
            title: "Tycho Highlands",
            text: "The spacecraft landed near the Tycho crater, an area with geological characteristics different from the maria explored by several earlier Surveyor missions."
        },

        {
            kicker: "SCIENCE",
            title: "Studying Lunar Soil",
            text: "Measurements from Surveyor 7 contributed to understanding the lunar soil and surface environment."
        },

        {
            kicker: "LEGACY",
            title: "The Surveyor Program",
            text: "Surveyor 7 completed the Surveyor series' role in preparing knowledge for future lunar exploration."
        }

    ],


    "LCROSS": [

        {
            kicker: "2009",
            title: "LCROSS",
            text: "The Lunar Crater Observation and Sensing Satellite investigated a permanently shadowed region near the Moon's south pole."
        },

        {
            kicker: "THE IMPACT",
            title: "A Deliberate Collision",
            text: "LCROSS sent an impactor into a lunar crater while a following spacecraft observed the resulting debris plume."
        },

        {
            kicker: "THE SEARCH",
            title: "Looking for Water",
            text: "The mission was designed to investigate whether water and other volatile materials were present in the permanently shadowed lunar environment."
        },

        {
            kicker: "THE OBSERVATION",
            title: "Watching the Plume",
            text: "Instruments aboard the spacecraft observed the material released by the impact and analyzed its properties."
        },

        {
            kicker: "LEGACY",
            title: "Exploring the Lunar Poles",
            text: "LCROSS contributed to the growing scientific interest in lunar polar regions and their potentially valuable volatile resources."
        }

    ]

};


/* =========================================================
   DIALOGUE ELEMENTS
========================================================= */

let activeStory = null;

let storyIndex = 0;


const dialogueBox =
    document.getElementById("dialogueBox");

const dialogueBackdrop =
    document.getElementById("dialogueBackdrop");

const storyKicker =
    document.getElementById("storyKicker");

const storyTitle =
    document.getElementById("storyTitle");

const storyText =
    document.getElementById("storyText");

const storyCounter =
    document.getElementById("storyCounter");

const nextButton =
    document.getElementById("nextButton");

const closeButton =
    document.getElementById("closeButton");


/* =========================================================
   COORDINATES → MOON PIXEL
=========================================================

   Assumes moonImage is an equirectangular map:

   longitude:
       -180 = left
       +180 = right

   latitude:
       +90 = top
       -90 = bottom
========================================================= */

function coordinatesToPixel(
    latitude,
    longitude
) {

    const size =
        MOON_BASE_SIZE * zoom;


    const x =
        ((longitude + 180) / 360) * size;


    const y =
        ((90 - latitude) / 180) * size;


    return {
        x,
        y
    };

}


/* =========================================================
   UPDATE MOON
========================================================= */

function updateMoon() {

    if (!moonWorld) {
        return;
    }


    const size =
        MOON_BASE_SIZE * zoom;


    moonWorld.style.width =
        `${size}px`;

    moonWorld.style.height =
        `${size}px`;


    moonWorld.style.transform =
        `translate(
            calc(-50% + ${panX}px),
            calc(-50% + ${panY}px)
        )`;


    updateMarkers();

}


/* =========================================================
   CREATE MARKER
========================================================= */

function createLandingMarker(
    site
) {

    const marker =
        document.createElement("button");


    marker.type =
        "button";


    marker.className =
        "exhibit-spacecraft exhibit-landing";


    marker.setAttribute(
        "aria-label",
        site.name
    );


    /*
        NASA-style location sign.
    */

    const sign =
        document.createElement("div");


    sign.className =
        "landing-sign";


    const symbol =
        document.createElement("span");


    symbol.className =
        "landing-symbol";


    symbol.textContent =
        "◆";


    const name =
        document.createElement("span");


    name.className =
        "landing-name";


    name.textContent =
        site.name.toUpperCase();


    sign.appendChild(symbol);

    sign.appendChild(name);


    const pole =
        document.createElement("div");


    pole.className =
        "landing-pole";


    marker.appendChild(sign);

    marker.appendChild(pole);


    return marker;

}


/* =========================================================
   CREATE ORBITER
========================================================= */

function createOrbiterMarker(
    site
) {

    const marker =
        document.createElement("button");


    marker.type =
        "button";


    marker.className =
        "exhibit-spacecraft exhibit-orbiter";


    marker.setAttribute(
        "aria-label",
        site.name
    );


    const image =
        document.createElement("img");


    image.src =
        spacecraftImages[
            site.name
        ];


    image.alt =
        site.name;


    image.draggable =
        false;


    image.onerror =
        () => {

            console.error(
                "Spacecraft image not found:",
                image.src
            );

        };


    const label =
        document.createElement("span");


    label.className =
        "exhibit-label";


    label.textContent =
        site.name.toUpperCase();


    marker.appendChild(image);

    marker.appendChild(label);


    return marker;

}


/* =========================================================
   CREATE ALL LUNAR MARKERS
========================================================= */

function createLunarMarkers() {

    if (!spacecraftLayer) {
        return;
    }


    spacecraftLayer.innerHTML = "";


    lunarSites.forEach(
        site => {

            let marker;


            /*
                Orbiting spacecraft:
                use actual spacecraft image.
            */

            if (
                site.type === "orbited"
            ) {

                marker =
                    createOrbiterMarker(
                        site
                    );

            }


            /*
                Landed / impact missions:
                use location marker.
            */

            else {

                marker =
                    createLandingMarker(
                        site
                    );

            }


            /*
                Prevent map dragging when
                interacting with marker.
            */

            marker.addEventListener(
                "pointerdown",
                event => {

                    event.stopPropagation();

                }
            );


            marker.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openStory(
                        site.name
                    );

                }
            );


            spacecraftLayer.appendChild(
                marker
            );

        }
    );


    updateMarkers();

}


/* =========================================================
   POSITION MARKERS
========================================================= */

function updateMarkers() {

    if (!spacecraftLayer) {
        return;
    }


    const size =
        MOON_BASE_SIZE * zoom;


    const mapWidth =
        planetMap.clientWidth;

    const mapHeight =
        planetMap.clientHeight;


    const moonLeft =
        mapWidth / 2
        -
        size / 2
        +
        panX;


    const moonTop =
        mapHeight / 2
        -
        size / 2
        +
        panY;


    const markers =
        spacecraftLayer.querySelectorAll(
            ".exhibit-spacecraft"
        );


    lunarSites.forEach(
        (site, index) => {

            const marker =
                markers[index];


            if (!marker) {
                return;
            }


            const point =
                coordinatesToPixel(
                    site.latitude,
                    site.longitude
                );


            /*
                Visual adjustment only.

                This does NOT alter the
                real latitude/longitude.
            */

            const offset =
                site.displayOffset || {
                    x: 0,
                    y: 0
                };


            marker.style.left =
                `${
                    moonLeft
                    +
                    point.x
                    +
                    offset.x
                }px`;


            marker.style.top =
                `${
                    moonTop
                    +
                    point.y
                    +
                    offset.y
                }px`;

        }
    );

}


/* =========================================================
   ZOOM
========================================================= */

function setZoom(
    newZoom,
    mouseX =
        planetMap.clientWidth / 2,
    mouseY =
        planetMap.clientHeight / 2
) {

    const oldZoom =
        zoom;


    zoom =
        Math.max(
            MOON_MIN_ZOOM,
            Math.min(
                MOON_MAX_ZOOM,
                newZoom
            )
        );


    if (
        zoom === oldZoom
    ) {
        return;
    }


    const rect =
        planetMap.getBoundingClientRect();


    const centerX =
        rect.width / 2;

    const centerY =
        rect.height / 2;


    /*
        World coordinate under mouse.
    */

    const worldX =
        (
            mouseX
            -
            centerX
            -
            panX
        )
        /
        oldZoom;


    const worldY =
        (
            mouseY
            -
            centerY
            -
            panY
        )
        /
        oldZoom;


    /*
        Keep mouse position stable
        while zooming.
    */

    panX =
        mouseX
        -
        centerX
        -
        worldX * zoom;


    panY =
        mouseY
        -
        centerY
        -
        worldY * zoom;


    updateMoon();

}


/* =========================================================
   POINTER DRAG
========================================================= */

planetMap.addEventListener(
    "pointerdown",
    event => {

        if (
            event.pointerType === "mouse"
            &&
            event.button !== 0
        ) {

            return;

        }


        /*
            Don't drag when clicking
            spacecraft markers.
        */

        if (
            event.target.closest(
                ".exhibit-spacecraft"
            )
        ) {

            return;

        }


        isDragging = true;


        dragStartX =
            event.clientX;

        dragStartY =
            event.clientY;


        startPanX =
            panX;

        startPanY =
            panY;


        planetMap.classList.add(
            "dragging"
        );


        try {

            planetMap.setPointerCapture(
                event.pointerId
            );

        } catch (error) {}

    }
);


planetMap.addEventListener(
    "pointermove",
    event => {

        if (!isDragging) {
            return;
        }


        panX =
            startPanX
            +
            event.clientX
            -
            dragStartX;


        panY =
            startPanY
            +
            event.clientY
            -
            dragStartY;


        updateMoon();

    }
);


planetMap.addEventListener(
    "pointerup",
    stopDragging
);


planetMap.addEventListener(
    "pointercancel",
    stopDragging
);


function stopDragging(
    event
) {

    if (!isDragging) {
        return;
    }


    isDragging = false;


    planetMap.classList.remove(
        "dragging"
    );


    try {

        planetMap.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {}

}


/* =========================================================
   WHEEL ZOOM
========================================================= */

planetMap.addEventListener(
    "wheel",
    event => {

        event.preventDefault();


        const rect =
            planetMap.getBoundingClientRect();


        const mouseX =
            event.clientX -
            rect.left;


        const mouseY =
            event.clientY -
            rect.top;


        const zoomFactor =
            event.deltaY < 0
                ? 1.15
                : 1 / 1.15;


        setZoom(
            zoom * zoomFactor,
            mouseX,
            mouseY
        );

    },
    {
        passive: false
    }
);


/* =========================================================
   TOUCH PINCH
========================================================= */

let touchStartDistance = 0;

let touchStartZoom = 1;


planetMap.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length === 2
        ) {

            touchStartDistance =
                getTouchDistance(
                    event.touches[0],
                    event.touches[1]
                );


            touchStartZoom =
                zoom;

        }

    },
    {
        passive: false
    }
);


planetMap.addEventListener(
    "touchmove",
    event => {

        if (
            event.touches.length !== 2
        ) {

            return;

        }


        event.preventDefault();


        const distance =
            getTouchDistance(
                event.touches[0],
                event.touches[1]
            );


        if (
            touchStartDistance <= 0
        ) {

            return;

        }


        const ratio =
            distance /
            touchStartDistance;


        const rect =
            planetMap.getBoundingClientRect();


        const centerX =
            (
                event.touches[0].clientX
                +
                event.touches[1].clientX
            ) / 2
            -
            rect.left;


        const centerY =
            (
                event.touches[0].clientY
                +
                event.touches[1].clientY
            ) / 2
            -
            rect.top;


        setZoom(
            touchStartZoom * ratio,
            centerX,
            centerY
        );

    },
    {
        passive: false
    }
);


planetMap.addEventListener(
    "touchend",
    event => {

        if (
            event.touches.length < 2
        ) {

            touchStartDistance = 0;

        }

    }
);


function getTouchDistance(
    touch1,
    touch2
) {

    const dx =
        touch1.clientX -
        touch2.clientX;


    const dy =
        touch1.clientY -
        touch2.clientY;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =========================================================
   DOUBLE CLICK ZOOM
========================================================= */

planetMap.addEventListener(
    "dblclick",
    event => {

        if (
            event.target.closest(
                ".exhibit-spacecraft"
            )
        ) {

            return;

        }


        const rect =
            planetMap.getBoundingClientRect();


        setZoom(
            zoom < 2
                ? zoom * 2
                : zoom / 2,

            event.clientX -
                rect.left,

            event.clientY -
                rect.top
        );

    }
);


/* =========================================================
   STORY
========================================================= */

function openStory(
    name
) {

    activeStory =
        stories[name];


    if (!activeStory) {

        console.warn(
            "No story found:",
            name
        );

        return;

    }


    storyIndex = 0;


    updateStory();


    dialogueBackdrop.classList.add(
        "open"
    );


    dialogueBox.classList.add(
        "open"
    );

}


/* =========================================================
   UPDATE STORY
========================================================= */

function updateStory() {

    if (!activeStory) {
        return;
    }


    const story =
        activeStory[
            storyIndex
        ];


    storyKicker.textContent =
        story.kicker;


    storyTitle.textContent =
        story.title;


    storyText.textContent =
        story.text;


    storyCounter.textContent =

        `${String(
            storyIndex + 1
        ).padStart(2, "0")} / ` +

        `${String(
            activeStory.length
        ).padStart(2, "0")}`;


    const isLast =
        storyIndex >=
        activeStory.length - 1;


    nextButton.style.opacity =
        isLast
            ? ".35"
            : "1";

}


/* =========================================================
   CLOSE DIALOGUE
========================================================= */

function closeDialogue() {

    dialogueBackdrop.classList.remove(
        "open"
    );


    dialogueBox.classList.remove(
        "open"
    );


    activeStory = null;

}


/* =========================================================
   NEXT STORY
========================================================= */

function nextStory() {

    if (!activeStory) {
        return;
    }


    if (
        storyIndex <
        activeStory.length - 1
    ) {

        storyIndex++;

        updateStory();

    }

}


/* =========================================================
   PREVIOUS STORY
========================================================= */

function previousStory() {

    if (!activeStory) {
        return;
    }


    if (
        storyIndex > 0
    ) {

        storyIndex--;

        updateStory();

    }

}


/* =========================================================
   DIALOGUE EVENTS
========================================================= */

if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeDialogue
    );

}


if (dialogueBackdrop) {

    dialogueBackdrop.addEventListener(
        "click",
        closeDialogue
    );

}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        nextStory
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeDialogue();

            return;

        }


        if (
            !dialogueBox.classList.contains(
                "open"
            )
        ) {

            return;

        }


        if (
            event.key === "ArrowRight"
        ) {

            nextStory();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            previousStory();

        }

    }
);


/* =========================================================
   HOME
========================================================= */

const homeButton =
    document.getElementById(
        "exhibitionHome"
    );


if (homeButton) {

    homeButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "../Space/space.html";

        }
    );

}


/* =========================================================
   MOON IMAGE
========================================================= */

if (moonImage) {

    moonImage.addEventListener(
        "load",
        () => {

            console.log(
                "Moon image loaded:",
                moonImage.src
            );

            updateMoon();

        }
    );


    moonImage.addEventListener(
        "error",
        () => {

            console.error(
                "Moon image could not be loaded:"
            );

            console.error(
                moonImage.src
            );

        }
    );

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        updateMoon();

    }
);


/* =========================================================
   START
========================================================= */

createLunarMarkers();

updateMoon();
