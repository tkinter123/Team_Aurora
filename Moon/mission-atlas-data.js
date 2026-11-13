"use strict";

window.MUSEUM_MISSION_ATLAS_DATA = {
  world: "Moon",
  missions: [
    {
      id: "ranger-7",
      exhibitStageIndex: 1,
      name: "Ranger 7",
      spacecraft: "Ranger 7 impact spacecraft",
      destination: "Moon",
      body: "Moon",
      visualization: "surface",
      texture: "./data/moon_texture/moon_global_z4.png",
      textureSource: "https://wms.lroc.asu.edu/lroc/view_rdr/WAC_GLOBAL",
      textureNote: "Lunar Reconnaissance Orbiter Wide Angle Camera global map.",
      color: [118, 116, 108],
      summary: "Ranger 7 photographed the Moon during its final approach and deliberately impacted the surface.",
      sourceUrl: "https://science.nasa.gov/mission/ranger-7/",
      coordinateSourceUrl: "https://science.nasa.gov/mission/ranger-7/",
      coordinates: {
        latitude: -10.633333,
        longitude: -20.6,
        latitudeLabel: "10° 38′ S",
        longitudeLabel: "20° 36′ W",
        referenceFrame: "NASA mission-page impact coordinates",
        type: "impact"
      },
      events: [
        { date: "1964-07-28", type: "launch", title: "Launch", description: "Ranger 7 launched from Cape Canaveral on an Atlas-Agena launch vehicle." },
        { date: "1964-07-31", type: "impact", title: "Lunar impact", description: "Ranger 7 transmitted its final image 2.3 seconds before impact on the northern rim of the Sea of Clouds.", surfaceEvent: true }
      ]
    },
    {
      id: "apollo-11",
      exhibitStageIndex: 2,
      name: "Apollo 11",
      spacecraft: "Apollo 11 Lunar Module Eagle",
      destination: "Tranquility Base, Moon",
      body: "Moon",
      visualization: "surface",
      texture: "./data/moon_texture/moon_global_z4.png",
      textureSource: "https://wms.lroc.asu.edu/lroc/view_rdr/WAC_GLOBAL",
      textureNote: "Lunar Reconnaissance Orbiter Wide Angle Camera global map.",
      color: [118, 116, 108],
      summary: "Apollo 11 carried the first crew to land on the Moon. Eagle's descent stage remained at Tranquility Base.",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      coordinateSourceUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      coordinates: {
        latitude: 0.67416,
        longitude: 23.47314,
        latitudeLabel: "0.67416° N",
        longitudeLabel: "23.47314° E",
        referenceFrame: "DE 421 mean Earth/polar rotation axis",
        type: "landing"
      },
      events: [
        { date: "1969-07-16", type: "launch", title: "Launch", description: "Apollo 11 launched from Kennedy Space Center." },
        { date: "1969-07-19", type: "orbit", title: "Lunar orbit insertion", description: "The spacecraft entered lunar orbit before Eagle's descent." },
        { date: "1969-07-20", type: "landing", title: "Eagle lands at Tranquility Base", description: "Eagle touched down in the Sea of Tranquility. The coordinate marks the lunar module landing site.", surfaceEvent: true },
        { date: "1969-07-24", type: "mission-end", title: "Return to Earth", description: "The Apollo 11 crew returned safely to Earth." }
      ]
    },
    {
      id: "surveyor-3",
      exhibitStageIndex: 3,
      name: "Surveyor 3",
      spacecraft: "Surveyor 3 lander",
      destination: "Oceanus Procellarum, Moon",
      body: "Moon",
      visualization: "surface",
      texture: "./data/moon_texture/moon_global_z4.png",
      textureSource: "https://wms.lroc.asu.edu/lroc/view_rdr/WAC_GLOBAL",
      textureNote: "Lunar Reconnaissance Orbiter Wide Angle Camera global map.",
      color: [118, 116, 108],
      summary: "Surveyor 3 made a soft landing and tested the lunar soil. Apollo 12 astronauts later visited and recovered parts of the lander.",
      sourceUrl: "https://science.nasa.gov/mission/surveyor-3/",
      coordinateSourceUrl: "https://science.nasa.gov/mission/surveyor-3/",
      coordinates: {
        latitude: -3,
        longitude: -23.41,
        latitudeLabel: "3° S",
        longitudeLabel: "23.41° W",
        referenceFrame: "NASA mission-page landing coordinates",
        type: "landing"
      },
      events: [
        { date: "1967-04-17", type: "launch", title: "Launch", description: "Surveyor 3 launched from Cape Canaveral." },
        { date: "1967-04-20", type: "landing", title: "Soft landing", description: "Surveyor 3 landed in southeastern Oceanus Procellarum after bouncing twice during descent.", surfaceEvent: true },
        { date: "1967-05-04", type: "last-contact", title: "Last contact", description: "NASA received Surveyor 3's last signal after the lunar night began." },
        { date: "1969-11-19", type: "visit", title: "Visited by Apollo 12", description: "Apollo 12 astronauts landed nearby and recovered components from Surveyor 3 for study." }
      ]
    },
    {
      id: "apollo-15",
      exhibitStageIndex: 4,
      name: "Apollo 15",
      spacecraft: "Apollo 15 Lunar Module Falcon",
      destination: "Hadley–Apennine region, Moon",
      body: "Moon",
      visualization: "surface",
      texture: "./data/moon_texture/moon_global_z4.png",
      textureSource: "https://wms.lroc.asu.edu/lroc/view_rdr/WAC_GLOBAL",
      textureNote: "Lunar Reconnaissance Orbiter Wide Angle Camera global map.",
      color: [118, 116, 108],
      summary: "Apollo 15 was the first J-mission, extending lunar surface exploration with the Lunar Roving Vehicle.",
      sourceUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      coordinateSourceUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      coordinates: {
        latitude: 26.13239,
        longitude: 3.6333,
        latitudeLabel: "26.13239° N",
        longitudeLabel: "3.63330° E",
        referenceFrame: "DE 421 mean Earth/polar rotation axis",
        type: "landing"
      },
      events: [
        { date: "1971-07-26", type: "launch", title: "Launch", description: "Apollo 15 launched from Kennedy Space Center." },
        { date: "1971-07-29", type: "orbit", title: "Lunar orbit insertion", description: "Apollo 15 entered lunar orbit before the landing." },
        { date: "1971-07-30", type: "landing", title: "Falcon lands at Hadley–Apennine", description: "The Lunar Module Falcon touched down at the Hadley–Apennine site.", surfaceEvent: true },
        { date: "1971-07-31", type: "deployment", title: "Lunar rover deployed", description: "The crew deployed the Lunar Roving Vehicle for surface traverses." },
        { date: "1971-08-07", type: "mission-end", title: "Return to Earth", description: "Apollo 15 returned safely to Earth." }
      ]
    },
    {
      id: "lcross",
      exhibitStageIndex: 5,
      name: "LCROSS",
      spacecraft: "Centaur upper stage and LCROSS shepherding spacecraft",
      destination: "Cabeus crater, Moon",
      body: "Moon",
      visualization: "surface",
      texture: "./data/moon_texture/moon_global_z4.png",
      textureSource: "https://wms.lroc.asu.edu/lroc/view_rdr/WAC_GLOBAL",
      textureNote: "Lunar Reconnaissance Orbiter Wide Angle Camera global map.",
      color: [118, 116, 108],
      summary: "LCROSS observed material excavated by two planned impacts in Cabeus crater. Exact impact coordinates are not supplied here.",
      sourceUrl: "https://science.nasa.gov/mission/lcross/",
      coordinates: null,
      events: [
        { date: "2009-06-18", type: "launch", title: "Launch", description: "LCROSS launched with the Lunar Reconnaissance Orbiter." },
        { date: "2009-10-09", type: "impact", title: "Centaur impact", description: "The Centaur upper stage struck Cabeus crater at 11:31 UT, excavating material for LCROSS to observe.", surfaceEvent: true },
        { date: "2009-10-09", type: "impact", title: "LCROSS impact", description: "The shepherding spacecraft observed the plume and impacted about four minutes after the Centaur. NASA reports no verified coordinates in this record.", surfaceEvent: true }
      ]
    }
  ]
};
