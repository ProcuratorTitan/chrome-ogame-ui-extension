'use strict';
var _cachedResources = null;

window._getCurrentPlanetResources = function _getCurrentPlanetResources() {
  //console.log("Starting _getCurrentPlanetResources");
  if (_cachedResources) {
    ////console.log("Returning cached resources:", _cachedResources);
    return _cachedResources;
  }

  var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
  //console.log("Current planet coordinates string:", currentPlanetCoordinatesStr);

  if ($('meta[name=ogame-planet-type]').attr('content') === 'moon') {
    currentPlanetCoordinatesStr += 'L';
    //console.log("Updated coordinates for moon:", currentPlanetCoordinatesStr);
  }

  var currentPlanet = window.config.my.planets[currentPlanetCoordinatesStr];
  //console.log("Current planet data:", currentPlanet);

  var tradeRate = window.config.tradeRate;
  //console.log("Trade rate:", tradeRate);

  var resources = {
    lastUpdate: Date.now(),
    metal: {
      now: 0,
      max: 0,
      prod: 0,
      worth:
        ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[0]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) *
          100) /
        100,
      level: currentPlanet && currentPlanet.resources ? currentPlanet.resources.metal.level : 0
    },
    crystal: {
      now: 0,
      max: 0,
      prod: 0,
      worth:
        ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[1]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) *
          100) /
        100,
      level: currentPlanet && currentPlanet.resources ? currentPlanet.resources.crystal.level : 0
    },
    deuterium: {
      now: 0,
      max: 0,
      prod: 0,
      worth:
        ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[2]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) *
          100) /
        100,
      level: currentPlanet && currentPlanet.resources ? currentPlanet.resources.deuterium.level : 0
    }
  };
  //console.log("Initialized resources object:", resources);

  // Funzione per estrarre un valore numerico dal tooltip
  function extractTooltipValue(tooltip, key) {
    const regex = new RegExp(`${key}:<\\/th><td><span.*?>([0-9.,+-]+)`, 'i');
    const match = tooltip.match(regex);
    return match ? window._gfNumberToJsNumber(match[1]) : null;
  }

  // Parse metal data from the DOM and set the resources object
  resources.metal.now = parseInt(document.querySelector('#resources_metal').getAttribute('data-raw'), 10);
  //console.log("Metal now:", resources.metal.now);

  resources.metal.max = parseInt(window.resourcesBar.resources.metal.storage || 0, 10);
  //console.log("Metal max:", resources.metal.max);

  // Estrarre la produzione del metallo dal tooltip
  var metalTooltip = window.resourcesBar.resources.metal.tooltip;
  var metalProd = 0;

  if (metalTooltip) {
    try {
      metalProd = extractTooltipValue(metalTooltip, 'Produzione attuale');
      if (metalProd !== null) {
        metalProd = metalProd / 3600; // Convertire la produzione in unità al secondo
      }
      //console.log("Metal production parsed:", metalProd);
    } catch (error) {
      //console.error("Error parsing metal production from tooltip:", error);
    }
  }

  // Fallback se la produzione è 0
  if (
    (!metalProd || metalProd === 0) &&
    config.my.planets[currentPlanetCoordinatesStr]?.resources?.metal?.prod
  ) {
    metalProd = config.my.planets[currentPlanetCoordinatesStr].resources.metal.prod;
    //console.log("Using old metal production value due to full storage:", metalProd);
  }

  resources.metal.prod = metalProd || 0; // Imposta la produzione a 0 se il parsing fallisce
  //console.log("Final metal production rate:", resources.metal.prod);



  // Funzione per estrarre un valore numerico dal tooltip
  function extractCrystalTooltipValue(tooltip, key) {
    const regex = new RegExp(`${key}:<\\/th><td><span.*?>([0-9.,+-]+)`, 'i');
    const match = tooltip.match(regex);
    return match ? window._gfNumberToJsNumber(match[1]) : null;
  }

  // Parse crystal data from the DOM and set the resources object
  resources.crystal.now = parseInt(document.querySelector('#resources_crystal').getAttribute('data-raw'), 10);
  //console.log("Crystal now:", resources.crystal.now);

  resources.crystal.max = parseInt(window.resourcesBar.resources.crystal.storage || 0, 10);
  //console.log("Crystal max:", resources.crystal.max);

  // Estrarre la produzione del cristallo dal tooltip
  var crystalTooltip = window.resourcesBar.resources.crystal.tooltip;
  var crystalProd = 0;

  if (crystalTooltip) {
    try {
      crystalProd = extractCrystalTooltipValue(crystalTooltip, 'Produzione attuale');
      if (crystalProd !== null) {
        crystalProd = crystalProd / 3600; // Convertire la produzione in unità al secondo
      }
      //console.log("Crystal production parsed:", crystalProd);
    } catch (error) {
      //console.error("Error parsing crystal production from tooltip:", error);
    }
  }

  // Fallback se la produzione è 0
  if (
    (!crystalProd || crystalProd === 0) &&
    config.my.planets[currentPlanetCoordinatesStr]?.resources?.crystal?.prod
  ) {
    crystalProd = config.my.planets[currentPlanetCoordinatesStr].resources.crystal.prod;
    //console.log("Using old crystal production value due to full storage:", crystalProd);
  }

  resources.crystal.prod = crystalProd || 0; // Imposta la produzione a 0 se il parsing fallisce
  //console.log("Final crystal production rate:", resources.crystal.prod);


  // Funzione per estrarre un valore numerico dal tooltip
function extractDeuteriumTooltipValue(tooltip, key) {
  const regex = new RegExp(`${key}:<\\/th><td><span.*?>([0-9.,+-]+)`, 'i');
  const match = tooltip.match(regex);
  return match ? window._gfNumberToJsNumber(match[1]) : null;
}

// Parse deuterium data from the DOM and set the resources object
  resources.deuterium.now = parseInt(document.querySelector('#resources_deuterium').getAttribute('data-raw'), 10);
  //console.log("Deuterium now:", resources.deuterium.now);

  resources.deuterium.max = parseInt(window.resourcesBar.resources.deuterium.storage || 0, 10);
  //console.log("Deuterium max:", resources.deuterium.max);

  // Estrarre la produzione del deuterio dal tooltip
  var deuteriumTooltip = window.resourcesBar.resources.deuterium.tooltip;
  var deutProd = 0;

  if (deuteriumTooltip) {
    try {
      deutProd = extractDeuteriumTooltipValue(deuteriumTooltip, 'Produzione attuale');
      if (deutProd !== null) {
        deutProd = deutProd / 3600; // Convertire la produzione in unità al secondo
      }
      //console.log("Deuterium production parsed:", deutProd);
    } catch (error) {
      //console.error("Error parsing deuterium production from tooltip:", error);
    }
  }

  // Fallback se la produzione è 0
  if (
    (!deutProd || deutProd === 0) &&
    config.my.planets[currentPlanetCoordinatesStr]?.resources?.deuterium?.prod
  ) {
    deutProd = config.my.planets[currentPlanetCoordinatesStr].resources.deuterium.prod;
    //console.log("Using old deuterium production value due to full storage:", deutProd);
  }

  resources.deuterium.prod = deutProd || 0; // Imposta la produzione a 0 se il parsing fallisce
  //console.log("Final deuterium production rate:", resources.deuterium.prod);


  // If on the resources page, update the planet's resource levels
  if (document.location.search.indexOf('supplies') !== -1) {
    //console.log("Updating mine levels on supplies page.");
    resources.metal.level = parseInt($('.metalMine .level').text());
    resources.crystal.level = parseInt($('.crystalMine .level').text());
    resources.deuterium.level = parseInt($('.deuteriumSynthesizer .level').text());
    console.log("Mine levels updated:", {
      metalLevel: resources.metal.level,
      crystalLevel: resources.crystal.level,
      deuteriumLevel: resources.deuterium.level
    });
  }

  window.config.my.planets[currentPlanetCoordinatesStr].resources = resources;
  //console.log("Updated planet resources in config:", resources);

  window._saveConfig();
  //console.log("Configuration saved.");

  _cachedResources = resources;
  //console.log("Resources cached:", _cachedResources);

  return resources;
};
