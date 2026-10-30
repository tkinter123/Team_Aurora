const stages = [
  { kicker:"BEGINNING OF LUNAR EXPLORATION", title:"Hi, Explorer!", text:"The Moon and Earth are 384,400 km apart. Mars is about 225 million km away.<br>Today, we begin the journey to conquer them.", footer:"BEGINNING OF LUNAR EXPLORATION", artifacts:[{name:"THE MOON",note:"Our closest celestial neighbor.",image:"1_1_moon.png"},{name:"MARS",note:"The next frontier beyond the Moon.",image:"1_2_mars.png"}] },
  { kicker:"THE IMPOSSIBLE", title:"What Made the Impossible Possible?", text:"Every great journey begins with someone willing to look beyond what seems impossible.", footer:"THE FIRST GIANT STEP", artifacts:[{name:"NASA'S STEP ON THE MOON",note:"Humanity's historic journey to the lunar surface.",image:"2_NASA_Stepped_on_the_Moon.jpg",link:"https://www.nasa.gov/history/flag-day-flying-high-the-stars-and-stripes-in-space/"}] },
  { kicker:"THE FIRST MISSIONS", title:"The First Missions", text:"In 1958, Pioneer 1 began NASA's lunar journey. In 1964, Mariner 3 started NASA's first attempt at Mars.<br>Mariner 4 soon followed and successfully reached the Red Planet.", footer:"MISSION AFTER MISSION", artifacts:[{name:"PIONEER 1",note:"One of NASA's earliest lunar spacecraft missions.",image:"3_1_Pioneer_1.jpg",link:"https://science.nasa.gov/mission/pioneer-1-able-2/"},{name:"MARINER 3",note:"NASA's first attempt to reach Mars.",image:"3_2_Mariner_3.jpg",link:"https://science.nasa.gov/mission/mariner-3/"}] },
  { kicker:"KNOWLEDGE", title:"Every Mission Taught Us More", text:"Each mission sent vital information about worlds beyond Earth, guiding the journey forward.", footer:"KNOWLEDGE BECOMES PROGRESS", artifacts:[{name:"THE JOURNEY CONTINUES",note:"Each mission adds another piece to the story of exploration.",image:"4_progressing.png"}] },
  { kicker:"YOUR JOURNEY BEGINS", title:"The Machines Are Waiting", text:"Some machines have stopped responding, and others are fading.<br>We cannot let their contributions be forgotten. Your journey begins here.", footer:"THE NEXT CHAPTER IS YOURS", artifacts:[{name:"YOUR JOURNEY BEGINS",note:"Step forward and begin your exploration.",image:"5_final.png"}] }
];

let current = 0;
const card = document.querySelector("#stage-card");
const kicker = document.querySelector("#stage-kicker");
const title = document.querySelector("#stage-title");
const text = document.querySelector("#stage-text");
const footer = document.querySelector("#stage-footer");
const artifacts = document.querySelector("#artifact-grid");
const dots = document.querySelector("#stage-dots");

function render(index) {
  const stage = stages[index];
  card.classList.remove("is-changing");
  void card.offsetWidth;
  kicker.textContent = stage.kicker;
  title.textContent = stage.title;
  text.innerHTML = stage.text;
  footer.textContent = stage.footer;
  artifacts.innerHTML = stage.artifacts.map((artifact) => {
    const content = `
      <div class="artifact__image">
        <img src="./Intro/intro_images/${artifact.image}" alt="${artifact.name}">
      </div>
      <div class="artifact__caption"><strong>${artifact.name}</strong><small>${artifact.note}</small></div>`;
    return artifact.link
      ? `<a class="artifact artifact--link" href="${artifact.link}" target="_blank" rel="noopener noreferrer">${content}</a>`
      : `<article class="artifact">${content}</article>`;
  }).join("");
  dots.querySelectorAll("span").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
  const nextArrow = document.querySelector(".nav-arrow--next");
  const previousArrow = document.querySelector(".nav-arrow--prev");
  nextArrow.setAttribute("aria-label", index === stages.length - 1 ? "Enter the SPACE section" : "Proceed to the next introduction slide");
  previousArrow.hidden = index === 0;
  previousArrow.setAttribute("aria-label", "Return to the previous introduction slide");
  card.classList.add("is-changing");
}

let navigating = false;
function moveForward() {
  if (navigating) return;
  if (current < stages.length - 1) {
    current += 1;
    render(current);
    return;
  }
  window.beginSolarJourney();
}

function moveBackward() {
  if (navigating || current === 0) return;
  current -= 1;
  render(current);
}

stages.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.className = "stage-dot";
  dot.setAttribute("aria-hidden", "true");
  dots.appendChild(dot);
});
document.querySelector(".nav-arrow--next").addEventListener("click", moveForward);
document.querySelector(".nav-arrow--prev").addEventListener("click", moveBackward);
document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === "ArrowLeft") moveBackward();
  if (event.key === "ArrowRight") moveForward();
});
window.beginSolarJourney = () => {
  if (navigating) return;
  navigating = true;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector("#intro")?.classList.add("leaving");
  document.querySelector("#space-travel")?.classList.add("active");
  setTimeout(() => { window.location.href = "./Space/space.html"; }, reducedMotion ? 100 : 1100);
};
render(current);
