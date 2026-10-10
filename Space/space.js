

const spaceView =
    document.getElementById("spaceView");

const solarWorld =
    document.getElementById("solarWorld");

const planetEls = {};

document
    .querySelectorAll(".planet")
    .forEach(planet => {

        planetEls[
            planet.dataset.planet
        ] = planet;

    });

const SOLAR_WIDTH = 4200;
const SOLAR_HEIGHT = 2600;

const SUN_X = 2100;
const SUN_Y = 1300;

let solarX = SUN_X;
let solarY = SUN_Y;

let solarZoom = 1;

const MIN_ZOOM = 0.45;
const MAX_ZOOM = 3.2;

const keys = {};

const planetData = {

    Mercury: {

        description:
            "Mercury is the smallest planet in the Solar System and the closest planet to the Sun.",

        bn: {
            name: "বুধ",
            description: "বুধ সৌরজগতের সবচেয়ে ছোট গ্রহ এবং সূর্যের সবচেয়ে কাছের গ্রহ।",
            type: "শিলাময় গ্রহ",
            day: "পৃথিবীর ৫৯ দিন",
            year: "পৃথিবীর ৮৮ দিন"
        },

        type:
            "Terrestrial",

        day:
            "59 Earth days",

        year:
            "88 Earth days"

    },

    Venus: {

        description:
            "Venus is a rocky planet with a thick atmosphere and extremely high surface temperatures.",

        bn: {
            name: "শুক্র",
            description: "শুক্র একটি পাথুরে গ্রহ। এর বায়ুমণ্ডল ঘন এবং পৃষ্ঠের তাপমাত্রা অত্যন্ত বেশি।",
            type: "শিলাময় গ্রহ",
            day: "পৃথিবীর ২৪৩ দিন",
            year: "পৃথিবীর ২২৫ দিন"
        },

        type:
            "Terrestrial",

        day:
            "243 Earth days",

        year:
            "225 Earth days"

    },

    Earth: {

        description:
            "Earth is our home planet and the only world currently known to support life.",

        bn: {
            name: "পৃথিবী",
            description: "পৃথিবী আমাদের আবাসগ্রহ এবং এখন পর্যন্ত জানা একমাত্র প্রাণধারী জগৎ।",
            type: "শিলাময় গ্রহ",
            day: "২৪ ঘণ্টা",
            year: "৩৬৫ দিন"
        },

        type:
            "Terrestrial",

        day:
            "24 hours",

        year:
            "365 days"

    },

    Moon: {

        description:
            "The Moon is Earth's natural satellite and the fifth-largest moon in the Solar System.",

        bn: {
            name: "চাঁদ",
            description: "চাঁদ পৃথিবীর প্রাকৃতিক উপগ্রহ এবং সৌরজগতের পঞ্চম বৃহত্তম উপগ্রহ।",
            type: "প্রাকৃতিক উপগ্রহ",
            day: "পৃথিবীর ২৭.৩ দিন",
            year: "পৃথিবীর ২৭.৩ দিন"
        },

        type:
            "Natural satellite",

        day:
            "27.3 Earth days",

        year:
            "27.3 Earth days"

    },

    Mars: {

        description:
            "Mars is a cold, rocky planet known for its reddish surface and enormous volcanic and canyon systems.",

        bn: {
            name: "মঙ্গল",
            description: "মঙ্গল একটি শীতল, পাথুরে গ্রহ। এর লালচে পৃষ্ঠে বিশাল আগ্নেয়গিরি ও গিরিখাত রয়েছে।",
            type: "শিলাময় গ্রহ",
            day: "২৪.৬ ঘণ্টা",
            year: "পৃথিবীর ৬৮৭ দিন"
        },

        type:
            "Terrestrial",

        day:
            "24.6 hours",

        year:
            "687 Earth days"

    },

    Jupiter: {

        description:
            "Jupiter is the largest planet in the Solar System and is famous for its powerful storms and Great Red Spot.",

        bn: {
            name: "বৃহস্পতি",
            description: "বৃহস্পতি সৌরজগতের বৃহত্তম গ্রহ। এটি প্রবল ঝড় ও মহা লাল দাগের জন্য পরিচিত।",
            type: "গ্যাসীয় দৈত্য গ্রহ",
            day: "৯.৯ ঘণ্টা",
            year: "পৃথিবীর ১১.৮৬ বছর"
        },

        type:
            "Gas giant",

        day:
            "9.9 hours",

        year:
            "11.86 Earth years"

    },

    Saturn: {

        description:
            "Saturn is a gas giant best known for its spectacular system of icy rings.",

        bn: {
            name: "শনি",
            description: "শনি একটি গ্যাসীয় দৈত্য গ্রহ, যা তার মনোরম বরফের বলয়ের জন্য বিখ্যাত।",
            type: "গ্যাসীয় দৈত্য গ্রহ",
            day: "১০.৭ ঘণ্টা",
            year: "পৃথিবীর ২৯.৪৫ বছর"
        },

        type:
            "Gas giant",

        day:
            "10.7 hours",

        year:
            "29.45 Earth years"

    }

};

const orbitConfig = {

    Mercury: {

        rx: 300,
        ry: 180,

        speed: 0.00200,

        angle:
            Math.atan2(
                (1150 - SUN_Y) / 180,
                (1450 - SUN_X) / 300
            )

    },

    Venus: {

        rx: 450,
        ry: 260,

        speed: 0.00150,

        angle:
            Math.atan2(
                (1470 - SUN_Y) / 260,
                (1700 - SUN_X) / 450
            )

    },

    Earth: {

        rx: 625,
        ry: 355,

        speed: 0.00110,

        angle:
            Math.atan2(
                (1070 - SUN_Y) / 355,
                (2400 - SUN_X) / 625
            )

    },

    Mars: {

        rx: 825,
        ry: 465,

        speed: 0.00090,

        angle:
            Math.atan2(
                (1430 - SUN_Y) / 465,
                (2800 - SUN_X) / 825
            )

    },

    Jupiter: {

        rx: 1100,
        ry: 610,

        speed: 0.00050,

        angle:
            Math.atan2(
                (1000 - SUN_Y) / 610,
                (3300 - SUN_X) / 1100
            )

    },

    Saturn: {

        rx: 1450,
        ry: 790,

        speed: 0.00030,

        angle:
            Math.atan2(
                (1500 - SUN_Y) / 790,
                (3850 - SUN_X) / 1450
            )

    }

};

const moonOrbit = {

    rx: 90,
    ry: 50,

    speed: 0.00450,

    angle:
        Math.atan2(
            (930 - 1070) / 50,
            (2530 - 2400) / 90
        )

};

function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}

const cameraX =
    document.getElementById("cameraX");

const cameraY =
    document.getElementById("cameraY");

const cameraZoom =
    document.getElementById("cameraZoom");

function updateCameraStatus() {

    if (cameraX) {
        cameraX.textContent =
            Math.round(solarX);
    }

    if (cameraY) {
        cameraY.textContent =
            Math.round(solarY);
    }

    if (cameraZoom) {
        cameraZoom.textContent =
            `${Math.round(solarZoom * 100)}%`;
    }

}

function applySolarCamera() {

    const centerX =
        window.innerWidth / 2;

    const centerY =
        window.innerHeight / 2;

    const screenX =
        centerX -
        solarX * solarZoom;

    const screenY =
        centerY -
        solarY * solarZoom;

    solarWorld.style.transform =
        `translate3d(
            ${screenX}px,
            ${screenY}px,
            0
        ) scale(${solarZoom})`;

    updateCameraStatus();

}

function resetCamera() {

    solarX = SUN_X;
    solarY = SUN_Y;

    solarZoom = 1;

    applySolarCamera();

}

function updateOrbits(dt) {

    let earthX = SUN_X;
    let earthY = SUN_Y;

    for (
        const name in orbitConfig
    ) {

        const orbit =
            orbitConfig[name];

        orbit.angle +=
            orbit.speed * dt;

        const x =
            SUN_X +
            orbit.rx *
            Math.cos(
                orbit.angle
            );

        const y =
            SUN_Y +
            orbit.ry *
            Math.sin(
                orbit.angle
            );

        const planet =
            planetEls[name];

        if (planet) {

            planet.style.left =
                `${x}px`;

            planet.style.top =
                `${y}px`;

        }

        if (name === "Earth") {

            earthX = x;
            earthY = y;

        }

    }

    moonOrbit.angle +=
        moonOrbit.speed * dt;

    const moonX =
        earthX +
        moonOrbit.rx *
        Math.cos(
            moonOrbit.angle
        );

    const moonY =
        earthY +
        moonOrbit.ry *
        Math.sin(
            moonOrbit.angle
        );

    if (planetEls.Moon) {

        planetEls.Moon.style.left =
            `${moonX}px`;

        planetEls.Moon.style.top =
            `${moonY}px`;

    }

    const moonOrbitElement =
        document.querySelector(
            ".moon-orbit"
        );

    if (moonOrbitElement) {

        moonOrbitElement.style.left =
            `${earthX}px`;

        moonOrbitElement.style.top =
            `${earthY}px`;

    }

}

function updateSolarMovement(dt) {

    const movementSpeed =
        4 *
        dt *
        Math.max(
            .7,
            solarZoom
        );

    if (
        keys.w ||
        keys.arrowup
    ) {

        solarY -=
            movementSpeed;

    }

    if (
        keys.s ||
        keys.arrowdown
    ) {

        solarY +=
            movementSpeed;

    }

    if (
        keys.a ||
        keys.arrowleft
    ) {

        solarX -=
            movementSpeed;

    }

    if (
        keys.d ||
        keys.arrowright
    ) {

        solarX +=
            movementSpeed;

    }

    if (keys.q) {

        solarZoom +=
            .015 * dt;

    }

    if (keys.e) {

        solarZoom -=
            .015 * dt;

    }

    solarZoom =
        clamp(
            solarZoom,
            MIN_ZOOM,
            MAX_ZOOM
        );

    solarX =
        clamp(
            solarX,
            0,
            SOLAR_WIDTH
        );

    solarY =
        clamp(
            solarY,
            0,
            SOLAR_HEIGHT
        );

    applySolarCamera();

}

const movementKeys =
    new Set([

        "w",
        "a",
        "s",
        "d",

        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",

        "q",
        "e"

    ]);

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        if (
            movementKeys.has(key)
        ) {

            event.preventDefault();

            keys[key] = true;

        }

    },
    {
        passive: false
    }
);

window.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();

        if (
            movementKeys.has(key)
        ) {

            event.preventDefault();

            keys[key] = false;

        }

    },
    {
        passive: false
    }
);

function clearKeys() {

    Object.keys(keys)
        .forEach(key => {

            keys[key] = false;

        });

    document
        .querySelectorAll(".control-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });

}

window.addEventListener(
    "blur",
    clearKeys
);

let dragging = false;

let dragPointerId = null;

let previousX = 0;
let previousY = 0;

let dragDistance = 0;

spaceView.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target.closest(".planet") ||
            event.target.closest("#mobileControls") ||
            event.target.closest(".modal") ||
            event.target.closest("#spaceHud")
        ) {

            return;

        }

        dragging = true;

        dragPointerId =
            event.pointerId;

        previousX =
            event.clientX;

        previousY =
            event.clientY;

        dragDistance = 0;

        try {

            spaceView.setPointerCapture(
                event.pointerId
            );

        } catch (error) {}

    }
);

spaceView.addEventListener(
    "pointermove",
    event => {

        if (
            !dragging ||
            event.pointerId !==
                dragPointerId
        ) {

            return;

        }

        const dx =
            event.clientX -
            previousX;

        const dy =
            event.clientY -
            previousY;

        previousX =
            event.clientX;

        previousY =
            event.clientY;

        dragDistance +=
            Math.abs(dx) +
            Math.abs(dy);

        solarX -=
            dx /
            solarZoom *
            1.3;

        solarY -=
            dy /
            solarZoom *
            1.3;

        solarX =
            clamp(
                solarX,
                0,
                SOLAR_WIDTH
            );

        solarY =
            clamp(
                solarY,
                0,
                SOLAR_HEIGHT
            );

        applySolarCamera();

    }
);

function stopDragging(event) {

    if (
        event.pointerId ===
        dragPointerId
    ) {

        dragging = false;

        dragPointerId = null;

    }

}

spaceView.addEventListener(
    "pointerup",
    stopDragging
);

spaceView.addEventListener(
    "pointercancel",
    stopDragging
);

spaceView.addEventListener(
    "wheel",
    event => {

        event.preventDefault();

        const amount =
            event.deltaY < 0
                ? .08
                : -.08;

        solarZoom =
            clamp(
                solarZoom + amount,
                MIN_ZOOM,
                MAX_ZOOM
            );

        applySolarCamera();

    },
    {
        passive: false
    }
);

document
    .querySelectorAll(".direction")
    .forEach(button => {

        const key =
            button.dataset.key;

        function startMove(event) {

            event.preventDefault();
            event.stopPropagation();

            keys[key] = true;

            button.classList.add(
                "active"
            );

            try {

                button.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {}

        }

        function stopMove(event) {

            event.preventDefault();
            event.stopPropagation();

            keys[key] = false;

            button.classList.remove(
                "active"
            );

        }

        button.addEventListener(
            "pointerdown",
            startMove
        );

        button.addEventListener(
            "pointerup",
            stopMove
        );

        button.addEventListener(
            "pointercancel",
            stopMove
        );

        button.addEventListener(
            "lostpointercapture",
            () => {

                keys[key] = false;

                button.classList.remove(
                    "active"
                );

            }
        );

    });

document
    .querySelectorAll(
        ".zoom-btn, .reset-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();
                event.stopPropagation();

                const action =
                    button.dataset.action;

                if (
                    action === "zoom-in"
                ) {

                    solarZoom =
                        clamp(
                            solarZoom + .15,
                            MIN_ZOOM,
                            MAX_ZOOM
                        );

                }

                if (
                    action === "zoom-out"
                ) {

                    solarZoom =
                        clamp(
                            solarZoom - .15,
                            MIN_ZOOM,
                            MAX_ZOOM
                        );

                }

                if (
                    action === "reset"
                ) {

                    resetCamera();

                    return;

                }

                applySolarCamera();

            }
        );

    });

const planetModal =
    document.getElementById(
        "planetModal"
    );

const planetTitle =
    document.getElementById(
        "planetTitle"
    );

const planetDescription =
    document.getElementById(
        "planetDescription"
    );

const planetType =
    document.getElementById(
        "planetType"
    );

const planetDay =
    document.getElementById(
        "planetDay"
    );

const planetYear =
    document.getElementById(
        "planetYear"
    );

const planetVisual =
    document.getElementById(
        "planetVisual"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const closeModalButton =
    document.getElementById(
        "closeModalButton"
    );

let lastFocusedPlanet = null;

const planetPages = {

    Moon:
        "../Moon/moon.html",

    Mars:
        "../Mars/mars.html"

};

let planetPageTransitioning = false;

function playSpaceWarpEffect() {

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        return;

    }

    const travelEffect =
        document.getElementById(
            "spaceTravelEffect"
        );

    if (!travelEffect) {
        return;
    }

    travelEffect.classList.remove(
        "active"
    );

    void travelEffect.offsetWidth;

    travelEffect.classList.add(
        "active"
    );

}

function animateCameraToMoon(duration) {

    const moon =
        planetEls.Moon;

    if (!moon || !solarWorld) {
        return;
    }

    const startX =
        solarX;

    const startY =
        solarY;

    const startZoom =
        solarZoom;

    const targetX =
        moon.offsetLeft;

    const targetY =
        moon.offsetTop;

    const targetZoom =
        MAX_ZOOM;

    const startTime =
        performance.now();

    function step(time) {

        const progress =
            Math.min(
                (time - startTime) / duration,
                1
            );

        const acceleration =
            progress * progress * progress;

        solarX =
            startX +
            (targetX - startX) * acceleration;

        solarY =
            startY +
            (targetY - startY) * acceleration;

        solarZoom =
            startZoom +
            (targetZoom - startZoom) * acceleration;

        applySolarCamera();

        if (progress < 1) {

            requestAnimationFrame(step);

        }

    }

    requestAnimationFrame(step);

}

function navigateToPlanetPage(name) {

    const destination =
        planetPages[name];

    if (
        !destination ||
        planetPageTransitioning
    ) {

        return;

    }

    if (
        name !== "Moon" ||
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        window.location.href =
            window.ProjectLanguage?.withLanguage(destination) || destination;

        return;

    }

    planetPageTransitioning =
        true;

    animateCameraToMoon(3800);

    playSpaceWarpEffect();

    window.setTimeout(
        () => {

            window.location.href =
                window.ProjectLanguage?.withLanguage(destination) || destination;

        },
        4000
    );

}

function openPlanetModal(name) {

    const data =
        planetData[name];

    if (!data) {
        return;
    }

    const localizedData =
        window.ProjectLanguage?.isBangla
            ? data.bn
            : null;

    planetTitle.textContent =
        localizedData?.name ||
        window.ProjectLanguage?.translate(name) ||
        name;

    planetDescription.textContent =
        localizedData?.description || data.description;

    planetType.textContent =
        localizedData?.type ||
        window.ProjectLanguage?.translate(data.type) ||
        data.type;

    planetDay.textContent =
        localizedData?.day || data.day;

    planetYear.textContent =
        localizedData?.year || data.year;

    planetVisual.className =
        `planet-visual ${name.toLowerCase()}`;

    planetModal.classList.add(
        "open"
    );

    planetModal.setAttribute(
        "aria-hidden",
        "false"
    );

    lastFocusedPlanet =
        document.activeElement;

    document.body.style.overflow =
        "hidden";

    requestAnimationFrame(() => {

        closeModal.focus();

    });

}

window.addEventListener(
    "languagechange",
    () => {

        if (
            planetModal.classList.contains("open") &&
            lastFocusedPlanet
        ) {
            const planet = lastFocusedPlanet;
            openPlanetModal(planet.dataset.planet);
            lastFocusedPlanet = planet;
        }

    }
);

function closePlanetModal() {

    planetModal.classList.remove(
        "open"
    );

    planetModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    if (
        lastFocusedPlanet &&
        typeof lastFocusedPlanet.focus ===
            "function"
    ) {

        lastFocusedPlanet.focus();

    }

}

document
    .querySelectorAll(".planet")
    .forEach(planet => {

        planet.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                /*
                 * Prevent a planet from opening
                 * when the user was dragging.
                 */
                if (dragDistance > 12) {
                    return;
                }

                const name =
                    planet.dataset.planet;

                if (
                    planetPages[name]
                ) {

                    navigateToPlanetPage(name);

                    return;

                }

                openPlanetModal(name);

            }
        );

        planet.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    const name =
                        planet.dataset.planet;

                    if (
                        planetPages[name]
                    ) {

                        navigateToPlanetPage(name);

                        return;

                    }

                    openPlanetModal(name);

                }

            }
        );

    });

closeModal.addEventListener(
    "click",
    closePlanetModal
);

closeModalButton.addEventListener(
    "click",
    closePlanetModal
);

document
    .querySelector(".modal-backdrop")
    .addEventListener(
        "click",
        closePlanetModal
    );

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            planetModal.classList.contains(
                "open"
            )
        ) {

            closePlanetModal();

        }

    }
);

let lastTime =
    performance.now();

function animationLoop(time) {

    const delta =
        Math.min(
            (time - lastTime) / 16.67,
            3
        );

    lastTime =
        time;

    updateOrbits(delta);

    updateSolarMovement(delta);

    requestAnimationFrame(
        animationLoop
    );

}

updateOrbits(0);

applySolarCamera();

playSpaceWarpEffect();

requestAnimationFrame(
    animationLoop
);

window.addEventListener(
    "resize",
    () => {

        applySolarCamera();

    }
);

spaceView.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);
