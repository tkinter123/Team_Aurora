/* =========================================================
   HOME
========================================================= */

const homeButton = document.getElementById("exhibitionHome");

if (homeButton) {
    homeButton.addEventListener("click", () => {
        window.location.href = "../Space/space.html";
    });
}
