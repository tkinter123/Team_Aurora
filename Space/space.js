/* =========================================================
   NASA SPACE JOURNEY
========================================================= */

"use strict";


/* =========================================================
   DOM
========================================================= */

const spaceView =
    document.getElementById("spaceView");

const solarWorld =
    document.getElementById("solarWorld");

const cameraXElement =
    document.getElementById("cameraX");

const cameraYElement =
    document.getElementById("cameraY");

const cameraZoomElement =
    document.getElementById("cameraZoom");

const planetModal =
    document.getElementById("planetModal");

const planetVisual =
    document.getElementById("planetVisual");

const planetTitle =
    document.getElementById("planetTitle");

const planetDescription =
    document.getElementById("planetDescription");

const planetType =
    document.getElementById("planetType");

const planetDay =
    document.getElementById("planetDay");

const planetYear =
    document.getElementById("planetYear");

const closeModal =
    document.getElementById("closeModal");

const closeModalButton =
    document.getElementById("closeModalButton");


/* =========================================================
   PLANETS
========================================================= */

const planetElements = {};

document
    .querySelectorAll(".planet")
    .forEach(planet => {

        planetElements[
            planet.dataset.planet
        ] = planet;

    });


/* =========================================================
   SOLAR WORLD
========================================================= */

const SOLAR_WIDTH = 4200;
const SOLAR_HEIGHT = 2600;

const SUN_X = 2100;
const SUN_Y = 1300;


/* =========================================================
   CAMERA
========================================================= */

let cameraX = SUN_X;
let cameraY = SUN_Y;

let zoom = 1;

const MIN_ZOOM = 0.45;
const MAX_ZOOM = 3.2;


/* =========================================================
   INPUT
========================================================= */

const keys = {};

let dragging = false;

let dragPointerId = null;

let previousPointerX = 0;
let previousPointerY = 0;

let dragDistance = 0;


/* =========================================================
   PLANET DATA
========================================================= */

const planetData = {

    Mercury: {
        description:
            "Mercury is the smallest planet in the Solar System and the closest planet to the Sun.",
        type: "Terrestrial",
        day: "59 Earth days",
        year: "88 Earth days"
    },

    Venus: {
        description:
            "Venus is a rocky planet with a thick atmosphere and extremely high surface temperatures.",
        type: "Terrestrial",
        day: "243 Earth days",
        year: "225 Earth days"
    },

    Earth: {
        description:
            "Earth is the only known planet to support life and is our home world.",
        type: "Terrestrial",
        day: "24 hours",
        year: "365 days"
    },

    Moon: {
        description:
            "Earth's natural satellite and humanity's first destination beyond our planet.",
        type: "Natural satellite",
        day: "29.5 Earth days",
        year: "27.3 Earth days"
    },

    Mars: {
        description:
            "Mars is a cold desert world and one of humanity's most important targets for exploration.",
        type: "Terrestrial",
        day: "24.6 hours",
        year: "687 Earth days"
    },

    Jupiter: {
        description:
            "Jupiter is the largest planet in the Solar System and a massive gas giant.",
        type: "Gas giant",
        day: "9.9 hours",
        year: "11.86 Earth years"
    },

    Saturn: {
        description:
            "Saturn is a gas giant famous for its spectacular system of icy rings.",
        type: "Gas giant",
        day: "10.7 hours",
        year: "29.45 Earth years"
    }

};


/* =========================================================
   PLANET DESTINATIONS
========================================================= */

const planetPages = {

    Moon:
        "../Moon/moon.html",

    Mars:
        "../Mars/mars.html"

};


/* =========================================================
   ORBIT DATA
========================================================= */

const orbitData = {

    Mercury: {
        rx: 300,
        ry: 180,
        angle: 0,
        speed: 0.00075
    },

    Venus: {
        rx: 450,
        ry: 260,
        angle: 1.1,
        speed: 0.00048
    },

    Earth: {
        rx: 625,
        ry: 355,
        angle: 2.2,
        speed: 0.00030
    },

    Mars: {
        rx: 825,
        ry: 465,
        angle: 3.1,
        speed: 0.00022
    },

    Jupiter: {
        rx: 1100,
        ry: 610,
        angle: 4.2,
        speed: 0.00011
    },

    Saturn: {
        rx: 1450,
        ry: 790,
        angle: 5.0,
        speed: 0.00007
    }

};


/* =========================================================
   MOON DATA
========================================================= */

const moonOrbit = {

    rx: 90,
    ry: 50,

    angle: 0,

    speed: 0.0022

};


/* =========================================================
   EARTH POSITION
========================================================= */

let earthX = SUN_X;
let earthY = SUN_Y;


/* =========================================================
   CLAMP
========================================================= */

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


/* =========================================================
   CAMERA
========================================================= */

function applyCamera() {

    if (!solarWorld) {
        return;
    }


    const viewportWidth =
        window.innerWidth;

    const viewportHeight =
        window.innerHeight;


    /*
     * Keep the selected camera coordinate
     * approximately in the center of the screen.
     */

    const offsetX =
        viewportWidth / 2 -
        cameraX * zoom;

    const offsetY =
        viewportHeight / 2 -
        cameraY * zoom;


    solarWorld.style.transform =
        `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${zoom})`;


    if (cameraXElement) {

        cameraXElement.textContent =
            Math.round(cameraX);

    }


    if (cameraYElement) {

        cameraYElement.textContent =
            Math.round(cameraY);

    }


    if (cameraZoomElement) {

        cameraZoomElement.textContent =
            `${Math.round(zoom * 100)}%`;

    }

}


/* =========================================================
   CAMERA LIMITS
========================================================= */

function constrainCamera() {

    cameraX =
        clamp(
            cameraX,
            0,
            SOLAR_WIDTH
        );

    cameraY =
        clamp(
            cameraY,
            0,
            SOLAR_HEIGHT
        );

    zoom =
        clamp(
            zoom,
            MIN_ZOOM,
            MAX_ZOOM
        );

}


/* =========================================================
   RESET CAMERA
========================================================= */

function resetCamera() {

    cameraX = SUN_X;
    cameraY = SUN_Y;

    zoom = 1;

    constrainCamera();

    applyCamera();

}


/* =========================================================
   PLANET ANIMATION
========================================================= */

let lastFrameTime =
    performance.now();


function updatePlanets(
    deltaTime
) {

    let currentEarthX =
        SUN_X;

    let currentEarthY =
        SUN_Y;


    Object.entries(
        orbitData
    ).forEach(
        ([name, orbit]) => {

            orbit.angle +=
                orbit.speed *
                deltaTime;


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
                planetElements[name];


            if (planet) {

                planet.style.left =
                    `${x}px`;

                planet.style.top =
                    `${y}px`;

            }


            if (name === "Earth") {

                currentEarthX =
                    x;

                currentEarthY =
                    y;

            }

        }
    );


    earthX =
        currentEarthX;

    earthY =
        currentEarthY;


    /*
     * Moon
     */

    moonOrbit.angle +=
        moonOrbit.speed *
        deltaTime;


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


    const moon =
        planetElements.Moon;


    if (moon) {

        moon.style.left =
            `${moonX}px`;

        moon.style.top =
            `${moonY}px`;

    }


    /*
     * Moon orbit visual follows Earth.
     */

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


/* =========================================================
   KEYBOARD CAMERA
========================================================= */

function updateKeyboard(
    deltaTime
) {

    const speed =
        4 *
        deltaTime *
        Math.max(
            0.7,
            zoom
        );


    if (
        keys.w ||
        keys.arrowup
    ) {

        cameraY -= speed;

    }


    if (
        keys.s ||
        keys.arrowdown
    ) {

        cameraY += speed;

    }


    if (
        keys.a ||
        keys.arrowleft
    ) {

        cameraX -= speed;

    }


    if (
        keys.d ||
        keys.arrowright
    ) {

        cameraX += speed;

    }


    if (keys.q) {

        zoom +=
            0.0015 *
            deltaTime;

    }


    if (keys.e) {

        zoom -=
            0.0015 *
            deltaTime;

    }


    constrainCamera();

    applyCamera();

}


/* =========================================================
   ANIMATION LOOP
========================================================= */

function animationLoop(
    timestamp
) {

    const deltaTime =
        Math.min(
            timestamp -
            lastFrameTime,
            50
        );


    lastFrameTime =
        timestamp;


    updatePlanets(
        deltaTime
    );

    updateKeyboard(
        deltaTime
    );


    requestAnimationFrame(
        animationLoop
    );

}


/* =========================================================
   KEYBOARD EVENTS
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                "w",
                "a",
                "s",
                "d",
                "q",
                "e"
            ].includes(key)
        ) {

            event.preventDefault();

            keys[key] = true;

        }


        if (
            key === "escape" &&
            planetModal.classList.contains(
                "open"
            )
        ) {

            closePlanetModal();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = false;

    }
);


/* =========================================================
   POINTER DRAG
========================================================= */

spaceView.addEventListener(
    "pointerdown",
    event => {

        /*
         * Don't begin camera dragging from a planet
         * or control button.
         */

        if (
            event.target.closest(
                ".planet, button, .modal"
            )
        ) {

            return;

        }


        dragging = true;

        dragPointerId =
            event.pointerId;

        previousPointerX =
            event.clientX;

        previousPointerY =
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
            previousPointerX;


        const dy =
            event.clientY -
            previousPointerY;


        previousPointerX =
            event.clientX;

        previousPointerY =
            event.clientY;


        dragDistance +=
            Math.abs(dx) +
            Math.abs(dy);


        cameraX -=
            dx / zoom;


        cameraY -=
            dy / zoom;


        constrainCamera();

        applyCamera();

    }
);


function stopDragging() {

    dragging = false;

    dragPointerId = null;

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
    "pointerleave",
    event => {

        if (
            event.pointerType ===
            "mouse"
        ) {

            stopDragging();

        }

    }
);


/* =========================================================
   WHEEL ZOOM
========================================================= */

spaceView.addEventListener(
    "wheel",
    event => {

        event.preventDefault();


        const direction =
            event.deltaY < 0
                ? 1
                : -1;


        const amount =
            0.08 *
            direction;


        zoom =
            clamp(
                zoom + amount,
                MIN_ZOOM,
                MAX_ZOOM
            );


        applyCamera();

    },
    {
        passive: false
    }
);


/* =========================================================
   MOBILE DIRECTION BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".direction"
    )
    .forEach(
        button => {

            const key =
                button.dataset.key;


            function startMove(
                event
            ) {

                event.preventDefault();
                event.stopPropagation();


                keys[key] =
                    true;


                button.classList.add(
                    "active"
                );


                try {

                    button.setPointerCapture(
                        event.pointerId
                    );

                } catch (error) {}

            }


            function stopMove(
                event
            ) {

                event.preventDefault();
                event.stopPropagation();


                keys[key] =
                    false;


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

                    keys[key] =
                        false;

                    button.classList.remove(
                        "active"
                    );

                }
            );

        }
    );


/* =========================================================
   MOBILE ZOOM / RESET
========================================================= */

document
    .querySelectorAll(
        ".zoom-btn, .reset-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();


                    const action =
                        button.dataset.action;


                    if (
                        action ===
                        "zoom-in"
                    ) {

                        zoom =
                            clamp(
                                zoom + .2,
                                MIN_ZOOM,
                                MAX_ZOOM
                            );

                    }


                    if (
                        action ===
                        "zoom-out"
                    ) {

                        zoom =
                            clamp(
                                zoom - .2,
                                MIN_ZOOM,
                                MAX_ZOOM
                            );

                    }


                    if (
                        action ===
                        "reset"
                    ) {

                        resetCamera();

                        return;

                    }


                    applyCamera();

                }
            );

        }
    );


/* =========================================================
   PLANET MODAL
========================================================= */

let lastFocusedPlanet =
    null;


function openPlanetModal(
    name
) {

    const data =
        planetData[name];


    if (!data) {
        return;
    }


    planetTitle.textContent =
        name;


    planetDescription.textContent =
        data.description;


    planetType.textContent =
        data.type;


    planetDay.textContent =
        data.day;


    planetYear.textContent =
        data.year;


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


    requestAnimationFrame(
        () => {

            closeModal.focus();

        }
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closePlanetModal() {

    planetModal.classList.remove(
        "open"
    );


    planetModal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        lastFocusedPlanet &&
        typeof lastFocusedPlanet.focus ===
            "function"
    ) {

        lastFocusedPlanet.focus();

    }

}


/* =========================================================
   PLANET CLICK
========================================================= */

document
    .querySelectorAll(
        ".planet"
    )
    .forEach(
        planet => {

            planet.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    /*
                     * Ignore a click that was actually
                     * a camera drag.
                     */

                    if (
                        dragDistance > 12
                    ) {

                        dragDistance = 0;

                        return;

                    }


                    const name =
                        planet.dataset.planet;


                    /*
                     * Moon and Mars have dedicated
                     * pages.
                     */

                    if (
                        planetPages[name]
                    ) {

                        window.location.href =
                            planetPages[name];

                        return;

                    }


                    openPlanetModal(
                        name
                    );

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

                            window.location.href =
                                planetPages[name];

                            return;

                        }


                        openPlanetModal(
                            name
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   MODAL EVENTS
========================================================= */

closeModal.addEventListener(
    "click",
    closePlanetModal
);


closeModalButton.addEventListener(
    "click",
    closePlanetModal
);


document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(
        element => {

            element.addEventListener(
                "click",
                closePlanetModal
            );

        }
    );


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeSpace() {

    /*
     * Make sure the initial camera is valid.
     */

    constrainCamera();

    applyCamera();


    /*
     * Put all planets in their initial positions.
     */

    updatePlanets(0);


    /*
     * Start animation.
     */

    requestAnimationFrame(
        animationLoop
    );


    console.log(
        "NASA Space Journey initialized."
    );

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSpace,
        {
            once: true
        }
    );

} else {

    initializeSpace();

}
