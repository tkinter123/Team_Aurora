/* =========================================================
   NASA LUNAR SPACE MUSEUM
   Team Aurora — NASA Space Apps Challenge 2026

   moon.js

   CLEAN RESET VERSION
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const MAP_WIDTH = 4096;
const MAP_HEIGHT = 2048;

const MIN_ZOOM_MULTIPLIER = 1.4;

const IMAGE_ROTATION_TIME = 3500;

const STORY_EXIT_TIME = 250;

const STORY_ENTER_TIME = 450;


/* =========================================================
   MAP STATE
========================================================= */

const state = {

    zoom: 1,

    minZoom: 0.35,

    maxZoom: 4,

    posX: 0,

    posY: 0,

    dragging: false,

    dragStartX: 0,

    dragStartY: 0,

    startPosX: 0,

    startPosY: 0,

    timelineYear: 2009,

    playing: false,

    playTimer: null

};


/* =========================================================
   STORY STATE
========================================================= */

let currentMission = null;

let currentSlide = 0;

let currentImage = 0;

let imageTimer = null;

let storyAnimating = false;

let storyVoice = null;

let storyVoices = [];

let touchStartX = 0;

let touchStartY = 0;


/* =========================================================
   DOM
========================================================= */

const mapContainer =
    document.getElementById(
        "moonMap"
    );

const mapViewport =
    document.getElementById(
        "moonMapViewport"
    );

const mapLayer =
    document.getElementById(
        "moonMapLayer"
    );

const moonSurfaceImage =
    document.getElementById(
        "moonSurfaceImage"
    );

const hardwareLayer =
    document.getElementById(
        "hardwareLayer"
    );

const zoomInButton =
    document.getElementById(
        "zoomIn"
    );

const zoomOutButton =
    document.getElementById(
        "zoomOut"
    );

const zoomValue =
    document.getElementById(
        "zoomValue"
    );

const homeButton =
    document.getElementById(
        "homeButton"
    );

const miniMapCanvas =
    document.getElementById(
        "miniMapCanvas"
    );

const mapStatus =
    document.getElementById(
        "mapStatus"
    );


/* =========================================================
   STORY DOM
========================================================= */

const storyOverlay =
    document.getElementById(
        "storyOverlay"
    );

const storyPanel =
    document.getElementById(
        "storyPanel"
    );

const storyClose =
    document.getElementById(
        "storyClose"
    );

const storyImage =
    document.getElementById(
        "storyImage"
    );

const storyGreeting =
    document.getElementById(
        "storyGreeting"
    );

const storyTitle =
    document.getElementById(
        "storyTitle"
    );

const storyMeta =
    document.getElementById(
        "storyMeta"
    );

const storyText =
    document.getElementById(
        "storyText"
    );

const storyScienceList =
    document.getElementById(
        "storyScienceList"
    );

const storyLocation =
    document.getElementById(
        "storyLocation"
    );

const storyStatus =
    document.getElementById(
        "storyStatus"
    );

const storySource =
    document.getElementById(
        "storySource"
    );


/* =========================================================
   TIMELINE DOM
========================================================= */

const timelineYear =
    document.getElementById(
        "timelineYear"
    );

const timelineRange =
    document.getElementById(
        "timelineRange"
    );

const timelineProgress =
    document.getElementById(
        "timelineProgress"
    );

const timelineCursor =
    document.getElementById(
        "timelineCursor"
    );

const timelineEvents =
    document.getElementById(
        "timelineEvents"
    );

const timelinePlay =
    document.getElementById(
        "timelinePlay"
    );


/* =========================================================
   DATA
========================================================= */

function getAllMissions() {

    /*
     * Your current moon_data.js should expose
     * one of these common variable names.
     */

    if (
        typeof moonMissions !== "undefined" &&
        Array.isArray(moonMissions)
    ) {

        return moonMissions;

    }

    if (
        typeof moonData !== "undefined" &&
        Array.isArray(moonData)
    ) {

        return moonData;

    }

    if (
        typeof MOON_DATA !== "undefined" &&
        Array.isArray(MOON_DATA)
    ) {

        return MOON_DATA;

    }

    if (
        typeof missions !== "undefined" &&
        Array.isArray(missions)
    ) {

        return missions;

    }

    console.error(
        "NASA lunar mission data not found."
    );

    return [];

}


/* =========================================================
   MAPPABLE MISSIONS
========================================================= */

function getMappableMissions() {

    return getAllMissions().filter(
        mission => {

            if (
                mission.archiveOnly === true
            ) {

                return false;

            }

            const latitude =
                Number(
                    mission.latitude
                );

            const longitude =
                Number(
                    mission.longitude
                );

            return (
                Number.isFinite(latitude) &&
                Number.isFinite(longitude) &&
                latitude >= -90 &&
                latitude <= 90 &&
                longitude >= -180 &&
                longitude <= 180
            );

        }
    );

}


/* =========================================================
   FIND MISSION
========================================================= */

function getMissionById(id) {

    return getAllMissions().find(
        mission =>
            String(mission.id) ===
            String(id)
    );

}


/* =========================================================
   MAP DIMENSIONS
========================================================= */

function initializeMapDimensions() {

    if (!mapLayer) {
        return;
    }

    mapLayer.style.width =
        `${MAP_WIDTH}px`;

    mapLayer.style.height =
        `${MAP_HEIGHT}px`;

}


/* =========================================================
   FIT ZOOM
========================================================= */

function calculateFitZoom() {

    if (!mapViewport) {
        return 0.35;
    }

    const width =
        mapViewport.clientWidth;

    const height =
        mapViewport.clientHeight;

    if (
        width <= 0 ||
        height <= 0
    ) {

        return 0.35;

    }

    return Math.min(
        width / MAP_WIDTH,
        height / MAP_HEIGHT
    );

}


/* =========================================================
   RESET MAP
========================================================= */

function resetMapPosition() {

    const fitZoom =
        calculateFitZoom();

    /*
     * 140% minimum zoom.
     */

    state.minZoom =
        Math.max(
            fitZoom *
            MIN_ZOOM_MULTIPLIER,
            0.01
        );

    state.maxZoom =
        Math.max(
            4,
            state.minZoom * 4
        );

    state.zoom =
        state.minZoom;

    state.posX =
        0;

    state.posY =
        0;

    clampMapPosition();

    applyMapTransform();

    updateZoomDisplay();

    drawMiniMap();

}


/* =========================================================
   APPLY TRANSFORM
========================================================= */

function applyMapTransform() {

    if (!mapLayer) {
        return;
    }

    mapLayer.style.transform =
        `translate3d(
            calc(-50% + ${state.posX}px),
            calc(-50% + ${state.posY}px),
            0
        ) scale(${state.zoom})`;

}


/* =========================================================
   CLAMP
========================================================= */

function clampMapPosition() {

    if (!mapViewport) {
        return;
    }

    const viewportWidth =
        mapViewport.clientWidth;

    const viewportHeight =
        mapViewport.clientHeight;

    const scaledWidth =
        MAP_WIDTH * state.zoom;

    const scaledHeight =
        MAP_HEIGHT * state.zoom;

    const maxX =
        Math.max(
            0,
            (scaledWidth -
                viewportWidth) / 2
        );

    const maxY =
        Math.max(
            0,
            (scaledHeight -
                viewportHeight) / 2
        );

    state.posX =
        Math.max(
            -maxX,
            Math.min(
                maxX,
                state.posX
            )
        );

    state.posY =
        Math.max(
            -maxY,
            Math.min(
                maxY,
                state.posY
            )
        );

}


/* =========================================================
   ZOOM DISPLAY
========================================================= */

function updateZoomDisplay() {

    if (!zoomValue) {
        return;
    }

    const percentage =
        Math.round(
            (
                state.zoom /
                state.minZoom
            ) * 140
        );

    zoomValue.textContent =
        `${percentage}%`;

}


/* =========================================================
   ZOOM AT POINT
========================================================= */

function zoomAtPoint(
    clientX,
    clientY,
    factor
) {

    if (!mapViewport) {
        return;
    }

    const rect =
        mapViewport.getBoundingClientRect();

    const pointerX =
        clientX -
        rect.left -
        rect.width / 2;

    const pointerY =
        clientY -
        rect.top -
        rect.height / 2;

    const oldZoom =
        state.zoom;

    const newZoom =
        Math.max(
            state.minZoom,
            Math.min(
                state.maxZoom,
                oldZoom * factor
            )
        );

    if (
        Math.abs(
            newZoom -
            oldZoom
        ) < 0.00001
    ) {

        return;

    }

    const scale =
        newZoom /
        oldZoom;

    state.posX =
        pointerX -
        (
            pointerX -
            state.posX
        ) * scale;

    state.posY =
        pointerY -
        (
            pointerY -
            state.posY
        ) * scale;

    state.zoom =
        newZoom;

    clampMapPosition();

    applyMapTransform();

    updateZoomDisplay();

    drawMiniMap();

}


/* =========================================================
   WHEEL
========================================================= */

function handleWheel(event) {

    event.preventDefault();

    zoomAtPoint(
        event.clientX,
        event.clientY,
        event.deltaY < 0
            ? 1.15
            : 1 / 1.15
    );

}


/* =========================================================
   DRAG START
========================================================= */

function handlePointerDown(event) {

    if (
        event.target.closest(
            ".hardware-marker"
        )
    ) {

        return;

    }

    state.dragging =
        true;

    state.dragStartX =
        event.clientX;

    state.dragStartY =
        event.clientY;

    state.startPosX =
        state.posX;

    state.startPosY =
        state.posY;

    try {

        mapViewport.setPointerCapture(
            event.pointerId
        );

    } catch (error) {}

}


/* =========================================================
   DRAG MOVE
========================================================= */

function handlePointerMove(event) {

    if (!state.dragging) {
        return;
    }

    const dx =
        event.clientX -
        state.dragStartX;

    const dy =
        event.clientY -
        state.dragStartY;

    state.posX =
        state.startPosX + dx;

    state.posY =
        state.startPosY + dy;

    clampMapPosition();

    applyMapTransform();

    drawMiniMap();

}


/* =========================================================
   DRAG END
========================================================= */

function handlePointerUp(event) {

    state.dragging =
        false;

    try {

        mapViewport.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {}

}


/* =========================================================
   CATEGORY
========================================================= */

function getMarkerCategory(mission) {

    const status =
        String(
            mission.status || ""
        )
        .toLowerCase();

    if (
        status.includes("impact")
    ) {

        return "impacted";

    }

    if (
        status.includes("orbit")
    ) {

        return "orbital";

    }

    return "landed";

}


/* =========================================================
   NAME
========================================================= */

function getMissionName(mission) {

    return (
        mission.name ||
        mission.mission ||
        "NASA Hardware"
    );

}


/* =========================================================
   CREATE MARKER
========================================================= */

function createMarker(mission) {

    const marker =
        document.createElement(
            "button"
        );

    marker.type =
        "button";

    marker.className =
        "hardware-marker";

    marker.classList.add(
        getMarkerCategory(
            mission
        )
    );

    marker.dataset.missionId =
        mission.id;

    marker.setAttribute(
        "aria-label",
        `Investigate ${getMissionName(mission)}`
    );


    /*
     * Equirectangular mapping.
     */

    const latitude =
        Number(
            mission.latitude
        );

    const longitude =
        Number(
            mission.longitude
        );


    const x =
        (
            (longitude + 180) /
            360
        ) * 100;

    const y =
        (
            (90 - latitude) /
            180
        ) * 100;


    marker.style.left =
        `${x}%`;

    marker.style.top =
        `${y}%`;


    /*
     * DOT
     */

    const dot =
        document.createElement(
            "span"
        );

    dot.className =
        "hardware-dot";


    /*
     * LABEL
     */

    const label =
        document.createElement(
            "span"
        );

    label.className =
        "hardware-label";

    label.textContent =
        getMissionName(
            mission
        );


    marker.appendChild(
        dot
    );

    marker.appendChild(
        label
    );


    /*
     * OPEN STORY
     */

    marker.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openMissionStory(
                mission
            );

        }
    );


    return marker;

}


/* =========================================================
   RENDER MARKERS
========================================================= */

function renderMarkers() {

    if (!hardwareLayer) {

        console.error(
            "#hardwareLayer not found."
        );

        return;

    }

    hardwareLayer.innerHTML =
        "";

    const missions =
        getMappableMissions();

    missions.forEach(
        mission => {

            hardwareLayer.appendChild(
                createMarker(
                    mission
                )
            );

        }
    );

    updateMarkerVisibility();

    updateMapStatus();

    console.log(
        "Lunar hardware markers:",
        missions.length
    );

}


/* =========================================================
   MARKER VISIBILITY
========================================================= */

function updateMarkerVisibility() {

    if (!hardwareLayer) {
        return;
    }

    const markers =
        hardwareLayer.querySelectorAll(
            ".hardware-marker"
        );

    markers.forEach(
        marker => {

            const mission =
                getMissionById(
                    marker.dataset.missionId
                );

            if (!mission) {
                return;
            }

            const visible =
                Number(
                    mission.year
                ) <=
                Number(
                    state.timelineYear
                );

            marker.classList.toggle(
                "timeline-hidden",
                !visible
            );

        }
    );

}


/* =========================================================
   MAP STATUS
========================================================= */

function updateMapStatus() {

    if (!mapStatus) {
        return;
    }

    const count =
        getMappableMissions()
            .filter(
                mission =>
                    Number(
                        mission.year
                    ) <=
                    Number(
                        state.timelineYear
                    )
            )
            .length;

    mapStatus.textContent =
        `${count} hardware sites`;

}


/* =========================================================
   TIMELINE
========================================================= */

function renderTimeline() {

    if (!timelineRange) {
        return;
    }

    const missions =
        getAllMissions()
            .filter(
                mission =>
                    Number.isFinite(
                        Number(
                            mission.year
                        )
                    )
            )
            .sort(
                (a, b) =>
                    Number(a.year) -
                    Number(b.year)
            );


    if (!missions.length) {

        return;

    }


    const years =
        missions.map(
            mission =>
                Number(
                    mission.year
                )
        );


    const minYear =
        Math.min(
            ...years
        );

    const maxYear =
        Math.max(
            ...years
        );


    timelineRange.min =
        String(minYear);

    timelineRange.max =
        String(maxYear);

    timelineRange.value =
        String(maxYear);


    state.timelineYear =
        maxYear;


    if (timelineYear) {

        timelineYear.textContent =
            String(maxYear);

    }


    if (!timelineEvents) {
        return;
    }


    timelineEvents.innerHTML =
        "";


    missions.forEach(
        mission => {

            const year =
                Number(
                    mission.year
                );

            const percentage =
                (
                    (year - minYear) /
                    Math.max(
                        1,
                        maxYear - minYear
                    )
                ) * 100;


            const event =
                document.createElement(
                    "button"
                );

            event.type =
                "button";

            event.className =
                "timeline-event";

            event.style.left =
                `${percentage}%`;

            event.title =
                `${getMissionName(mission)} — ${year}`;

            event.setAttribute(
                "aria-label",
                `${getMissionName(mission)}, ${year}`
            );


            event.addEventListener(
                "click",
                () => {

                    timelineRange.value =
                        String(year);

                    updateTimeline();

                }
            );


            timelineEvents.appendChild(
                event
            );

        }
    );


    updateTimeline();

}


/* =========================================================
   UPDATE TIMELINE
========================================================= */

function updateTimeline() {

    if (!timelineRange) {
        return;
    }

    const min =
        Number(
            timelineRange.min
        );

    const max =
        Number(
            timelineRange.max
        );

    const year =
        Number(
            timelineRange.value
        );


    state.timelineYear =
        year;


    const percentage =
        (
            (year - min) /
            Math.max(
                1,
                max - min
            )
        ) * 100;


    if (timelineYear) {

        timelineYear.textContent =
            String(year);

    }


    if (timelineProgress) {

        timelineProgress.style.width =
            `${percentage}%`;

    }


    if (timelineCursor) {

        timelineCursor.style.left =
            `${percentage}%`;

    }


    updateMarkerVisibility();

    updateMapStatus();

    drawMiniMap();

}


/* =========================================================
   TIMELINE SETUP
========================================================= */

function setupTimeline() {

    if (timelineRange) {

        timelineRange.addEventListener(
            "input",
            updateTimeline
        );

    }


    if (timelinePlay) {

        timelinePlay.addEventListener(
            "click",
            toggleTimelinePlayback
        );

    }

}


/* =========================================================
   TIMELINE PLAY
========================================================= */

function toggleTimelinePlayback() {

    if (
        state.playing
    ) {

        stopTimelinePlayback();

    } else {

        startTimelinePlayback();

    }

}


/* =========================================================
   START PLAYBACK
========================================================= */

function startTimelinePlayback() {

    if (!timelineRange) {
        return;
    }

    state.playing =
        true;

    if (timelinePlay) {

        timelinePlay.textContent =
            "❚❚";

    }


    state.playTimer =
        setInterval(
            () => {

                let year =
                    Number(
                        timelineRange.value
                    );

                const max =
                    Number(
                        timelineRange.max
                    );

                year++;


                if (
                    year > max
                ) {

                    stopTimelinePlayback();

                    return;

                }


                timelineRange.value =
                    String(year);

                updateTimeline();

            },
            550
        );

}


/* =========================================================
   STOP PLAYBACK
========================================================= */

function stopTimelinePlayback() {

    state.playing =
        false;

    if (state.playTimer) {

        clearInterval(
            state.playTimer
        );

        state.playTimer =
            null;

    }

    if (timelinePlay) {

        timelinePlay.textContent =
            "▶";

    }

}


/* =========================================================
   MINI MAP
========================================================= */

function drawMiniMap() {

    if (!miniMapCanvas) {
        return;
    }

    const ctx =
        miniMapCanvas.getContext(
            "2d"
        );

    if (!ctx) {
        return;
    }


    const width =
        miniMapCanvas.width;

    const height =
        miniMapCanvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
     * Background.
     */

    ctx.fillStyle =
        "#05070d";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * Moon image.
     */

    if (
        moonSurfaceImage &&
        moonSurfaceImage.complete &&
        moonSurfaceImage.naturalWidth
    ) {

        try {

            ctx.globalAlpha =
                0.62;

            ctx.drawImage(
                moonSurfaceImage,
                0,
                0,
                width,
                height
            );

            ctx.globalAlpha =
                1;

        } catch (error) {

            console.warn(
                "Mini-map image error:",
                error
            );

        }

    }


    /*
     * Hardware.
     */

    getMappableMissions()
        .forEach(
            mission => {

                if (
                    Number(
                        mission.year
                    ) >
                    Number(
                        state.timelineYear
                    )
                ) {

                    return;

                }


                const x =
                    (
                        (
                            Number(
                                mission.longitude
                            ) + 180
                        ) / 360
                    ) * width;


                const y =
                    (
                        (
                            90 -
                            Number(
                                mission.latitude
                            )
                        ) / 180
                    ) * height;


                const category =
                    getMarkerCategory(
                        mission
                    );


                if (
                    category ===
                    "impacted"
                ) {

                    ctx.fillStyle =
                        "#ff4545";

                } else if (
                    category ===
                    "orbital"
                ) {

                    ctx.fillStyle =
                        "#ffd84d";

                } else {

                    ctx.fillStyle =
                        "#39ff88";

                }


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    4,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }
        );


    /*
     * Viewport.
     */

    const viewport =
        calculateMiniViewport();


    if (viewport) {

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth =
            2;

        ctx.strokeRect(
            viewport.x,
            viewport.y,
            viewport.width,
            viewport.height
        );

    }

}


/* =========================================================
   MINI VIEWPORT
========================================================= */

function calculateMiniViewport() {

    if (!mapViewport) {
        return null;
    }

    const viewportWidth =
        mapViewport.clientWidth;

    const viewportHeight =
        mapViewport.clientHeight;


    const visibleWorldWidth =
        viewportWidth /
        state.zoom;

    const visibleWorldHeight =
        viewportHeight /
        state.zoom;


    const centerX =
        MAP_WIDTH / 2 -
        state.posX /
        state.zoom;

    const centerY =
        MAP_HEIGHT / 2 -
        state.posY /
        state.zoom;


    return {

        x:
            (
                centerX -
                visibleWorldWidth / 2
            ) /
            MAP_WIDTH *
            miniMapCanvas.width,

        y:
            (
                centerY -
                visibleWorldHeight / 2
            ) /
            MAP_HEIGHT *
            miniMapCanvas.height,

        width:
            visibleWorldWidth /
            MAP_WIDTH *
            miniMapCanvas.width,

        height:
            visibleWorldHeight /
            MAP_HEIGHT *
            miniMapCanvas.height

    };

}


/* =========================================================
   MINI MAP CLICK
========================================================= */

function handleMiniMapClick(event) {

    if (!miniMapCanvas) {
        return;
    }

    const rect =
        miniMapCanvas.getBoundingClientRect();


    const x =
        (
            event.clientX -
            rect.left
        ) /
        rect.width;


    const y =
        (
            event.clientY -
            rect.top
        ) /
        rect.height;


    const worldX =
        x * MAP_WIDTH;

    const worldY =
        y * MAP_HEIGHT;


    state.posX =
        (
            MAP_WIDTH / 2 -
            worldX
        ) * state.zoom;


    state.posY =
        (
            MAP_HEIGHT / 2 -
            worldY
        ) * state.zoom;


    clampMapPosition();

    applyMapTransform();

    drawMiniMap();

}


/* =========================================================
   MAP SETUP
========================================================= */

function setupMapInteractions() {

    if (!mapViewport) {
        return;
    }


    mapViewport.addEventListener(
        "wheel",
        handleWheel,
        {
            passive: false
        }
    );


    mapViewport.addEventListener(
        "pointerdown",
        handlePointerDown
    );


    mapViewport.addEventListener(
        "pointermove",
        handlePointerMove
    );


    mapViewport.addEventListener(
        "pointerup",
        handlePointerUp
    );


    mapViewport.addEventListener(
        "pointercancel",
        handlePointerUp
    );


    if (miniMapCanvas) {

        miniMapCanvas.addEventListener(
            "click",
            handleMiniMapClick
        );

    }


    if (zoomInButton) {

        zoomInButton.addEventListener(
            "click",
            () => {

                const rect =
                    mapViewport.getBoundingClientRect();

                zoomAtPoint(
                    rect.left +
                    rect.width / 2,

                    rect.top +
                    rect.height / 2,

                    1.25
                );

            }
        );

    }


    if (zoomOutButton) {

        zoomOutButton.addEventListener(
            "click",
            () => {

                const rect =
                    mapViewport.getBoundingClientRect();

                zoomAtPoint(
                    rect.left +
                    rect.width / 2,

                    rect.top +
                    rect.height / 2,

                    1 / 1.25
                );

            }
        );

    }

}


/* =========================================================
   HOME
========================================================= */

function setupHomeButton() {

    if (!homeButton) {
        return;
    }

    homeButton.addEventListener(
        "click",
        resetMapPosition
    );

}


/* =========================================================
   STORY SLIDES
========================================================= */

function getStorySlides(mission) {

    /*
     * Preferred format.
     */

    if (
        Array.isArray(
            mission.slides
        ) &&
        mission.slides.length
    ) {

        return mission.slides;

    }


    /*
     * Fallback.
     */

    return createFallbackSlides(
        mission
    );

}


/* =========================================================
   FALLBACK SLIDES
========================================================= */

function createFallbackSlides(mission) {

    const story =
        String(
            mission.story || ""
        ).trim();


    const images =
        mission.images ||
        (
            mission.image
                ? [mission.image]
                : []
        );


    if (!story) {

        return [
            {

                kicker:
                    "NASA ARCHIVE",

                title:
                    getMissionName(
                        mission
                    ),

                text:
                    "Mission archive record.",

                images

            }
        ];

    }


    const paragraphs =
        story
            .split(/\n+/)
            .map(
                item =>
                    item.trim()
            )
            .filter(Boolean);


    /*
     * Use paragraphs if available.
     */

    if (
        paragraphs.length >= 3
    ) {

        const max =
            5;

        const selected =
            paragraphs.slice(
                0,
                max
            );


        return selected.map(
            (text, index) => {

                return {

                    kicker:
                        index === 0
                            ? (
                                mission.greeting ||
                                "NASA ARCHIVE"
                            )
                            : "NASA ARCHIVE",

                    title:
                        index === 0
                            ? getMissionName(
                                mission
                            )
                            : `${getMissionName(mission)} — ${index + 1}`,

                    text,

                    images

                };

            }
        );

    }


    /*
     * Sentence fallback.
     */

    const sentences =
        story.split(
            /(?<=[.!?])\s+/
        );


    const chunks = [];

    let buffer = "";


    sentences.forEach(
        sentence => {

            buffer +=
                (
                    buffer
                        ? " "
                        : ""
                ) +
                sentence;


            if (
                buffer.length >= 330
            ) {

                chunks.push(
                    buffer
                );

                buffer =
                    "";

            }

        }
    );


    if (buffer) {

        chunks.push(
            buffer
        );

    }


    return chunks
        .slice(0, 5)
        .map(
            (text, index) => {

                return {

                    kicker:
                        index === 0
                            ? (
                                mission.greeting ||
                                "NASA ARCHIVE"
                            )
                            : "NASA ARCHIVE",

                    title:
                        index === 0
                            ? getMissionName(
                                mission
                            )
                            : `${getMissionName(mission)} — ${index + 1}`,

                    text,

                    images

                };

            }
        );

}


/* =========================================================
   SLIDE IMAGES
========================================================= */

function getSlideImages(
    mission,
    slide
) {

    if (
        slide &&
        Array.isArray(
            slide.images
        ) &&
        slide.images.length
    ) {

        return slide.images;

    }


    if (
        slide &&
        slide.image
    ) {

        return [
            slide.image
        ];

    }


    if (
        mission &&
        Array.isArray(
            mission.images
        ) &&
        mission.images.length
    ) {

        return mission.images;

    }


    if (
        mission &&
        mission.image
    ) {

        return [
            mission.image
        ];

    }


    return [];

}


/* =========================================================
   STORY CONTROLS
========================================================= */

function createStoryControls() {

    if (!storyPanel) {
        return;
    }


    if (
        document.getElementById(
            "missionStoryControls"
        )
    ) {

        return;

    }


    const controls =
        document.createElement(
            "div"
        );


    controls.id =
        "missionStoryControls";


    controls.innerHTML = `

        <button
            id="missionStoryBack"
            class="mission-story-arrow"
            type="button"
            aria-label="Previous story slide"
        >
            ←
        </button>

        <div
            id="missionStoryProgress"
            class="mission-story-progress"
        ></div>

        <button
            id="missionStoryNext"
            class="mission-story-arrow"
            type="button"
            aria-label="Next story slide"
        >
            →
        </button>

    `;


    storyPanel.appendChild(
        controls
    );


    document
        .getElementById(
            "missionStoryBack"
        )
        ?.addEventListener(
            "click",
            () =>
                changeMissionSlide(-1)
        );


    document
        .getElementById(
            "missionStoryNext"
        )
        ?.addEventListener(
            "click",
            () =>
                changeMissionSlide(1)
        );

}


/* =========================================================
   IMAGE INFORMATION
========================================================= */

function createImageInfo() {

    const imageWrap =
        storyPanel?.querySelector(
            ".story-image-wrap"
        );


    if (!imageWrap) {
        return;
    }


    if (
        document.getElementById(
            "missionImageInfo"
        )
    ) {

        return;

    }


    const info =
        document.createElement(
            "div"
        );


    info.id =
        "missionImageInfo";


    info.innerHTML = `

        <span id="missionImageCounter">
            1 / 1
        </span>

        <span id="missionImageTitle">
            NASA ARCHIVE
        </span>

    `;


    imageWrap.appendChild(
        info
    );

}


/* =========================================================
   UPDATE IMAGE
========================================================= */

function updateStoryImage() {

    if (
        !currentMission ||
        !storyImage
    ) {

        return;

    }


    const slides =
        getStorySlides(
            currentMission
        );


    const slide =
        slides[
            currentSlide
        ];


    const images =
        getSlideImages(
            currentMission,
            slide
        );


    if (!images.length) {

        storyImage.removeAttribute(
            "src"
        );

        return;

    }


    if (
        currentImage >=
        images.length
    ) {

        currentImage =
            0;

    }


    storyImage.src =
        images[
            currentImage
        ];


    storyImage.alt =
        `${getMissionName(currentMission)} NASA archive image`;


    const counter =
        document.getElementById(
            "missionImageCounter"
        );


    if (counter) {

        counter.textContent =
            `${currentImage + 1} / ${images.length}`;

    }


    const title =
        document.getElementById(
            "missionImageTitle"
        );


    if (title) {

        title.textContent =
            getMissionName(
                currentMission
            );

    }

}


/* =========================================================
   CHANGE IMAGE
========================================================= */

function changeMissionImage(
    direction
) {

    if (!currentMission) {
        return;
    }


    const slides =
        getStorySlides(
            currentMission
        );


    const slide =
        slides[
            currentSlide
        ];


    const images =
        getSlideImages(
            currentMission,
            slide
        );


    if (
        images.length <= 1
    ) {

        return;

    }


    currentImage +=
        direction;


    if (
        currentImage < 0
    ) {

        currentImage =
            images.length - 1;

    }


    if (
        currentImage >=
        images.length
    ) {

        currentImage =
            0;

    }


    updateStoryImage();

    restartImageTimer();

}


/* =========================================================
   IMAGE TIMER
========================================================= */

function stopImageTimer() {

    if (imageTimer) {

        clearInterval(
            imageTimer
        );

        imageTimer =
            null;

    }

}


/* =========================================================
   START IMAGE TIMER
========================================================= */

function restartImageTimer() {

    stopImageTimer();


    if (!currentMission) {
        return;
    }


    const slides =
        getStorySlides(
            currentMission
        );


    const slide =
        slides[
            currentSlide
        ];


    const images =
        getSlideImages(
            currentMission,
            slide
        );


    if (
        images.length <= 1
    ) {

        return;

    }


    imageTimer =
        setInterval(
            () => {

                changeMissionImage(
                    1
                );

            },
            IMAGE_ROTATION_TIME
        );

}


/* =========================================================
   UPDATE STORY PROGRESS
========================================================= */

function updateStoryProgress() {

    const progress =
        document.getElementById(
            "missionStoryProgress"
        );


    if (!progress) {
        return;
    }


    const slides =
        getStorySlides(
            currentMission
        );


    progress.innerHTML =
        "";


    slides.forEach(
        (_, index) => {

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "mission-story-progress-dot";


            if (
                index ===
                currentSlide
            ) {

                dot.classList.add(
                    "active"
                );

            }


            progress.appendChild(
                dot
            );

        }
    );

}


/* =========================================================
   UPDATE STORY ARROWS
========================================================= */

function updateStoryArrows() {

    const back =
        document.getElementById(
            "missionStoryBack"
        );

    const next =
        document.getElementById(
            "missionStoryNext"
        );


    if (
        !currentMission
    ) {

        return;

    }


    const slides =
        getStorySlides(
            currentMission
        );


    if (back) {

        back.disabled =
            currentSlide <= 0;

    }


    if (next) {

        const last =
            currentSlide >=
            slides.length - 1;


        next.textContent =
            last
                ? "×"
                : "→";


        next.setAttribute(
            "aria-label",
            last
                ? "Close mission story"
                : "Next story slide"
        );

    }

}


/* =========================================================
   UPDATE STORY
========================================================= */

function updateStoryContent() {

    if (!currentMission) {
        return;
    }


    const slides =
        getStorySlides(
            currentMission
        );


    const slide =
        slides[
            currentSlide
        ];


    if (!slide) {
        return;
    }


    /*
     * Greeting
     */

    if (storyGreeting) {

        storyGreeting.textContent =
            slide.kicker ||
            slide.greeting ||
            currentMission.greeting ||
            "NASA ARCHIVE";

    }


    /*
     * Title
     */

    if (storyTitle) {

        storyTitle.textContent =
            slide.title ||
            getMissionName(
                currentMission
            );

    }


    /*
     * Meta
     */

    if (storyMeta) {

        storyMeta.textContent =
            [
                "NASA MISSION",
                currentMission.year,
                currentMission.status
            ]
                .filter(Boolean)
                .join(" • ")
                .toUpperCase();

    }


    /*
     * Story
     */

    if (storyText) {

        storyText.textContent =
            slide.text ||
            slide.story ||
            "";

    }


    /*
     * Scientific contribution
     */

    if (storyScienceList) {

        storyScienceList.innerHTML =
            "";


        let science =
            slide.science ||
            slide.majorResults ||
            currentMission.majorResults ||
            [];


        if (
            typeof science ===
            "string"
        ) {

            science =
                [science];

        }


        if (
            Array.isArray(science)
        ) {

            science.forEach(
                item => {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent =
                        item;

                    storyScienceList.appendChild(
                        li
                    );

                }
            );

        }

    }


    /*
     * Coordinates
     */

    if (storyLocation) {

        const lat =
            Number(
                currentMission.latitude
            );

        const lon =
            Number(
                currentMission.longitude
            );


        if (
            Number.isFinite(lat) &&
            Number.isFinite(lon)
        ) {

            storyLocation.textContent =
                `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;

        } else {

            storyLocation.textContent =
                "Archive record — no lunar coordinates";

        }

    }


    /*
     * Status
     */

    if (storyStatus) {

        storyStatus.textContent =
            currentMission.status ||
            "ARCHIVE";

    }


    /*
     * NASA source
     */

    if (storySource) {

        if (
            currentMission.source
        ) {

            storySource.href =
                currentMission.source;

            storySource.style.display =
                "";

        } else {

            storySource.style.display =
                "none";

        }

    }


    updateStoryImage();

    updateStoryProgress();

    updateStoryArrows();

}


/* =========================================================
   VOICE
========================================================= */

function loadStoryVoices() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    storyVoices =
        window.speechSynthesis
            .getVoices();


    storyVoice =
        storyVoices.find(
            voice =>
                voice.name
                    .toLowerCase()
                    .includes(
                        "microsoft zira"
                    )
        ) ||
        storyVoices.find(
            voice =>
                voice.lang ===
                "en-US"
        ) ||
        storyVoices[0] ||
        null;

}


/* =========================================================
   STOP VOICE
========================================================= */

function stopStoryVoice() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }

}


/* =========================================================
   SPEAK CURRENT SLIDE
========================================================= */

function speakCurrentSlide() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    if (!currentMission) {
        return;
    }


    const slides =
        getStorySlides(
            currentMission
        );


    const slide =
        slides[
            currentSlide
        ];


    if (!slide) {
        return;
    }


    const text =
        [
            slide.kicker ||
            currentMission.greeting ||
            "",

            slide.title ||
            "",

            slide.text ||
            ""
        ]
            .filter(Boolean)
            .join(". ")
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    if (!text) {
        return;
    }


    stopStoryVoice();


    const utterance =
        new SpeechSynthesisUtterance(
            text
        );


    if (storyVoice) {

        utterance.voice =
            storyVoice;

    }


    utterance.rate =
        0.88;

    utterance.pitch =
        1.05;

    utterance.volume =
        1;

    utterance.lang =
        "en-US";


    setTimeout(
        () => {

            if (
                currentMission
            ) {

                window.speechSynthesis
                    .speak(
                        utterance
                    );

            }

        },
        150
    );

}


/* =========================================================
   OPEN STORY
========================================================= */

function openMissionStory(
    mission
) {

    if (
        !mission ||
        !storyOverlay
    ) {

        return;

    }


    currentMission =
        mission;

    currentSlide =
        0;

    currentImage =
        0;

    storyAnimating =
        false;


    createStoryControls();

    createImageInfo();

    stopStoryVoice();

    stopImageTimer();


    updateStoryContent();


    storyOverlay.classList.remove(
        "hidden"
    );


    requestAnimationFrame(
        () => {

            storyPanel?.classList.add(
                "active"
            );

        }
    );


    speakCurrentSlide();

    restartImageTimer();


    console.log(
        "Opened mission:",
        getMissionName(mission)
    );

}


/* =========================================================
   CLOSE STORY
========================================================= */

function closeMissionStory() {

    if (!storyOverlay) {
        return;
    }


    stopStoryVoice();

    stopImageTimer();


    storyOverlay.classList.add(
        "hidden"
    );


    storyPanel?.classList.remove(
        "active"
    );


    currentMission =
        null;

    currentSlide =
        0;

    currentImage =
        0;

}


/* =========================================================
   CHANGE SLIDE
========================================================= */

function changeMissionSlide(
    direction
) {

    if (
        !currentMission ||
        storyAnimating
    ) {

        return;

    }


    const slides =
        getStorySlides(
            currentMission
        );


    const newIndex =
        currentSlide +
        direction;


    /*
     * Previous
     */

    if (
        newIndex < 0
    ) {

        return;

    }


    /*
     * End of story
     */

    if (
        newIndex >=
        slides.length
    ) {

        closeMissionStory();

        return;

    }


    storyAnimating =
        true;


    stopStoryVoice();

    stopImageTimer();


    storyPanel?.classList.add(
        "story-slide-exit"
    );


    setTimeout(
        () => {

            currentSlide =
                newIndex;

            currentImage =
                0;


            updateStoryContent();


            storyPanel?.classList.remove(
                "story-slide-exit"
            );


            storyPanel?.classList.add(
                "story-slide-enter"
            );


            speakCurrentSlide();

            restartImageTimer();


            setTimeout(
                () => {

                    storyPanel?.classList.remove(
                        "story-slide-enter"
                    );

                    storyAnimating =
                        false;

                },
                STORY_ENTER_TIME
            );

        },
        STORY_EXIT_TIME
    );

}


/* =========================================================
   STORY TOUCH
========================================================= */

function setupStoryTouch() {

    if (!storyPanel) {
        return;
    }


    storyPanel.addEventListener(
        "touchstart",
        event => {

            if (
                !event.touches.length
            ) {

                return;

            }


            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    storyPanel.addEventListener(
        "touchend",
        event => {

            if (
                !event.changedTouches.length
            ) {

                return;

            }


            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;


            const dx =
                endX -
                touchStartX;

            const dy =
                endY -
                touchStartY;


            if (
                Math.abs(dx) < 45
            ) {

                return;

            }


            if (
                Math.abs(dx) <
                Math.abs(dy)
            ) {

                return;

            }


            if (
                dx < 0
            ) {

                changeMissionSlide(
                    1
                );

            } else {

                changeMissionSlide(
                    -1
                );

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

    if (!storyImage) {
        return;
    }


    let startX =
        0;


    storyImage.addEventListener(
        "touchstart",
        event => {

            if (
                event.touches.length
            ) {

                startX =
                    event.touches[0].clientX;

            }

        },
        {
            passive: true
        }
    );


    storyImage.addEventListener(
        "touchend",
        event => {

            if (
                !event.changedTouches.length
            ) {

                return;

            }


            const endX =
                event.changedTouches[0].clientX;


            const dx =
                endX -
                startX;


            if (
                Math.abs(dx) < 40
            ) {

                return;

            }


            changeMissionImage(
                dx < 0
                    ? 1
                    : -1
            );

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   STORY SYSTEM
========================================================= */

function setupStorySystem() {

    createStoryControls();

    createImageInfo();

    setupStoryTouch();

    setupImageTouch();


    if (storyClose) {

        storyClose.addEventListener(
            "click",
            closeMissionStory
        );

    }


    if (storyOverlay) {

        storyOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    storyOverlay
                ) {

                    closeMissionStory();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                !storyOverlay ||
                storyOverlay.classList.contains(
                    "hidden"
                )
            ) {

                return;

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                event.preventDefault();

                changeMissionSlide(
                    1
                );

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();

                changeMissionSlide(
                    -1
                );

            }


            if (
                event.key ===
                "Escape"
            ) {

                event.preventDefault();

                closeMissionStory();

            }

        }
    );


    if (
        "speechSynthesis" in window
    ) {

        loadStoryVoices();

        window.speechSynthesis
            .onvoiceschanged =
            loadStoryVoices;

    }

}


/* =========================================================
   RESIZE
========================================================= */

function handleResize() {

    const oldMin =
        state.minZoom;

    const ratio =
        oldMin > 0
            ? state.zoom /
              oldMin
            : 1;


    const fit =
        calculateFitZoom();


    state.minZoom =
        Math.max(
            fit *
            MIN_ZOOM_MULTIPLIER,
            0.01
        );


    state.maxZoom =
        Math.max(
            4,
            state.minZoom * 4
        );


    state.zoom =
        Math.max(
            state.minZoom,
            Math.min(
                state.maxZoom,
                state.minZoom *
                ratio
            )
        );


    clampMapPosition();

    applyMapTransform();

    updateZoomDisplay();

    drawMiniMap();

}


/* =========================================================
   VISIBILITY
========================================================= */

function setupVisibility() {

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                stopStoryVoice();

                stopImageTimer();

            } else if (
                currentMission
            ) {

                restartImageTimer();

            }

        }
    );

}


/* =========================================================
   MOON IMAGE
========================================================= */

function setupMoonImage() {

    if (!moonSurfaceImage) {
        return;
    }


    const refresh =
        () => {

            resetMapPosition();

            drawMiniMap();

        };


    if (
        moonSurfaceImage.complete
    ) {

        setTimeout(
            refresh,
            50
        );

    } else {

        moonSurfaceImage.addEventListener(
            "load",
            refresh,
            {
                once: true
            }
        );

    }

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeMoonMuseum() {

    console.log(
        "NASA Lunar Space Museum initializing..."
    );


    /*
     * Critical checks.
     */

    if (!mapContainer) {

        console.error(
            "Missing #moonMap"
        );

        return;

    }


    if (!mapViewport) {

        console.error(
            "Missing #moonMapViewport"
        );

        return;

    }


    if (!mapLayer) {

        console.error(
            "Missing #moonMapLayer"
        );

        return;

    }


    if (!hardwareLayer) {

        console.error(
            "Missing #hardwareLayer"
        );

        return;

    }


    /*
     * Map.
     */

    initializeMapDimensions();


    /*
     * IMPORTANT:
     *
     * Markers are rendered before the story
     * system. Therefore a story problem cannot
     * prevent the hardware from appearing.
     */

    renderMarkers();


    /*
     * Timeline.
     */

    renderTimeline();

    setupTimeline();


    /*
     * Map interactions.
     */

    setupMapInteractions();

    setupHomeButton();


    /*
     * Story.
     */

    setupStorySystem();

    setupVisibility();


    /*
     * Image.
     */

    setupMoonImage();


    /*
     * Initial map.
     */

    resetMapPosition();


    /*
     * Final refresh.
     */

    updateMarkerVisibility();

    updateMapStatus();

    drawMiniMap();


    console.log(
        "--------------------------------"
    );

    console.log(
        "NASA LUNAR SPACE MUSEUM READY"
    );

    console.log(
        "Total missions:",
        getAllMissions().length
    );

    console.log(
        "Mappable missions:",
        getMappableMissions().length
    );

    console.log(
        "--------------------------------"
    );

}


/* =========================================================
   EVENTS
========================================================= */

window.addEventListener(
    "resize",
    handleResize
);


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMoonMuseum
    );

} else {

    initializeMoonMuseum();

}
