"use strict";

(() => {
  const VOICE_WAIT_MS = 2500;
  const voiceKey = voice => `${voice.voiceURI || ""}|${voice.name || ""}|${voice.lang || ""}`;
  let guideVoiceKey = "";
  const visitorVoiceKeys = new Map();

  function getEnglishVoices() {
    if (!window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices().filter(voice => /^en(?:-|$)/i.test(voice.lang));
  }

  function waitForEnglishVoices() {
    if (!window.speechSynthesis) return Promise.resolve([]);
    const availableVoices = getEnglishVoices();
    if (availableVoices.length) return Promise.resolve(availableVoices);

    return new Promise(resolve => {
      let settled = false;
      let timeoutId = 0;
      const finish = voices => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        window.speechSynthesis.removeEventListener?.("voiceschanged", handleVoicesChanged);
        resolve(voices);
      };
      const handleVoicesChanged = () => {
        const voices = getEnglishVoices();
        if (voices.length) finish(voices);
      };

      window.speechSynthesis.addEventListener?.("voiceschanged", handleVoicesChanged);
      timeoutId = window.setTimeout(() => finish(getEnglishVoices()), VOICE_WAIT_MS);
      handleVoicesChanged();
    });
  }

  function getGuideVoice(voices = getEnglishVoices()) {
    const storedGuideKey = sessionStorage.getItem("museumGuideVoiceKey");
    if (storedGuideKey) {
      const storedGuideVoice = voices.find(voice => voiceKey(voice) === storedGuideKey);
      if (storedGuideVoice) {
        guideVoiceKey = storedGuideKey;
        return storedGuideVoice;
      }
    }
    if (guideVoiceKey) {
      const cachedVoice = voices.find(voice => voiceKey(voice) === guideVoiceKey);
      if (cachedVoice) return cachedVoice;
    }

    const guideVoice = voices.find(voice => /\bdavid\b/i.test(voice.name))
      || voices.find(voice => voice.default)
      || voices[0]
      || null;
    if (guideVoice) {
      guideVoiceKey = voiceKey(guideVoice);
      sessionStorage.setItem("museumGuideVoiceKey", guideVoiceKey);
    }
    return guideVoice;
  }

  function getVoiceGender(voice) {
    const declaredGender = String(voice.gender || "").toLowerCase();
    if (declaredGender === "male" || declaredGender === "female") return declaredGender;

    const identity = `${voice.name || ""} ${voice.voiceURI || ""}`;
    const knownProfiles = [
      { gender: "male", pattern: /\bmicrosoft\s+(?:david|mark|guy|ryan|eric|tony|andrew|brandon|brian|christopher|daniel|derek|ethan|jason|kevin)\b/i },
      { gender: "female", pattern: /\bmicrosoft\s+(?:zira|aria|ashley|ava|elizabeth|jenny|michelle|monica|emma|sara)\b/i },
      { gender: "male", pattern: /\bgoogle\b.*\b(?:english\s+)?male\b/i },
      { gender: "female", pattern: /\bgoogle\b.*\b(?:english\s+)?female\b/i },
      { gender: "male", pattern: /\bcom\.apple\.speech\.synthesis\.voice\.(?:alex|daniel|fred|jorge|ralph)\b/i },
      { gender: "female", pattern: /\bcom\.apple\.speech\.synthesis\.voice\.(?:allison|ava|karen|moira|samantha|susan|tessa|victoria)\b/i },
      { gender: "male", pattern: /\bamazon\b.*\b(?:matthew|joey|justin)\b/i },
      { gender: "female", pattern: /\bamazon\b.*\b(?:joanna|kendra|kimberly|salli|ivy|amy|emma)\b/i }
    ];
    return knownProfiles.find(profile => profile.pattern.test(identity))?.gender || null;
  }

  function isSameVoice(first, second) {
    return first === second
      || (first && second && first.voiceURI && first.voiceURI === second.voiceURI)
      || (first && second && first.name && first.name === second.name);
  }

  function getVisitorVoice(voices = getEnglishVoices(), selectedAvatar = sessionStorage.getItem("museumSelectedAvatar")) {
    const requestedGender = selectedAvatar === "leo" ? "male" : "female";
    const guideVoice = getGuideVoice(voices);
    const eligibleVoices = voices.filter(voice =>
      !isSameVoice(voice, guideVoice) && getVoiceGender(voice) === requestedGender
    );
    const cachedKey = sessionStorage.getItem(`museumVisitorVoice:${requestedGender}`)
      || visitorVoiceKeys.get(requestedGender);
    const cachedVoice = cachedKey && eligibleVoices.find(voice => voiceKey(voice) === cachedKey);
    const visitorVoice = cachedVoice || eligibleVoices[0] || null;
    if (visitorVoice) {
      const key = voiceKey(visitorVoice);
      visitorVoiceKeys.set(requestedGender, key);
      sessionStorage.setItem(`museumVisitorVoice:${requestedGender}`, key);
    }
    return visitorVoice;
  }

  function waitForVisitorVoice(selectedAvatar = sessionStorage.getItem("museumSelectedAvatar")) {
    const availableVoice = getVisitorVoice(getEnglishVoices(), selectedAvatar);
    if (availableVoice) return Promise.resolve(availableVoice);
    if (!window.speechSynthesis) return Promise.resolve(null);

    return new Promise(resolve => {
      let settled = false;
      let timeoutId = 0;
      const finish = voice => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        window.speechSynthesis.removeEventListener?.("voiceschanged", handleVoicesChanged);
        resolve(voice);
      };
      const handleVoicesChanged = () => {
        const voice = getVisitorVoice(getEnglishVoices(), selectedAvatar);
        if (voice) finish(voice);
      };

      window.speechSynthesis.addEventListener?.("voiceschanged", handleVoicesChanged);
      timeoutId = window.setTimeout(() => {
        finish(getVisitorVoice(getEnglishVoices(), selectedAvatar));
      }, VOICE_WAIT_MS);
      handleVoicesChanged();
    });
  }

  window.museumVoiceSelection = Object.freeze({
    getEnglishVoices,
    getGuideVoice,
    getVisitorVoice,
    waitForEnglishVoices,
    waitForVisitorVoice
  });
})();
