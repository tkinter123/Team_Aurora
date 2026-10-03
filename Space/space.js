/* =========================================================
   NASA SPACE JOURNEY
   Main JavaScript
========================================================= */


/* =========================================================
   DOM
========================================================= */

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


/* =========================================================
   SOLAR CONSTANTS
========================================================= */

const SOLAR_WIDTH = 4200;

const SOLAR_HEIGHT = 2600;

const SUN_X = 2100;

const SUN_Y = 1300;


/* =========================================================
   CAMERA
========================================================= */

let solarX = SUN_X;

let solarY = SUN_Y;

let solarZoom = 1;

const MIN_ZOOM = 0.45;

const MAX_ZOOM = 3.2;


/* =========================================================
   KEYBOARD STATE
========================================================= */

const keys = {};


/* =========================================================
   PLANET INFORMATION
========================================================= */

const planetData = {

    Mercury: {

        description:
            "Mercury is the smallest planet in the Solar System and the closest planet to the Sun.",

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

        type:
            "Terrestrial",

        day:
            "24 hours",

        year:
            "365 days"

    },


    Moon: {

        description:
            "The Moon is Earth's natural satellite and is the fifth-largest moon in the Solar System.",

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

        type:
            "Gas giant",

        day:
            "10.7 hours",

        year:
            "29.45 Earth years"

    }

};


/* =========================================================
   ORBITS
========================================================= */

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


/* =========================================================
   MOON ORBIT
========================================================= */

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


/* =========================================================
   CAMERA
========================================================= */

function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


/* =========================================================
   APPLY CAMERA
========================================================= */

function applySolarCamera() {

    const centerX =
        window.innerWidth / 2;

    const centerY =
        window.innerHeight / 2;


    const x =
        centerX -
        solarX * solarZoom;


    const y =
        centerY -
        solarY * solarZoom;


    solarWorld.style.transform =
        `translate(${x}px, ${y}px)
         scale(${solarZoom})`;

}


/* =========================================================
   RESET CAMERA
========================================================= */

function resetCamera() {

    solarX = SUN_X;

    solarY = SUN_Y;

    solarZoom = 1;

    applySolarCamera();

}


/* =========================================================
   UPDATE ORBITS
========================================================= */

function updateOrbits(dt) {

    let earthX = SUN_X;

    let earthY = SUN_Y;


    for (const name in orbitConfig) {

        const orbit =
            orbitConfig[name];


        orbit.angle +=
            orbit.speed * dt;


        const x =
            SUN_X +
            orbit.rx *
            Math.cos(orbit.angle);


        const y =
            SUN_Y +
            orbit.ry *
            Math.sin(orbit.angle);


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


    /* =====================================================
       MOON
    ====================================================== */

    moonOrbit.angle +=
        moonOrbit.speed * dt;


    const moonX =
        earthX +
        moonOrbit.rx *
        Math.cos(moonOrbit.angle);


    const moonY =
        earthY +
        moonOrbit.ry *
        Math.sin(moonOrbit.angle);


    if (planetEls.Moon) {

        planetEls.Moon.style.left =
            `${moonX}px`;

        planetEls.Moon.style.top =
            `${moonY}px`;

    }


    /* Move visual Moon orbit */

    const moonOrbitElement =
        document.querySelector(".moon-orbit");


    if (moonOrbitElement) {

        moonOrbitElement.style.left =
            `${earthX}px`;

        moonOrbitElement.style.top =
            `${earthY}px`;

    }

}


/* =========================================================
   MOVEMENT
========================================================= */

function updateSolarMovement(dt) {

    const move =
        4 *
        dt *
        Math.max(
            0.7,
            solarZoom
        );


    if (
        keys.w ||
        keys.arrowup
    ) {

        solarY -= move;

    }


    if (
        keys.s ||
        keys.arrowdown
    ) {

        solarY += move;

    }


    if (
        keys.a ||
        keys.arrowleft
    ) {

        solarX -= move;

    }


    if (
        keys.d ||
        keys.arrowright
    ) {

        solarX += move;

    }


    if (keys.q) {

        solarZoom +=
            0.015 * dt;

    }


    if (keys.e) {

        solarZoom -=
            0.015 * dt;

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


/* =========================================================
   KEYBOARD
========================================================= */

const movementKeys = new Set([

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
    { passive: false }
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
    { passive: false }
);


/* Clear keys if browser/tab loses focus */

window.addEventListener(
    "blur",
    () => {

        Object.keys(keys)
            .forEach(key => {

                keys[key] = false;

            });

    }
);


/* =========================================================
   DRAG / PAN
========================================================= */

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
            event.target.closest(".modal")
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

        } catch (error) {
            /* Ignore unsupported pointer capture */
        }

    }
);


spaceView.addEventListener(
    "pointermove",
    event => {

        if (
            !dragging ||
            event.pointerId !== dragPointerId
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


/* =========================================================
   WHEEL ZOOM
========================================================= */

spaceView.addEventListener(
    "wheel",
    event => {

        event.preventDefault();


        const zoomAmount =
            event.deltaY < 0
                ? 0.08
                : -0.08;


        solarZoom =
            clamp(
                solarZoom + zoomAmount,
                MIN_ZOOM,
                MAX_ZOOM
            );


        applySolarCamera();

    },
    {
        passive: false
    }
);


/* =========================================================
   MOBILE CONTROLS
========================================================= */

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

            } catch (error) {
                /* Ignore unsupported pointer capture */
            }

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


/* =========================================================
   MOBILE ACTION BUTTONS
========================================================= */

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
                            solarZoom + 0.15,
                            MIN_ZOOM,
                            MAX_ZOOM
                        );

                }


                if (
                    action === "zoom-out"
                ) {

                    solarZoom =
                        clamp(
                            solarZoom - 0.15,
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


/* =========================================================
   PLANET MODAL
========================================================= */

const planetModal =
    document.getElementById("planetModal");

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

const planetVisual =
    document.getElementById("planetVisual");

const closeModal =
    document.getElementById("closeModal");

const closeModalButton =
    document.getElementById("closeModalButton");


let lastFocusedPlanet = null;


/* =========================================================
   OPEN PLANET MODAL
========================================================= */

function openPlanetModal(name) {

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


    closeModal.focus();

}


/* =========================================================
   CLOSE PLANET MODAL
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
   PLANET NAVIGATION
========================================================= */

const planetPages = {
    Moon: "../Moon/moon.html",
    Mars: "../Mars/mars.html"
};


/* =========================================================
   PLANET CLICK
========================================================= */

document
    .querySelectorAll(".planet")
    .forEach(planet => {

        planet.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const name =
                    planet.dataset.planet;


                /*
                 * Moon and Mars open
                 * their dedicated HTML pages.
                 */

                if (planetPages[name]) {

                    window.location.href =
                        planetPages[name];

                    return;
                }


                /*
                 * All other planets open
                 * the information modal.
                 */

                openPlanetModal(name);

            }
        );


        /* Keyboard accessibility */

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


                    if (planetPages[name]) {

                        window.location.href =
                            planetPages[name];

                        return;
                    }


                    openPlanetModal(name);

                }

            }
        );

    });


/* =========================================================
   CLOSE BUTTONS
========================================================= */

closeModal.addEventListener(
    "click",
    closePlanetModal
);


closeModalButton.addEventListener(
    "click",
    closePlanetModal
);


/* Click backdrop */

document
    .querySelector(".modal-backdrop")
    .addEventListener(
        "click",
        closePlanetModal
    );


/* Escape key */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            planetModal.classList.contains("open")
        ) {

            closePlanetModal();

        }

    }
);


/* =========================================================
   ANIMATION LOOP
========================================================= */

let lastTime =
    performance.now();


function animationLoop(time) {

    const dt =
        Math.min(
            (time - lastTime) / 16.67,
            3
        );


    lastTime =
        time;


    updateOrbits(dt);

    updateSolarMovement(dt);


    requestAnimationFrame(
        animationLoop
    );

}


/* =========================================================
   INITIALIZATION
========================================================= */

updateOrbits(0);

applySolarCamera();

requestAnimationFrame(
    animationLoop
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    applySolarCamera
);


/* =========================================================
   PREVENT CONTEXT MENU
========================================================= */

spaceView.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);
