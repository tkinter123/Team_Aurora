const MAP_WIDTH = 4096;
const MAP_HEIGHT = 2048;

const MIN_ZOOM_MULTIPLIER = 1;

const IMAGE_ROTATION_TIME = 3500;

const REDUCED_MOTION =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

const lunarArrivalStage =
    document.querySelector(".lunar-arrival");

if (lunarArrivalStage && REDUCED_MOTION) {

    document.body.classList.remove(
        "lunar-arrival-active"
    );

    lunarArrivalStage.remove();

} else if (lunarArrivalStage) {

    const finishLunarArrival =
        event => {

            if (
                event.animationName !==
                "lunarArrivalFade"
            ) {

                return;

            }

            document.body.classList.remove(
                "lunar-arrival-active"
            );

            lunarArrivalStage.remove();

        };

    lunarArrivalStage.addEventListener(
        "animationend",
        finishLunarArrival
    );

}

const STORY_EXIT_TIME =
    REDUCED_MOTION ? 0 : 250;

const STORY_ENTER_TIME =
    REDUCED_MOTION ? 0 : 360;

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

let currentMission = null;

const STORY_VOICE_ENABLED = false;

const pioneerStoryPages = [
    {
        text: "Hi! I’m Pioneer 1.\nI was America’s first spacecraft, launched just days after NASA was born.\nI was headed for the Moon.",
        image: "./moon_images/pioneer_1_launch.jpg",
        alt: "Pioneer 1 on its early lunar mission",
        catalog: "Pioneer 1"
    },
    {
        text: "On October 11, 1958, a Thor-Able rocket carried me toward the Moon.\nMy goal was to fly past it, study space, and send data home.",
        image: "./moon_images/pioneer_1_launch.jpg",
        alt: "Pioneer 1 launch atop a Thor-Able rocket",
        catalog: "Pioneer 1"
    },
    {
        text: "My rocket’s upper stage shut down too early.\nI climbed to about 114,750 kilometres—not far enough to reach the Moon.",
        image: "./moon_images/pioneer_1_launch.jpg",
        alt: "Pioneer 1 on its attempted journey toward the Moon",
        catalog: "Pioneer 1"
    },
    {
        text: "That was a record distance for the time.\nAlong the way, I confirmed the Van Allen radiation belts.\nI also studied space near Earth.",
        image: "./moon_images/Pioneer_1_Reconstructed_Replica.jpg",
        alt: "Reconstructed Pioneer 1 spacecraft",
        catalog: "Pioneer 1"
    },
    {
        text: "After about 43 hours, I fell back to Earth and burned up over the South Pacific.\nMy signal ended there.",
        image: "./moon_images/Pioneer_1_Reconstructed_Replica.jpg",
        alt: "Reconstructed Pioneer 1 spacecraft, part of early lunar exploration",
        catalog: "Pioneer 1"
    },
    {
        text: "I never touched the Moon.\nMy measurements and lessons helped clear the path for those that did.",
        image: "./moon_images/Pioneer_1_Reconstructed_Replica.jpg",
        alt: "Reconstructed Pioneer 1 spacecraft, part of early lunar exploration",
        catalog: "Pioneer 1"
    }
];

const pioneerStoryPagesBangla = [
    {
        title: "স্বাগতম",
        text: "হ্যালো! আমি পাইওনিয়ার ১। চাঁদে পৌঁছানোর জন্য আমেরিকার প্রথম প্রচেষ্টা ছিলাম আমি। আমার সাহসী, যদিও সংক্ষিপ্ত, যাত্রার গল্প শুনবে?",
        image: "./moon_images/pioneer_1_launch.jpg",
        alt: "পাইওনিয়ার ১-এর প্রাথমিক চন্দ্র অভিযান",
        catalog: "পাইওনিয়ার ১ — ভূমিকা"
    },
    {
        title: "উৎক্ষেপণ",
        text: "১৯৫৮ সালের ১১ অক্টোবরে, নাসা প্রতিষ্ঠার কিছুদিন পর আমাকে উৎক্ষেপণ করা হয়েছিল। থর-এবল রকেট আমাকে উচ্চে উঠিয়ে নিয়ে যায়।",
        image: "./moon_images/pioneer_1_launch.jpg",
        alt: "থর-এবল রকেটের ওপর পাইওনিয়ার ১",
        catalog: "পাইওনিয়ার ১ — উৎক্ষেপণ"
    },
    {
        title: "উচ্চ ascent ও সংক্ষিপ্ত পথ",
        text: "আমার রকেটের ওপরের ধাপ খুব তাড়াতাড়ি বন্ধ হয়ে যায়। আমি পৃথিবী থেকে প্রায় ১১৪,৭৫০ কিলোমিটার দূর পর্যন্ত উঠেছিলাম, তারপর ফিরে আসি।",
        image: "./moon_images/pioneer_1_launch.jpg",
        alt: "চাঁদের দিকে উঠছে পাইওনিয়ার ১",
        catalog: "পাইওনিয়ার ১ — পথ"
    },
    {
        title: "নীরব অবদান",
        text: "আমার যাত্রায় আমি বিকিরণ পরিমাপ করেছি এবং বিজ্ঞানীদের ভ্যান অ্যালেন বিকিরণ বলয়ের জায়গা বুঝতে সাহায্য করেছি।",
        image: "./moon_images/Pioneer_1_Reconstructed_Replica.jpg",
        alt: "পাইওনিয়ার ১-এর বিকিরণ তথ্য",
        catalog: "পাইওনিয়ার ১ — বৈজ্ঞানিক তথ্য"
    },
    {
        title: "জ্বলে ওঠা প্রত্যাবর্তন",
        text: "মহাকাশে ৪৩ ঘণ্টা থাকার পর আমি পৃথিবীর বায়ুমণ্ডলে পুনঃপ্রবেশ করি এবং দক্ষিণ প্রশান্ত মহাসাগরে পুড়ে যাই।",
        image: "./moon_images/Pioneer_1_Reconstructed_Replica.jpg",
        alt: "পৃথিবীর বায়ুমণ্ডলে ফিরে আসছে পাইওনিয়ার ১",
        catalog: "পাইওনিয়ার ১ — প্রত্যাবর্তন"
    },
    {
        title: "উত্তরাধিকার",
        text: "আমার যাত্রা দেখিয়েছে কী ভুল হতে পারে এবং পরবর্তী যারা সফল হয়েছে, তাদের পথকে সহজ করতে কীভাবে সাহায্য করা যায়।",
        image: "./moon_images/Pioneer_1_Reconstructed_Replica.jpg",
        alt: "আর্কাইভ মহাকাশ ঐতিহ্য হিসেবে পাইওনিয়ার ১",
        catalog: "পাইওনিয়ার ১ — উত্তরাধিকার"
    }
];

let currentSlide = 0;

let currentImage = 0;

let imageTimer = null;

let storyAnimating = false;

let storyVoice = null;

let storyVoices = [];

let touchStartX = 0;

let touchStartY = 0;

const mapContainer =
    document.getElementById("moonMap");

const mapViewport =
    document.getElementById("moonMapViewport");

const mapLayer =
    document.getElementById("moonMapLayer");

const moonThreeCanvas =
    document.getElementById("moonThreeCanvas");

const moonThreeContainer =
    document.getElementById("moonThreeContainer");

const moonThreeLoading =
    document.getElementById("moonThreeLoading");

const moonThreeError =
    document.getElementById("moonThreeError");

const moonSurfaceImage =
    document.getElementById("moonSurfaceImage");

const hardwareLayer =
    document.getElementById("hardwareLayer");

const moonThreeState = {
    renderer: null,
    scene: null,
    camera: null,
    globeGroup: null,
    sphere: null,
    raycaster: null,
    pointer: null,
    markerGroup: null,
    markerMap: new Map(),
    pointerDown: false,
    webglActive: false,
    lastPointerX: 0,
    lastPointerY: 0,
    animationId: null,
    isReady: false,
    textureUrl: "./data/moon-global.jpg",
    textureLoaded: false
};

const zoomInButton =
    document.getElementById("zoomIn");

const zoomOutButton =
    document.getElementById("zoomOut");

const zoomValue =
    document.getElementById("zoomValue");

const homeButton =
    document.getElementById("homeButton");

const miniMapCanvas =
    document.getElementById("miniMapCanvas");

const mapStatus =
    document.getElementById("mapStatus");

const mapCoordinates =
    document.getElementById("mapCoordinates");

const storyOverlay =
    document.getElementById("storyOverlay");

const storyPanel =
    document.getElementById("storyPanel");

const storyClose =
    document.getElementById("storyClose");

const storyImage =
    document.getElementById("storyImage");

const storyGreeting =
    document.getElementById("storyGreeting");

const storyTitle =
    document.getElementById("storyTitle");

const storyMeta =
    document.getElementById("storyMeta");

const storyText =
    document.getElementById("storyText");

const storyScienceList =
    document.getElementById("storyScienceList");

const storyLocation =
    document.getElementById("storyLocation");

const storyStatus =
    document.getElementById("storyStatus");

const storySource =
    document.getElementById("storySource");

const timelineYear =
    document.getElementById("timelineYear");

const timelineRange =
    document.getElementById("timelineRange");

const timelineProgress =
    document.getElementById("timelineProgress");

const timelineCursor =
    document.getElementById("timelineCursor");

const timelineEvents =
    document.getElementById("timelineEvents");

const timelinePlay =
    document.getElementById("timelinePlay");

function updateMoonLanguageUI() {

    if (!window.ProjectLanguage) {
        return;
    }

    const isBangla =
        window.ProjectLanguage.isBangla;

    const t =
        (english, bangla) =>
            isBangla ? bangla : english;

    if (timelinePlay) {
        timelinePlay.textContent =
            state.playing ? "❚❚" : "▶";
        timelinePlay.setAttribute(
            "aria-label",
            t(
                "Play mission timeline",
                "অভিযানের সময়রেখা চালান"
            )
        );
    }

    if (timelineRange) {
        timelineRange.setAttribute(
            "aria-label",
            t(
                "Mission timeline year",
                "অভিযানের সময়রেখার বছর"
            )
        );
    }

    if (zoomInButton) {
        zoomInButton.setAttribute(
            "aria-label",
            t("Zoom in", "বড় করে দেখুন")
        );
    }

    if (zoomOutButton) {
        zoomOutButton.setAttribute(
            "aria-label",
            t("Zoom out", "ছোট করে দেখুন")
        );
    }

    if (homeButton) {
        homeButton.setAttribute(
            "aria-label",
            t("Reset lunar map", "চন্দ্র মানচিত্র রিসেট করুন")
        );
    }

    const mapLegendText =
        document.querySelectorAll(
            ".legend-item"
        );

    mapLegendText.forEach(
        item => {
            if (item.classList.contains("landed")) {
                item.lastChild.textContent =
                    isBangla ? "অবতরণ করেছে" : "LANDED";
            }

            if (item.classList.contains("impacted")) {
                item.lastChild.textContent =
                    isBangla ? "আঘাত হেনেছে" : "IMPACTED";
            }
        }
    );

    if (archiveBtn) {
        const archiveLabel =
            archiveBtn.querySelector("span:last-child");

        if (archiveLabel) {
            archiveLabel.textContent =
                t("Mission Archive", "অভিযান সংরক্ষণাগার");
        }
    }

}

let archiveBtn = null;

let archivePanel = null;

let closeArchive = null;

let archiveMissions = null;

function getAllMissions() {

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

function getMappableMissions() {

    return getAllMissions().filter(
        mission => {

            if (
                mission.archiveOnly === true
            ) {

                return false;

            }

            const latitude =
                Number(mission.latitude);

            const longitude =
                Number(mission.longitude);

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

function getMissionById(id) {

    return getAllMissions().find(
        mission =>
            String(mission.id) ===
            String(id)
    );

}

function initializeMapDimensions() {

    if (!mapLayer) {
        return;
    }

    mapLayer.style.width =
        `${MAP_WIDTH}px`;

    mapLayer.style.height =
        `${MAP_HEIGHT}px`;

}

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

    return Math.max(
        width / MAP_WIDTH,
        height / MAP_HEIGHT
    );

}

function resetMapPosition() {

    const fitZoom =
        calculateFitZoom();

    state.minZoom =
        Math.max(
            fitZoom * MIN_ZOOM_MULTIPLIER,
            0.01
        );

    state.maxZoom =
        Math.max(
            4,
            state.minZoom * 4
        );

    state.zoom =
        state.minZoom;

    state.posX = 0;

    state.posY = 0;

    clampMapPosition();

    applyMapTransform();

    updateZoomDisplay();

    drawMiniMap();

    updateMapCursorCoordinates(
        mapViewport.getBoundingClientRect().left +
            mapViewport.clientWidth / 2,
        mapViewport.getBoundingClientRect().top +
            mapViewport.clientHeight / 2
    );

}

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

    if (hardwareLayer) {
        hardwareLayer.style.setProperty(
            "--marker-ui-scale",
            String(
                Math.min(
                    12,
                    Math.max(0.75, 1 / state.zoom)
                )
            )
        );
    }

}

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
            (scaledWidth - viewportWidth) / 2
        );

    const maxY =
        Math.max(
            0,
            (scaledHeight - viewportHeight) / 2
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

function updateZoomDisplay() {

    if (!zoomValue) {
        return;
    }

    const percentage =
        Math.round(
            (state.zoom / state.minZoom) * 140
        );

    zoomValue.textContent =
        `${percentage}%`;

}

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
        Math.abs(newZoom - oldZoom) <
        0.00001
    ) {

        return;

    }

    const scale =
        newZoom / oldZoom;

    state.posX =
        pointerX -
        (pointerX - state.posX) * scale;

    state.posY =
        pointerY -
        (pointerY - state.posY) * scale;

    state.zoom =
        newZoom;

    clampMapPosition();

    applyMapTransform();

    updateZoomDisplay();

    drawMiniMap();

}

function handleWheel(event) {

    event.preventDefault();

    if (moonThreeState.webglActive) {
        return;
    }

    zoomAtPoint(
        event.clientX,
        event.clientY,
        event.deltaY < 0
            ? 1.15
            : 1 / 1.15
    );

}

function handlePointerDown(event) {

    if (
        event.target.closest(
            ".hardware-marker"
        )
    ) {

        return;

    }

    if (
        moonThreeState.webglActive &&
        updateGlobeCursorCoordinates(event.clientX, event.clientY)
    ) {

        moonThreeState.pointerDown = true;
        moonThreeState.lastPointerX = event.clientX;
        moonThreeState.lastPointerY = event.clientY;

        try {
            mapViewport.setPointerCapture(event.pointerId);
        } catch (error) {}

        event.preventDefault();
        return;

    }

    if (moonThreeState.webglActive) {
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

function handlePointerMove(event) {

    if (moonThreeState.webglActive) {

        if (moonThreeState.pointerDown) {

            const deltaX =
                event.clientX - moonThreeState.lastPointerX;

            const deltaY =
                event.clientY - moonThreeState.lastPointerY;

            moonThreeState.globeGroup.rotation.y +=
                deltaX * 0.006;

            moonThreeState.globeGroup.rotation.x =
                Math.max(
                    -1.25,
                    Math.min(
                        1.25,
                        moonThreeState.globeGroup.rotation.x + deltaY * 0.006
                    )
                );

            moonThreeState.lastPointerX =
                event.clientX;

            moonThreeState.lastPointerY =
                event.clientY;

        }

        updateGlobeCursorCoordinates(
            event.clientX,
            event.clientY
        );

        return;

    }

    updateMapCursorCoordinates(
        event.clientX,
        event.clientY
    );

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

function handlePointerUp(event) {

    if (moonThreeState.pointerDown) {

        moonThreeState.pointerDown = false;

        try {
            mapViewport.releasePointerCapture(event.pointerId);
        } catch (error) {}

        return;

    }

    state.dragging =
        false;

    try {

        mapViewport.releasePointerCapture(
            event.pointerId
        );

    } catch (error) {}

}

function updateMapCursorCoordinates(clientX, clientY) {

    if (
        moonThreeState.webglActive ||
        !mapCoordinates ||
        !mapViewport ||
        state.zoom <= 0
    ) {
        return;
    }

    const rect =
        mapViewport.getBoundingClientRect();

    const mapX =
        (
            clientX -
            rect.left -
            rect.width / 2 -
            state.posX
        ) / state.zoom +
        MAP_WIDTH / 2;

    const mapY =
        (
            clientY -
            rect.top -
            rect.height / 2 -
            state.posY
        ) / state.zoom +
        MAP_HEIGHT / 2;

    if (
        mapX < 0 ||
        mapX > MAP_WIDTH ||
        mapY < 0 ||
        mapY > MAP_HEIGHT
    ) {
        clearMapCursorCoordinates();
        return;
    }

    const latitude =
        90 - mapY / MAP_HEIGHT * 180;

    const longitude =
        mapX / MAP_WIDTH * 360 - 180;

    setMapCursorCoordinates(latitude, longitude);

}

function setMapCursorCoordinates(latitude, longitude) {

    if (!mapCoordinates) {
        return;
    }

    const format = value =>
        window.ProjectLanguage?.formatNumber(value) || value;

    const latitudeLabel =
        window.ProjectLanguage?.isBangla ? "অক্ষাংশ" : "LAT";

    const longitudeLabel =
        window.ProjectLanguage?.isBangla ? "দ্রাঘিমাংশ" : "LON";

    mapCoordinates.textContent =
        `${latitudeLabel} ${format(latitude.toFixed(4))}° · ${longitudeLabel} ${format(longitude.toFixed(4))}°`;

}

function clearMapCursorCoordinates() {

    if (!mapCoordinates) {
        return;
    }

    mapCoordinates.textContent =
        window.ProjectLanguage?.isBangla
            ? "অক্ষাংশ -- | দ্রাঘিমাংশ --"
            : "LAT -- | LON --";

}

function updateGlobeCursorCoordinates(clientX, clientY) {

    if (
        !moonThreeState.webglActive ||
        !moonThreeCanvas ||
        !moonThreeState.camera ||
        !moonThreeState.sphere ||
        !moonThreeState.globeGroup ||
        !moonThreeState.raycaster ||
        !moonThreeState.pointer
    ) {
        return false;
    }

    const rect =
        moonThreeCanvas.getBoundingClientRect();

    if (
        !rect.width ||
        !rect.height ||
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
    ) {
        clearMapCursorCoordinates();
        return false;
    }

    moonThreeState.pointer.x =
        ((clientX - rect.left) / rect.width) * 2 - 1;

    moonThreeState.pointer.y =
        -((clientY - rect.top) / rect.height) * 2 + 1;

    moonThreeState.raycaster.setFromCamera(
        moonThreeState.pointer,
        moonThreeState.camera
    );

    const intersection =
        moonThreeState.raycaster.intersectObject(
            moonThreeState.sphere,
            false
        )[0];

    if (!intersection) {
        clearMapCursorCoordinates();
        return false;
    }

    const localPoint =
        moonThreeState.globeGroup.worldToLocal(
            intersection.point.clone()
        ).normalize();

    const latitude =
        90 - Math.acos(
            Math.max(-1, Math.min(1, localPoint.y))
        ) * 180 / Math.PI;

    let theta =
        Math.atan2(localPoint.z, -localPoint.x);

    if (theta < 0) {
        theta += Math.PI * 2;
    }

    const longitude =
        theta * 180 / Math.PI - 180;

    setMapCursorCoordinates(latitude, longitude);
    return true;

}

function getMarkerCategory(mission) {

    const status =
        String(
            mission.status || ""
        ).toLowerCase();

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

function getMissionName(mission) {

    const name = (
        mission.name ||
        mission.mission ||
        "NASA Hardware"
    );

    return window.ProjectLanguage?.translate(name) || name;

}

function getMissionText(mission, field) {

    if (
        mission &&
        window.ProjectLanguage?.isBangla &&
        window.moonMissionTranslations?.[mission.id]?.[field]
    ) {

        return window.moonMissionTranslations[mission.id][field];

    }

    if (
        mission &&
        window.ProjectLanguage?.isBangla &&
        field === "name"
    ) {

        return window.ProjectLanguage.translate(
            mission.name ||
            mission.mission ||
            "NASA Hardware"
        );

    }

    return mission[field];

}

function createMarker(mission) {

    const marker =
        document.createElement("button");

    marker.type =
        "button";

    marker.className =
        "hardware-marker";

    marker.classList.add(
        getMarkerCategory(mission)
    );

    marker.dataset.missionId =
        mission.id;

    marker.setAttribute(
        "aria-label",
        `${window.ProjectLanguage?.isBangla ? "অনুসন্ধান করুন" : "Investigate"} ${getMissionName(mission)}`
    );

    const latitude =
        Number(mission.latitude);

    const longitude =
        Number(mission.longitude);

    const x =
        ((longitude + 180) / 360) * 100;

    const y =
        ((90 - latitude) / 180) * 100;

    marker.style.left =
        `${x}%`;

    marker.style.top =
        `${y}%`;

    const dot =
        document.createElement("span");

    dot.className =
        "hardware-dot";

    const label =
        document.createElement("span");

    label.className =
        "hardware-label";

    label.dataset.position =
        "bottom";

    label.textContent =
        getMissionName(mission);

    dot.innerHTML = `
        <svg class="hardware-pin-icon" viewBox="0 0 24 28" aria-hidden="true" focusable="false">
            <path class="hardware-pin-body" d="M12 27S2 17.2 2 10.5a10 10 0 1 1 20 0C22 17.2 12 27 12 27Z" />
            <circle class="hardware-pin-center" cx="12" cy="10.5" r="4" />
        </svg>
    `;

    marker.appendChild(dot);

    marker.appendChild(label);

    marker.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openMissionStory(mission);

        }
    );

    return marker;

}

function projectLatLonToSphere(latitude, longitude) {

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
    ) {

        return null;

    }

    const phi =
        (90 - lat) * (Math.PI / 180);

    const theta =
        (lon + 180) * (Math.PI / 180);

    const x =
        -Math.sin(phi) * Math.cos(theta);

    const y =
        Math.cos(phi);

    const z =
        Math.sin(phi) * Math.sin(theta);

    return {
        x,
        y,
        z
    };

}

function updateThreeMoonMarkerPositions() {

    if (
        !moonThreeState.markerGroup ||
        !moonThreeState.sphere
    ) {

        return;

    }

    const missions =
        getMappableMissions();

    missions.forEach(
        mission => {

            const marker =
                moonThreeState.markerMap.get(mission.id);

            if (!marker) {
                return;
            }

            const spherePosition =
                projectLatLonToSphere(
                    mission.latitude,
                    mission.longitude
                );

            if (!spherePosition) {
                marker.visible = false;
                return;
            }

            const direction =
                new THREE.Vector3(
                    spherePosition.x,
                    spherePosition.y,
                    spherePosition.z
                ).normalize();

            const radius =
                1.215;

            const markerPosition =
                direction.multiplyScalar(radius);

            marker.position.copy(markerPosition);
            marker.lookAt(0, 0, 0);
            marker.rotateX(Math.PI / 2);
            marker.visible =
                Number(mission.year) <=
                Number(state.timelineYear);

        }
    );

}

function createThreeMoonMarker(mission) {

    if (!window.THREE) {
        return null;
    }

    const group =
        new THREE.Group();

    const dot =
        new THREE.Mesh(
            new THREE.SphereGeometry(0.024, 12, 12),
            new THREE.MeshBasicMaterial({
                color: mission.status?.toLowerCase().includes("impact") ? 0xff4d4d : mission.status?.toLowerCase().includes("orbit") ? 0xffd84d : 0x4dff88,
                transparent: true,
                opacity: 0.95
            })
        );

    const halo =
        new THREE.Mesh(
            new THREE.SphereGeometry(0.042, 12, 12),
            new THREE.MeshBasicMaterial({
                color: mission.status?.toLowerCase().includes("impact") ? 0xff4d4d : mission.status?.toLowerCase().includes("orbit") ? 0xffd84d : 0x4dff88,
                transparent: true,
                opacity: 0.22
            })
        );

    group.add(halo);
    group.add(dot);

    group.userData = {
        missionId: mission.id
    };

    group.visible = false;

    const position =
        projectLatLonToSphere(
            mission.latitude,
            mission.longitude
        );

    if (position) {

        group.position.set(
            position.x,
            position.y,
            position.z
        ).multiplyScalar(1.215);

        group.lookAt(0, 0, 0);
        group.rotateX(Math.PI / 2);
        group.visible = true;

    }

    group.traverse(
        child => {

            if (child.isMesh) {
                child.userData.missionId = mission.id;
            }

        }
    );

    return group;

}

function renderMarkers() {

    if (!hardwareLayer) {

        console.error(
            "#hardwareLayer not found."
        );

        return;

    }

    hardwareLayer.innerHTML = "";

    const missions =
        getMappableMissions();

    missions.forEach(
        mission => {

            hardwareLayer.appendChild(
                createMarker(mission)
            );

        }
    );

    if (moonThreeState.markerGroup) {

        moonThreeState.markerGroup.clear();
        moonThreeState.markerMap.clear();

        missions.forEach(
            mission => {

                const marker =
                    createThreeMoonMarker(mission);

                if (marker) {
                    moonThreeState.markerGroup.add(marker);
                    moonThreeState.markerMap.set(mission.id, marker);
                }

            }
        );

    }

    updateMarkerVisibility();

    updateMapStatus();

    console.log(
        "Lunar hardware markers:",
        missions.length
    );

}

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
                Number(mission.year) <=
                Number(state.timelineYear);

            marker.classList.toggle(
                "timeline-hidden",
                !visible
            );

            const threeMarker =
                moonThreeState.markerMap.get(mission.id);

            if (threeMarker) {
                threeMarker.visible = visible;
            }

        }
    );

}

function updateMapStatus() {

    if (!mapStatus) {
        return;
    }

    const count =
        getMappableMissions()
            .filter(
                mission =>
                    Number(mission.year) <=
                    Number(state.timelineYear)
            )
            .length;

    mapStatus.textContent =
        window.ProjectLanguage?.isBangla
            ? `${window.ProjectLanguage.formatNumber(count)}টি সরঞ্জাম স্থল`
            : `${count} hardware sites`;

}

function renderTimeline() {

    if (!timelineRange) {
        return;
    }

    const missions =
        getAllMissions()
            .filter(
                mission =>
                    Number.isFinite(
                        Number(mission.year)
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
                Number(mission.year)
        );

    const minYear =
        Math.min(...years);

    const maxYear =
        Math.max(...years);

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
            window.ProjectLanguage?.formatNumber(maxYear) || String(maxYear);

    }

    if (!timelineEvents) {
        return;
    }

    timelineEvents.innerHTML =
        "";

    missions.forEach(
        mission => {

            const year =
                Number(mission.year);

            const percentage =
                (
                    (year - minYear) /
                    Math.max(
                        1,
                        maxYear - minYear
                    )
                ) * 100;

            const event =
                document.createElement("button");

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

            timelineEvents.appendChild(event);

        }
    );

    updateTimeline();

}

function updateTimeline() {

    if (!timelineRange) {
        return;
    }

    const min =
        Number(timelineRange.min);

    const max =
        Number(timelineRange.max);

    const year =
        Number(timelineRange.value);

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
            window.ProjectLanguage?.formatNumber(year) || String(year);

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

function toggleTimelinePlayback() {

    if (state.playing) {

        stopTimelinePlayback();

    } else {

        startTimelinePlayback();

    }

}

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

                if (year > max) {

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

function drawMiniMap() {

    if (!miniMapCanvas) {
        return;
    }

    const ctx =
        miniMapCanvas.getContext("2d");

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

    ctx.fillStyle =
        "#05070d";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

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

    getMappableMissions()
        .forEach(
            mission => {

                if (
                    Number(mission.year) >
                    Number(state.timelineYear)
                ) {

                    return;

                }

                const x =
                    (
                        (
                            Number(mission.longitude) +
                            180
                        ) / 360
                    ) * width;

                const y =
                    (
                        (
                            90 -
                            Number(mission.latitude)
                        ) / 180
                    ) * height;

                const category =
                    getMarkerCategory(mission);

                if (
                    category === "impacted"
                ) {

                    ctx.fillStyle =
                        "#ff4545";

                } else if (
                    category === "orbital"
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

function calculateMiniViewport() {

    if (!mapViewport) {
        return null;
    }

    const viewportWidth =
        mapViewport.clientWidth;

    const viewportHeight =
        mapViewport.clientHeight;

    const visibleWorldWidth =
        viewportWidth / state.zoom;

    const visibleWorldHeight =
        viewportHeight / state.zoom;

    const centerX =
        MAP_WIDTH / 2 -
        state.posX / state.zoom;

    const centerY =
        MAP_HEIGHT / 2 -
        state.posY / state.zoom;

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
        ) / rect.width;

    const y =
        (
            event.clientY -
            rect.top
        ) / rect.height;

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

    mapViewport.addEventListener(
        "pointerleave",
        () => {
            if (!state.dragging && !moonThreeState.pointerDown) {
                clearMapCursorCoordinates();
            }
        }
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

function setupHomeButton() {

    if (!homeButton) {
        return;
    }

    homeButton.addEventListener(
        "click",
        resetMapPosition
    );

}

function getStorySlides(mission) {

    if (
        mission &&
        Array.isArray(mission.slides) &&
        mission.slides.length
    ) {

        return mission.slides;

    }

    const missionStory =
        getMissionText(mission, "story");

    if (
        mission &&
        typeof missionStory === "string" &&
        missionStory.trim()
    ) {

        const paragraphs =
            missionStory
                .trim()
                .split(/\n\s*\n+/)
                .map(
                    paragraph =>
                        paragraph
                            .trim()
                            .replace(/\s+/g, " ")
                )
                .filter(Boolean);

        const storySlides = [];

        paragraphs.forEach(
            paragraph => {

                let textBuffer = "";
                const sentences =
                    paragraph.split(
                        /(?<=[.!?])\s+/
                    );

                sentences.forEach(
                    sentence => {

                        if (sentence.length > 200) {

                            if (textBuffer) {
                                storySlides.push(textBuffer);
                                textBuffer = "";
                            }

                            let sentenceBuffer = "";

                            sentence
                                .split(/\s+/)
                                .forEach(
                                    word => {

                                        const candidate =
                                            sentenceBuffer
                                                ? `${sentenceBuffer} ${word}`
                                                : word;

                                        if (
                                            candidate.length > 200 &&
                                            sentenceBuffer
                                        ) {

                                            storySlides.push(
                                                sentenceBuffer
                                            );

                                            sentenceBuffer = word;

                                        } else {

                                            sentenceBuffer =
                                                candidate;

                                        }

                                    }
                                );

                            if (sentenceBuffer) {
                                storySlides.push(sentenceBuffer);
                            }

                            return;

                        }

                        const candidate =
                            textBuffer
                                ? `${textBuffer} ${sentence}`
                                : sentence;

                        if (
                            candidate.length > 200 &&
                            textBuffer
                        ) {

                            storySlides.push(textBuffer);
                            textBuffer = sentence;

                        } else {

                            textBuffer = candidate;

                        }

                    }
                );

                if (textBuffer) {
                    storySlides.push(textBuffer);
                }

            }
        );

        const imageScenes =
            Array.isArray(mission.slides)
                ? mission.slides
                : [];

        const getStorySceneImages =
            index => {

                if (!imageScenes.length) {
                    return getSlideImages(mission, null);
                }

                const imageSceneIndex =
                    Math.min(
                        Math.floor(
                            index * imageScenes.length / storySlides.length
                        ),
                        imageScenes.length - 1
                    );

                return getSlideImages(
                    mission,
                    imageScenes[imageSceneIndex]
                );

            };

        return [
            {
                text:
                    getMissionText(mission, "greeting") ||
                    (window.ProjectLanguage?.isBangla ? "নাসা সংরক্ষণাগার" : "NASA ARCHIVE"),
                science: [],
                images:
                    getStorySceneImages(0)
            },
            ...storySlides.map(
                (text, index) => ({
                    text,
                    science: [],
                    images:
                        getStorySceneImages(index)
                })
            )
        ];

    }

    return createFallbackSlides(
        mission
    );

}

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
                    getMissionName(mission),

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

    if (paragraphs.length >= 3) {

        const selected =
            paragraphs.slice(0, 5);

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
                            ? getMissionName(mission)
                            : `${getMissionName(mission)} — ${index + 1}`,

                    text,

                    images

                };

            }
        );

    }

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
                            ? getMissionName(mission)
                            : `${getMissionName(mission)} — ${index + 1}`,

                    text,

                    images

                };

            }
        );

}

function getSlideImages(
    mission,
    slide
) {

    if (
        slide &&
        Array.isArray(slide.images)
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
        Array.isArray(mission.images) &&
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
        document.createElement("div");

    controls.id =
        "missionStoryControls";

    controls.innerHTML = `
        <button
            id="missionStoryPrevious"
            class="mission-story-arrow"
            type="button"
            aria-label="Previous story slide"
        >
            ←
        </button>

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
            "missionStoryPrevious"
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
        document.createElement("div");

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

function isPioneerMission(mission) {
    return Boolean(
        mission &&
        mission.id === "pioneer-1"
    );
}


function getLocalizedPioneerStoryPage(pageIndex) {

    if (window.ProjectLanguage?.isBangla) {
        return pioneerStoryPagesBangla[pageIndex] || pioneerStoryPagesBangla[0];
    }

    return pioneerStoryPages[pageIndex] || pioneerStoryPages[0];

}

function renderPioneerStoryPage() {

    if (!isPioneerMission(currentMission)) {
        return;
    }

    const page =
        getLocalizedPioneerStoryPage(currentSlide);

    if (storyGreeting) {
        storyGreeting.textContent =
            "";
        storyGreeting.style.display =
            "none";
    }

    if (storyTitle) {
        storyTitle.textContent =
            "";
        storyTitle.style.display =
            "none";
    }

    if (storyMeta) {
        storyMeta.textContent =
            "";
        storyMeta.style.display =
            "none";
    }

    if (storyText) {
        storyText.textContent =
            page.text;
    }

    if (storyImage) {
        storyImage.src = page.image;
        storyImage.alt = page.alt;
    }

    const counter =
        document.getElementById(
            "missionImageCounter"
        );

    if (counter) {
        counter.textContent =
            `${currentSlide + 1} / ${pioneerStoryPages.length}`;
    }

    const title =
        document.getElementById(
            "missionImageTitle"
        );

    if (title) {
        title.textContent =
            page.catalog;
    }

    const info =
        document.getElementById(
            "missionImageInfo"
        );

    if (info) {
        info.hidden = false;
    }

    const previous =
        document.getElementById(
            "missionStoryPrevious"
        );

    const next =
        document.getElementById(
            "missionStoryNext"
        );

    if (previous) {
        previous.disabled =
            currentSlide === 0;
    }

    if (next) {
        next.disabled =
            currentSlide >= pioneerStoryPages.length - 1;
        next.setAttribute(
            "aria-label",
            currentSlide >= pioneerStoryPages.length - 1
                ? "No further Pioneer 1 pages"
                : "Next Pioneer story page"
        );
    }

    if (storySource) {
        storySource.href =
            currentMission.source;
        storySource.textContent =
            currentMission.sourceTitle ||
            "NASA Science — Pioneer 1 (Able 2)";
        storySource.style.display =
            "inline-block";
    }

    storyPanel?.classList.add("pioneer-story");

}

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
        slides[currentSlide];

    const images =
        getSlideImages(
            currentMission,
            slide
        );

    const counter =
        document.getElementById(
            "missionImageCounter"
        );

    const info =
        document.getElementById(
            "missionImageInfo"
        );

    if (counter) {

        counter.textContent =
            `${window.ProjectLanguage?.formatNumber(currentSlide + 1) || currentSlide + 1} / ${window.ProjectLanguage?.formatNumber(slides.length) || slides.length}`;

    }

    if (!images.length) {

        storyImage.removeAttribute(
            "src"
        );

        storyImage.alt =
            "";

        if (info) {
            info.hidden = true;
        }

        return;

    }

    if (info) {
        info.hidden = false;
    }

    if (
        currentImage >=
        images.length
    ) {

        currentImage =
            0;

    }

    storyImage.src =
        images[currentImage];

    storyImage.alt =
        `${getMissionName(currentMission)} NASA archive image`;

    const title =
        document.getElementById(
            "missionImageTitle"
        );

    if (title) {

        title.textContent =
            getMissionName(currentMission);

    }

}

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
        slides[currentSlide];

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

function stopImageTimer() {

    if (imageTimer) {

        clearInterval(
            imageTimer
        );

        imageTimer =
            null;

    }

}

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
        slides[currentSlide];

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

                changeMissionImage(1);

            },
            IMAGE_ROTATION_TIME
        );

}

function updateStoryArrows() {

    const previous =
        document.getElementById(
            "missionStoryPrevious"
        );

    const next =
        document.getElementById(
            "missionStoryNext"
        );

    if (!currentMission) {
        return;
    }

    if (isPioneerMission(currentMission)) {

        const finalPageIndex =
            pioneerStoryPages.length - 1;

        if (previous) {
            previous.disabled =
                currentSlide === 0;
        }

        if (next) {
            next.disabled =
                currentSlide >= finalPageIndex;
            next.setAttribute(
                "aria-label",
                currentSlide >= finalPageIndex
                    ? "No further Pioneer 1 pages"
                    : "Next Pioneer story page"
            );
        }

        return;

    }

    const slides =
        getStorySlides(
            currentMission
        );

    if (previous) {

        previous.disabled =
            currentSlide === 0;

    }

    if (next) {

        const last =
            currentSlide >=
            slides.length - 1;

        next.setAttribute(
            "aria-label",
            last
                ? "Finish mission story"
                : "Next story slide"
        );

    }

}

function getLocalizedStoryText(mission, slide, slideIndex) {

    if (!mission || !window.ProjectLanguage?.isBangla) {
        return slide?.text || slide?.story || "";
    }

    const translations =
        window.moonMissionTranslations?.[mission.id];

    if (translations?.slides?.[slideIndex]) {
        return (
            translations.slides[slideIndex].text ||
            translations.slides[slideIndex].story ||
            slide?.text ||
            slide?.story ||
            ""
        );
    }

    if (translations?.story && slideIndex === 0) {
        return translations.story;
    }

    return slide?.text || slide?.story || "";
}

function updateStoryContent() {

    if (!currentMission) {
        return;
    }

    if (isPioneerMission(currentMission)) {

        storyPanel?.classList.add("pioneer-story");
        renderPioneerStoryPage();
        return;

    }

    const slides =
        getStorySlides(
            currentMission
        );

    const slide =
        slides[currentSlide];

    if (!slide) {
        return;
    }

    if (storyGreeting) {

        storyGreeting.textContent = "";

    }

    if (storyTitle) {

        storyTitle.textContent =
            "";

        storyTitle.style.display =
            "none";

    }

    if (storyMeta) {

        storyMeta.textContent =
            "";

        storyMeta.style.display =
            "none";

    }

    if (storyText) {

        storyText.textContent =
            getLocalizedStoryText(
                currentMission,
                slide,
                currentSlide
            );

    }

    if (storyScienceList) {

        storyScienceList.innerHTML =
            "";

        const scienceSection =
            storyScienceList.closest(
                ".story-science"
            );

        let science =
            slide.science ||
            slide.majorResults ||
            currentMission.majorResults ||
            [];

        const translatedScience =
            window.ProjectLanguage?.isBangla
                ? window.moonMissionScienceBangla?.[currentMission.id]
                : null;

        if (translatedScience?.length) {
            science = translatedScience;
        }

        if (
            typeof science ===
            "string"
        ) {

            science =
                [science];

        }

        if (
            Array.isArray(science) &&
            science.length
        ) {

            if (scienceSection) {
                scienceSection.style.display = "block";
            }

            science.forEach(
                item => {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        item;

                    storyScienceList.appendChild(
                        li
                    );

                }
            );

        } else if (scienceSection) {

            scienceSection.style.display = "none";

        }

    }

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
                `${window.ProjectLanguage?.formatNumber(lat.toFixed(4)) || lat.toFixed(4)}°, ${window.ProjectLanguage?.formatNumber(lon.toFixed(4)) || lon.toFixed(4)}°`;

        } else {

            storyLocation.textContent =
                window.ProjectLanguage?.isBangla
                    ? "সংরক্ষণাগারের নথি — চন্দ্র স্থানাঙ্ক নেই"
                    : "Archive record — no lunar coordinates";

        }

    }

    if (storyStatus) {

        storyStatus.textContent =
            window.ProjectLanguage?.translate(currentMission.status || "ARCHIVE") ||
            currentMission.status ||
            "ARCHIVE";

    }

    if (storySource) {

        if (currentMission.source) {

            storySource.href =
                currentMission.source;

            storySource.textContent =
                currentMission.sourceTitle ||
                "NASA mission source";

            storySource.style.display =
                "inline-block";

        } else {

            storySource.style.display =
                "none";

        }

    }

    updateStoryImage();

    updateStoryArrows();

}

function loadStoryVoices() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }

    storyVoices =
        window.speechSynthesis.getVoices();

    storyVoice =
        window.ProjectLanguage?.isBangla
            ? storyVoices.find(
                voice =>
                    voice.lang.toLowerCase().startsWith("bn")
            ) || null
            : storyVoices.find(
                voice =>
                    voice.name
                        .toLowerCase()
                        .includes("microsoft zira")
            ) ||
            storyVoices.find(
                voice =>
                    voice.lang === "en-US"
            ) ||
            storyVoices[0] ||
            null;

}

function stopStoryVoice() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }

}

function speakCurrentSlide() {

    if (
        !STORY_VOICE_ENABLED ||
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
        slides[currentSlide];

    if (!slide) {
        return;
    }

    const text =
        String(
            slide.text ||
            slide.story ||
            ""
        )
            .replace(/\s+/g, " ")
            .trim();

    if (!text) {
        return;
    }

    stopStoryVoice();

    const utterance =
        new SpeechSynthesisUtterance(
            text
        );

    utterance.lang =
        window.ProjectLanguage?.isBangla
            ? "bn-BD"
            : "en-US";

    if (storyVoice) {

        utterance.voice =
            storyVoice;

        if (!window.ProjectLanguage?.isBangla) {
            utterance.lang = storyVoice.lang;
        }

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

            if (currentMission) {

                window.speechSynthesis.speak(
                    utterance
                );

            }

        },
        150
    );

}

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

    if (isPioneerMission(mission)) {
        storyPanel?.classList.add("pioneer-story");
    } else {
        storyPanel?.classList.remove("pioneer-story");
    }

    stopStoryVoice();

    stopImageTimer();

    updateStoryContent();

    storyOverlay.classList.remove(
        "hidden"
    );

    if (!isPioneerMission(mission)) {
        speakCurrentSlide();
        restartImageTimer();
    }

    console.log(
        "Opened mission:",
        getMissionName(mission)
    );

}

function closeMissionStory() {

    if (!storyOverlay) {
        return;
    }

    stopStoryVoice();

    stopImageTimer();

    storyOverlay.classList.add(
        "hidden"
    );

    currentMission =
        null;

    currentSlide =
        0;

    currentImage =
        0;

}

function animateStoryPageChange(
    newIndex,
    onAfterChange
) {

    if (
        !storyPanel ||
        storyAnimating
    ) {

        return;

    }

    storyAnimating =
        true;

    stopStoryVoice();

    stopImageTimer();

    storyPanel.classList.add(
        "story-slide-exit"
    );

    setTimeout(
        () => {

            currentSlide =
                newIndex;

            currentImage =
                0;

            if (typeof onAfterChange === "function") {
                onAfterChange();
            }

            storyPanel.classList.remove(
                "story-slide-exit"
            );

            storyPanel.classList.add(
                "story-slide-enter"
            );

            if (!isPioneerMission(currentMission)) {
                speakCurrentSlide();
            }

            restartImageTimer();

            setTimeout(
                () => {

                    storyPanel.classList.remove(
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

function changeMissionSlide(
    direction
) {

    if (
        !currentMission ||
        storyAnimating
    ) {

        return;

    }

    if (isPioneerMission(currentMission)) {

        const newIndex =
            currentSlide +
            direction;

        if (
            newIndex < 0 ||
            newIndex >= pioneerStoryPages.length
        ) {
            return;
        }

        animateStoryPageChange(
            newIndex,
            () => {
                updateStoryContent();
                updateStoryArrows();
            }
        );

        return;

    }

    const slides =
        getStorySlides(
            currentMission
        );

    const newIndex =
        currentSlide +
        direction;

    if (
        newIndex < 0
    ) {

        return;

    }

    if (
        newIndex >=
        slides.length
    ) {

        closeMissionStory();

        return;

    }

    animateStoryPageChange(
        newIndex,
        () => {
            updateStoryContent();
            updateStoryArrows();
        }
    );

}

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

                changeMissionSlide(1);

            } else {

                changeMissionSlide(-1);

            }

        },
        {
            passive: true
        }
    );

}

function setupImageTouch() {

    if (!storyImage) {
        return;
    }

    let startX = 0;

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

                changeMissionSlide(1);

            }

            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();

                changeMissionSlide(-1);

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
        STORY_VOICE_ENABLED &&
        "speechSynthesis" in window
    ) {

        loadStoryVoices();

        window.speechSynthesis.onvoiceschanged =
            loadStoryVoices;

    }

    window.addEventListener(
        "languagechange",
        () => {

            loadStoryVoices();

            if (currentMission) {
                stopStoryVoice();
                speakCurrentSlide();
            }

        }
    );

}

function setupArchive() {

    archiveBtn =
        document.getElementById(
            "archiveBtn"
        );

    archivePanel =
        document.getElementById(
            "archivePanel"
        );

    closeArchive =
        document.getElementById(
            "closeArchive"
        );

    archiveMissions =
        document.getElementById(
            "archiveMissions"
        );

    if (!archiveBtn) {

        console.warn(
            "Archive button #archiveBtn not found."
        );

        return;

    }

    if (!archivePanel) {

        console.warn(
            "Archive panel #archivePanel not found."
        );

        return;

    }

    if (!archiveMissions) {

        console.warn(
            "Archive container #archiveMissions not found."
        );

        return;

    }

    function loadArchiveMissions() {

        archiveMissions.innerHTML =
            "";

        const missions =
            getAllMissions();

        const archived =
            missions.filter(
                mission =>
                    mission.archiveOnly === true
            );

        if (!archived.length) {

            archiveMissions.innerHTML = `
                <p class="archive-empty">
                    ${window.ProjectLanguage?.isBangla
                        ? "কোনো সংরক্ষিত অভিযান পাওয়া যায়নি।"
                        : "No archived missions found."}
                </p>
            `;

            return;

        }

        archived.forEach(
            mission => {

                const card =
                    document.createElement(
                        "button"
                    );

                card.type =
                    "button";

                card.className =
                    "archive-mission";

                const name =
                    getMissionName(
                        mission
                    );

                const date =
                    mission.date ||
                    mission.year ||
                    "Unknown date";

                const description =
                    getMissionText(mission, "landingSite") ||
                    getMissionText(mission, "description") ||
                    getMissionText(mission, "story") ||
                    (window.ProjectLanguage?.isBangla
                        ? "নাসার সংরক্ষণাগারের নথি।"
                        : "NASA archive record.");

                const localizedDate =
                    window.ProjectLanguage?.translate(String(date)) ||
                    String(date);

                const localizedStorySlides =
                    getStorySlides(mission);

                const localizedStoryText =
                    localizedStorySlides
                        .map(slide => slide.text || slide.story || "")
                        .filter(Boolean)
                        .join("\n\n");

                const archiveSummary =
                    window.ProjectLanguage?.isBangla &&
                    !window.moonMissionTranslations?.[mission.id]?.landingSite
                        ? localizedStoryText
                        : description;

                card.innerHTML = `

                    <span class="archive-mission-name">
                        ${escapeHTML(name)}
                    </span>

                    <span class="archive-mission-date">
                        ${escapeHTML(localizedDate)}
                    </span>

                    <span class="archive-mission-description">
                        ${escapeHTML(String(archiveSummary))}
                    </span>

                `;

                card.addEventListener(
                    "click",
                    () => {

                        console.log(
                            "Archive mission selected:",
                            name
                        );

                        /*
                         * Close archive first.
                         */

                        archivePanel.classList.remove(
                            "open"
                        );

                        /*
                         * Open the existing
                         * mission story viewer.
                         */

                        openMissionStory(
                            mission
                        );

                    }
                );

                archiveMissions.appendChild(
                    card
                );

            }
        );

    }

    archiveBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            console.log(
                "Archive button clicked"
            );

            loadArchiveMissions();

            archivePanel.classList.add(
                "open"
            );

        }
    );

    if (closeArchive) {

        closeArchive.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                archivePanel.classList.remove(
                    "open"
                );

            }
        );

    }

    archivePanel.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                archivePanel
            ) {

                archivePanel.classList.remove(
                    "open"
                );

            }

        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                archivePanel.classList.contains(
                    "open"
                )
            ) {

                archivePanel.classList.remove(
                    "open"
                );

            }

        }
    );

}

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

function handleResize() {

    const oldMin =
        state.minZoom;

    const ratio =
        oldMin > 0
            ? state.zoom / oldMin
            : 1;

    const fit =
        calculateFitZoom();

    state.minZoom =
        Math.max(
            fit * MIN_ZOOM_MULTIPLIER,
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
                state.minZoom * ratio
            )
        );

    clampMapPosition();

    applyMapTransform();

    updateZoomDisplay();

    drawMiniMap();

}

function setupVisibility() {

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                stopStoryVoice();

                stopImageTimer();

            } else if (currentMission) {

                restartImageTimer();

            }

        }
    );

}

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

function fallbackTo2DMap(reason = "WebGL unavailable") {

    moonThreeState.webglActive = false;

    if (moonThreeState.animationId) {
        cancelAnimationFrame(moonThreeState.animationId);
        moonThreeState.animationId = null;
    }

    if (hardwareLayer) {
        hardwareLayer
            .querySelectorAll(".hardware-marker")
            .forEach(marker => {
                const mission =
                    getMissionById(marker.dataset.missionId);

                marker.style.visibility = "";

                if (!mission) {
                    return;
                }

                marker.style.left =
                    `${((Number(mission.longitude) + 180) / 360) * 100}%`;

                marker.style.top =
                    `${((90 - Number(mission.latitude)) / 180) * 100}%`;
            });
    }

    if (moonThreeCanvas) {
        moonThreeCanvas.style.display = "none";
    }

    if (moonThreeContainer) {
        moonThreeContainer.style.display = "none";
        moonThreeContainer.setAttribute("aria-hidden", "true");
    }

    if (moonThreeLoading) {
        moonThreeLoading.classList.add("hidden");
    }

    if (moonThreeError) {
        moonThreeError.classList.add("hidden");
        moonThreeError.textContent = "";
    }

    if (moonSurfaceImage) {
        moonSurfaceImage.style.display = "block";
        moonSurfaceImage.style.opacity = "1";
    }

    if (hardwareLayer) {
        hardwareLayer.style.pointerEvents = "auto";
    }

    console.warn(
        "Three.js Moon fallback enabled:",
        reason
    );

}

function setupThreeMoon() {

    if (
        !moonThreeCanvas ||
        !moonThreeContainer
    ) {

        return;

    }

    if (!window.THREE) {
        fallbackTo2DMap("Three.js not loaded");
        return;
    }

    let canvasContext = null;

    try {

        canvasContext =
            moonThreeCanvas.getContext("webgl") ||
            moonThreeCanvas.getContext("experimental-webgl");

    } catch (error) {

        console.warn(
            "WebGL context probe failed:",
            error
        );

    }

    if (!canvasContext) {
        fallbackTo2DMap("WebGL context unavailable");
        return;
    }

    if (moonThreeState.isReady) {
        return;
    }

    let renderer;

    const handleWebGLFailure = reason => {

        if (moonThreeState.animationId) {
            cancelAnimationFrame(moonThreeState.animationId);
            moonThreeState.animationId = null;
        }

        if (moonThreeState.renderer) {
            try {
                moonThreeState.renderer.dispose();
            } catch (error) {
                console.warn(
                    "Renderer disposal failed:",
                    error
                );
            }
        }

        fallbackTo2DMap(reason);

    };

    try {

        renderer =
            new THREE.WebGLRenderer({
                canvas: moonThreeCanvas,
                alpha: true,
                antialias: true,
                powerPreference: "low-power"
            });

    } catch (error) {

        console.error(
            "Failed to create WebGL renderer for the Moon globe:",
            error
        );

        fallbackTo2DMap("WebGL renderer creation failed");
        return;

    }

    if (!renderer) {

        fallbackTo2DMap("WebGL renderer unavailable");
        return;

    }

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );

    renderer.setClearColor(
        0x000000,
        0
    );

    const scene =
        new THREE.Scene();

    const camera =
        new THREE.PerspectiveCamera(
            32,
            1,
            0.1,
            1000
        );

    camera.position.z = 3.25;

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            0.85
        );

    const directional =
        new THREE.DirectionalLight(
            0xeaf3ff,
            0.95
        );

    directional.position.set(
        1.8,
        1.2,
        2.3
    );

    scene.add(ambient);
    scene.add(directional);

    const sphereGeometry =
        new THREE.SphereGeometry(
            1.2,
            96,
            96
        );

    const sphereMaterial =
        new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0,
            emissive: 0x0b0d12,
            emissiveIntensity: 0.25
        });

    const sphere =
        new THREE.Mesh(
            sphereGeometry,
            sphereMaterial
        );

    const globeGroup =
        new THREE.Group();

    globeGroup.rotation.y =
        -70 * Math.PI / 180;

    globeGroup.add(sphere);
    scene.add(globeGroup);

    const markerGroup =
        new THREE.Group();

    globeGroup.add(markerGroup);

    const raycaster =
        new THREE.Raycaster();

    const pointer =
        new THREE.Vector2();

    moonThreeState.renderer = renderer;
    moonThreeState.scene = scene;
    moonThreeState.camera = camera;
    moonThreeState.globeGroup = globeGroup;
    moonThreeState.sphere = sphere;
    moonThreeState.markerGroup = markerGroup;
    moonThreeState.raycaster = raycaster;
    moonThreeState.pointer = pointer;
    moonThreeState.webglActive = true;

    getMappableMissions().forEach(mission => {
        const marker = createThreeMoonMarker(mission);

        if (marker) {
            markerGroup.add(marker);
            moonThreeState.markerMap.set(mission.id, marker);
        }
    });

    moonThreeCanvas.addEventListener(
        "webglcontextlost",
        event => {
            event.preventDefault();
            handleWebGLFailure("WebGL context lost");
        },
        { passive: false }
    );

    const updateCanvasSize = () => {

        if (!moonThreeContainer) {
            return;
        }

        const width =
            moonThreeContainer.clientWidth || mapViewport?.clientWidth || 600;

        const height =
            moonThreeContainer.clientHeight || mapViewport?.clientHeight || 430;

        renderer.setSize(
            width,
            height,
            false
        );

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

    };

    const textureLoader =
        new THREE.TextureLoader();

    const showError = message => {

        if (moonThreeLoading) {
            moonThreeLoading.classList.add("hidden");
        }

        if (moonThreeError) {
            moonThreeError.textContent = "";
            moonThreeError.classList.add("hidden");
        }

        fallbackTo2DMap(message);
        console.error(message);

    };

    const moonTextureUrl =
        new URL(
            moonThreeState.textureUrl,
            window.location.href
        ).href;

    textureLoader.load(
        moonTextureUrl,
        texture => {

            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.anisotropy = Math.min(
                renderer.capabilities.getMaxAnisotropy(),
                4
            );

            sphereMaterial.map = texture;
            sphereMaterial.needsUpdate = true;
            moonThreeState.textureLoaded = true;

            if (moonThreeLoading) {
                moonThreeLoading.classList.add("hidden");
            }

        },
        undefined,
        error => {

            showError(
                "Unable to load lunar texture from Moon/data/moon-global.jpg."
            );
            console.error(
                "Moon texture failed to load:",
                error
            );

        }
    );

    moonThreeContainer.addEventListener(
        "wheel",
        event => {

            event.preventDefault();
            event.stopPropagation();

            const nextZoom =
                Math.min(
                    5.5,
                    Math.max(
                        2.2,
                        camera.position.z +
                        (event.deltaY > 0 ? 0.22 : -0.22)
                    )
                );

            camera.position.z = nextZoom;

        },
        { passive: false }
    );

    const syncMarkerPositions = () => {

        if (
            !moonThreeState.webglActive ||
            !moonThreeState.markerGroup ||
            !moonThreeState.camera ||
            !moonThreeState.renderer
        ) {

            return;

        }

        const width =
            moonThreeContainer.clientWidth || 1;

        const height =
            moonThreeContainer.clientHeight || 1;

        const cameraPosition =
            globeGroup.worldToLocal(
                camera.getWorldPosition(new THREE.Vector3())
            ).normalize();

        const missions =
            getMappableMissions();

        missions.forEach(
            mission => {

                const htmlMarker =
                    hardwareLayer.querySelector(
                        `.hardware-marker[data-mission-id="${mission.id}"]`
                    );

                if (!htmlMarker) {
                    return;
                }

                const marker =
                    moonThreeState.markerMap.get(mission.id);

                if (!marker) {
                    return;
                }

                const worldPosition =
                    marker.getWorldPosition(
                        new THREE.Vector3()
                    );

                const markerDirection =
                    marker.position.clone().normalize();

                const onVisibleHemisphere =
                    markerDirection.dot(cameraPosition) > 0.04;

                htmlMarker.style.visibility =
                    onVisibleHemisphere ? "" : "hidden";

                if (!onVisibleHemisphere) {
                    return;
                }

                const projected =
                    worldPosition.clone().project(camera);

                const screenX =
                    (projected.x * 0.5 + 0.5) * width;

                const screenY =
                    (-projected.y * 0.5 + 0.5) * height;

                htmlMarker.style.left =
                    `${(screenX / width) * 100}%`;

                htmlMarker.style.top =
                    `${(screenY / height) * 100}%`;

            }
        );

    };

    const animate = () => {

        moonThreeState.animationId =
            requestAnimationFrame(animate);

        syncMarkerPositions();
        renderer.render(scene, camera);

    };

    updateCanvasSize();
    animate();
    window.addEventListener("resize", updateCanvasSize);
    moonThreeState.isReady = true;

}

function initializeMoonMuseum() {

    console.log(
        "NASA Lunar Space Museum initializing..."
    );

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

    initializeMapDimensions();

    renderMarkers();

    renderTimeline();

    setupTimeline();

    setupMapInteractions();

    setupHomeButton();

    setupStorySystem();

    setupVisibility();

    /*
     * Archive.
     *
     * IMPORTANT:
     * This is now initialized as part
     * of the main application startup.
     */

    setupArchive();

    updateMoonLanguageUI();

    setupMoonImage();

    setupThreeMoon();

    resetMapPosition();

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

window.addEventListener(
    "resize",
    handleResize
);

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

window.addEventListener(
    "languagechange",
    () => {

        renderMarkers();
        const selectedYear =
            Number(timelineRange?.value || state.timelineYear);

        renderTimeline();

        if (timelineRange) {
            timelineRange.value =
                String(selectedYear);
        }

        updateTimeline();

        updateMoonLanguageUI();

        if (currentMission) {
            updateStoryContent();
            stopStoryVoice();
            speakCurrentSlide();
        }

        if (
            archivePanel?.classList.contains("open") &&
            archiveBtn
        ) {
            archiveBtn.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true
                })
            );
        }

    }
);
