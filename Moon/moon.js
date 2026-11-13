"use strict";

const missions = window.LUNAR_MISSIONS || [];
const bookElement = document.getElementById("book");
const currentPageElement = document.getElementById("current-page");
const pageCountElement = document.getElementById("page-count");
const previousButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const index = document.getElementById("mission-index");
const indexToggle = document.getElementById("index-toggle");
let pageFlip = null;
let currentMissionIndex = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function illustrationMarkup(mission) {
  return `<div class="artifact-illustration artifact-${escapeHTML(mission.illustration)}" role="img" aria-label="Decorative illustration of ${escapeHTML(mission.hardware)}">
    <span class="artifact-figure" aria-hidden="true"></span>
    <span class="artifact-caption">ARCHIVAL INTERPRETATION</span>
  </div>`;
}

function missionPage(mission, missionIndex) {
  return `<article class="book-page mission-page" data-mission="${missionIndex}">
    <div class="page-rule"></div>
    <header class="mission-header">
      <span>${escapeHTML(mission.year)}</span>
      <span>MISSION ${String(missionIndex + 1).padStart(2, "0")}</span>
    </header>
    <h2>${escapeHTML(mission.name)}</h2>
    <p class="mission-kind">${escapeHTML(mission.kind)}</p>
    <p class="mission-opening">${escapeHTML(mission.opening || mission.context || "")}</p>
    <div class="mission-layout">
      ${illustrationMarkup(mission)}
      <div class="mission-copy">
        <p class="label">Hardware / spacecraft</p>
        <p>${escapeHTML(mission.hardware)}</p>
        <p class="label">Scientific objective</p>
        <p>${escapeHTML(mission.objective)}</p>
        ${mission.instruments ? `<p class="label">Exhibit method</p><p>${escapeHTML(mission.instruments)}</p>` : ""}
      </div>
    </div>
    <div class="mission-story">
      <p><strong>What happened.</strong> ${escapeHTML(mission.action)}</p>
      <p><strong>What it taught us.</strong> ${escapeHTML(mission.findings)}</p>
      ${mission.leftBehind ? `<p><strong>What remained.</strong> ${escapeHTML(mission.leftBehind)}</p>` : ""}
    </div>
    <aside class="bridge">
      <span>Bridge of Discovery</span>
      <p>${escapeHTML(mission.bridge)}</p>
    </aside>
    <button class="trivia-button" type="button" data-mission="${missionIndex}">Curator's Question</button>
    <footer class="page-footer"><span>Museum of the Abandoned</span><span>${missionIndex + 3}</span></footer>
  </article>`;
}

function buildPages() {
  const missionPages = missions.map(missionPage).join("");
  bookElement.innerHTML = `
    <article class="book-page --cover cover-front" data-density="hard">
      <div class="cover-ornament"></div>
      <p>ARCHIVE 1964—2009</p>
      <h2>Museum of the<br>Abandoned</h2>
      <div class="cover-moon" aria-hidden="true">☾</div>
      <p class="cover-subtitle">Museum of the Abandoned</p>
      <p class="cover-title-sub">The Moon: The Machines We Left Behind</p>
      <p class="cover-intro">Explore the discoveries made by spacecraft and hardware abandoned on the Moon.</p>
      <button class="open-book-button" type="button">Open the book</button>
    </article>
    <article class="book-page introduction-page">
      <div class="page-rule"></div>
      <header class="mission-header"><span>Introduction</span><span>Volume I</span></header>
      <h2>When a machine<br>outlasts its mission</h2>
      <p class="intro-lead">Between 1964 and 2009, lunar spacecraft left more than footprints in the archive. They created a chain of observations, questions, and new tools.</p>
      <p>Rangers looked closely, orbiters mapped broadly, Surveyors tested the ground, Apollo astronauts carried science across the surface, and later robotic explorers investigated hidden polar material.</p>
      <blockquote>Every artifact is evidence. Every mission is a bridge to the next question.</blockquote>
      <div class="timeline" aria-label="Mission years"><span>1964</span><span>1967</span><span>1969</span><span>1971</span><span>2009</span></div>
      <footer class="page-footer"><span>Begin the chronicle</span><span>2</span></footer>
    </article>
    ${missionPages}
    <article class="book-page closing-page">
      <div class="page-rule"></div>
      <header class="mission-header"><span>Afterword</span><span>2009 onward</span></header>
      <h2>A bridge toward<br>future exploration</h2>
      <p class="intro-lead">The archive does not end with abandoned spacecraft. Its purpose is to help the next explorers ask better questions.</p>
      <div class="discovery-chain">
        <p><strong>See closely.</strong> Close-up photography showed what maps could not.</p>
        <p><strong>See broadly.</strong> Orbital surveys placed individual sites in regional context.</p>
        <p><strong>Touch the surface.</strong> Landers tested the soil and measured spacecraft environments.</p>
        <p><strong>Explore farther.</strong> Crew mobility expanded geological reach.</p>
        <p><strong>Investigate hidden places.</strong> Polar impact science helps define future resource and volatile studies.</p>
      </div>
      <button class="return-cover-button" type="button">Return to cover</button>
      <footer class="page-footer"><span>Keep the discoveries moving</span><span>${missions.length + 3}</span></footer>
    </article>
    <article class="book-page --cover cover-back" data-density="hard">
      <p class="eyebrow">Museum of the Abandoned</p>
      <h2>End of the<br>Lunar Chronicle</h2>
      <div class="cover-moon" aria-hidden="true">☾</div>
    </article>`;
}

function buildIndex() {
  index.innerHTML = missions.map((mission, missionIndex) =>
    `<button type="button" class="index-tab" data-mission-index="${missionIndex}"><span>${String(missionIndex + 1).padStart(2, "0")}</span>${escapeHTML(mission.name)}<small>${escapeHTML(mission.year)}</small></button>`
  ).join("");
}

function updateControls() {
  if (!pageFlip) return;
  const count = pageFlip.getPageCount();
  const page = pageFlip.getCurrentPageIndex();
  currentPageElement.textContent = `Page ${page + 1}`;
  pageCountElement.textContent = `of ${count}`;
  previousButton.disabled = page === 0;
  nextButton.disabled = page >= count - 1;

  if (page >= 2 && page <= 2 + missions.length - 1) currentMissionIndex = page - 2;
  document.querySelectorAll(".index-tab").forEach(tab => {
    const target = Number(tab.dataset.missionIndex);
    tab.classList.toggle("active", target === currentMissionIndex);
  });
}

function initializeBook() {
  buildPages();
  buildIndex();
  if (!window.St || !window.St.PageFlip) {
    document.querySelector(".book-frame").innerHTML = '<p class="library-error">The local page-turning library could not be initialized.</p>';
    return;
  }

  try {
    pageFlip = new St.PageFlip(bookElement, {
      width: 420,
      height: 580,
      size: "stretch",
      minWidth: 300,
      maxWidth: 560,
      minHeight: 420,
      maxHeight: 740,
      maxShadowOpacity: 0.45,
      showCover: true,
      usePortrait: window.innerWidth < 760,
      mobileScrollSupport: false,
      swipeDistance: 24
    });
    pageFlip.loadFromHTML(document.querySelectorAll("#book .book-page"));
    window.moonPageFlip = pageFlip;
    pageFlip.on("flip", updateControls);
    pageFlip.on("changeState", updateControls);
    window.addEventListener("resize", () => {
      clearTimeout(window.__moonResizeTimer);
      window.__moonResizeTimer = setTimeout(() => {
        if (pageFlip && typeof pageFlip.update === "function") pageFlip.update({ usePortrait: window.innerWidth < 760 });
        updateControls();
      }, 180);
    });
    updateControls();
  } catch (error) {
    console.error("StPageFlip initialization failed", error);
    document.querySelector(".book-frame").insertAdjacentHTML("beforeend", '<p class="library-error">The museum book could not be opened.</p>');
  }
}

function toggleIndex(force) {
  const shouldOpen = typeof force === "boolean" ? force : index.hidden;
  index.hidden = !shouldOpen;
  indexToggle.setAttribute("aria-expanded", String(shouldOpen));
}

previousButton.addEventListener("click", () => pageFlip?.flipPrev());
nextButton.addEventListener("click", () => pageFlip?.flipNext());
indexToggle.addEventListener("click", () => toggleIndex());
index.addEventListener("click", event => {
  const button = event.target.closest(".index-tab");
  if (!button || !pageFlip) return;
  currentMissionIndex = Number(button.dataset.missionIndex);
  pageFlip.flip(2 + currentMissionIndex);
  toggleIndex(false);
  updateControls();
});

document.addEventListener("keydown", event => {
  if (document.querySelector("dialog[open]")) return;
  if (event.key === "ArrowLeft") pageFlip?.flipPrev();
  if (event.key === "ArrowRight") pageFlip?.flipNext();
});

const triviaDialog = document.getElementById("trivia-dialog");
const triviaTitle = document.getElementById("trivia-title");
const triviaQuestion = document.getElementById("trivia-question");
const triviaAnswer = document.getElementById("trivia-answer");
const triviaReveal = document.getElementById("trivia-reveal");
const triviaExplanation = document.getElementById("trivia-explanation");

function openTrivia(missionIndex) {
  const mission = missions[missionIndex];
  if (!mission) return;
  triviaTitle.textContent = mission.name;
  triviaQuestion.textContent = mission.question;
  triviaAnswer.textContent = mission.answer;
  triviaExplanation.textContent = mission.answerExplanation || "This answer is drawn directly from the exhibit's stated scientific contribution.";
  triviaAnswer.hidden = true;
  triviaExplanation.hidden = true;
  triviaReveal.hidden = false;
  triviaDialog.showModal();
}

bookElement.addEventListener("click", event => {
  const triviaButton = event.target.closest(".trivia-button");
  if (triviaButton) {
    openTrivia(Number(triviaButton.dataset.mission));
    return;
  }
  if (event.target.closest(".open-book-button")) pageFlip?.flipNext();
  if (event.target.closest(".return-cover-button") && pageFlip) pageFlip.flip(0);
});
triviaReveal.addEventListener("click", () => {
  triviaAnswer.hidden = false;
  triviaExplanation.hidden = false;
  triviaReveal.hidden = true;
  triviaAnswer.focus();
});
document.getElementById("trivia-close").addEventListener("click", () => triviaDialog.close());
triviaDialog.addEventListener("click", event => { if (event.target === triviaDialog) triviaDialog.close(); });

initializeBook();
