'use strict';

window.uipp_getDistance = function (c1, c2) {
  function distance(a, b, dim) {
    var d1 = a - b >= 1 ? a - b : a - b + dim;
    var d2 = b - a >= 1 ? b - a : b - a + dim;
    return Math.min(d1, d2);
  }

  /* Universe dimensions */
  var galaxies = parseInt(window.config.universe.galaxies);
  var systems = parseInt(window.config.universe.systems);

  if (c1[0] !== c2[0]) {
    return 20000 * distance(c1[0], c2[0], galaxies);
  } else if (c1[1] !== c2[1]) {
    return 2700 + 95 * distance(c1[1], c2[1], systems);
  } else {
    return 1000 + 5 * Math.abs(c1[2] - c2[2]);
  }
};

window.uipp_getFlightTime = function (speed, distance) {
  return (10 + 3500 * Math.sqrt((10 * distance) / speed)) / Number(window.config.universe.speedFleetWar);
};

window.uipp_getCost = uipp_getCost;
window.uipp_getCummulativeCost = uipp_getCummulativeCost;

var costsFunctions = {
  shipyard: function (level) {
    return [400 * Math.pow(2, level), 200 * Math.pow(2, level), 100 * Math.pow(2, level)];
  },
  researchlab: function (level) {
    return [200 * Math.pow(2, level), 400 * Math.pow(2, level), 200 * Math.pow(2, level)];
  },
  astrophysics: function (level) {
    return [4000 * Math.pow(1.75, level), 8000 * Math.pow(1.75, level), 4000 * Math.pow(1.75, level)];
  },
  energy: function (level) {
    return [0, 800 * Math.pow(2, level), 400 * Math.pow(2, level)];
  },
  laser: function (level) {
    return [200 * Math.pow(2, level), 100 * Math.pow(2, level), 0];
  },
  ion: function (level) {
    return [1000 * Math.pow(2, level), 300 * Math.pow(2, level), 100 * Math.pow(2, level)];
  },
  plasma: function (level) {
    return [2000 * Math.pow(2, level), 4000 * Math.pow(2, level), 1000 * Math.pow(2, level)];
  },
  metal: function (level) {
    return [60 * Math.pow(1.5, level), 15 * Math.pow(1.5, level), 0];
  },
  crystal: function (level) {
    return [48 * Math.pow(1.6, level), 24 * Math.pow(1.6, level), 0];
  },
  deuterium: function (level) {
    return [225 * Math.pow(1.5, level), 75 * Math.pow(1.5, level), 0];
  },
  solarplant: function (level) {
    return [75 * Math.pow(1.5, level), 30 * Math.pow(1.5, level), 0];
  },
  metalStorage: function(level) {
    return [1000 * Math.pow(2, level), 0, 0];
  },
  crystalStorage: function(level) {
    return [1000 * Math.pow(2, level), 500 * Math.pow(2, level), 0];
  },
  deuteriumStorage: function(level) {
    return [1000 * Math.pow(2, level), 1000 * Math.pow(2, level), 0];
  },
  
  // FUNZIONI ROCK
  lfbuildrock1: function (level) {
    // Meditation Enclave
    // Provides accommodation for T1 Rock’tal. Increases living space and growth rate.
    return [
      9 * Math.pow(1.4, level) * (level + 1),
      3 * Math.pow(1.4, level) * (level + 1),
      0 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock2: function (level) {
    // Crystal Farm
    // Increases storage capacity and food production per second.
    return [
      7 * Math.pow(1.4, level) * (level + 1),
      2 * Math.pow(1.4, level) * (level + 1),
      0 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock3: function (level) {
    // Rune Technologium
    // Unlocks the tech tree for Rock’tal and reduces costs/duration of research.
    return [
      40000 * Math.pow(1.4, level) * (level + 1),
      10000 * Math.pow(1.4, level) * (level + 1),
      15000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock4: function (level) {
    // Rune Forge
    // Reshapes T1 Rock’tal into T2 Rock’tal; increases the number of trained Rock’tal.
    return [
      5000 * Math.pow(1.4, level) * (level + 1),
      3800 * Math.pow(1.4, level) * (level + 1),  // Valore aggiornato a 3800
      1000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock5: function (level) {
    // Oriktorium
    // Trains T2 Rock’tal to become T3 Rock’tal; each level aumenta il numero di Rock’tal addestrati.
    return [
      50000 * Math.pow(1.4, level) * (level + 1),
      40000 * Math.pow(1.4, level) * (level + 1),
      50000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock6: function (level) {
    // Magma Forge
    // Aumenta la produzione di metallo sul pianeta.
    return [
      10000 * Math.pow(1.4, level) * (level + 1),
      8000 * Math.pow(1.4, level) * (level + 1),
      1000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock7: function (level) {
    // Disruption Chamber
    // Incrementa la produzione di energia e riduce i consumi energetici.
    return [
      20000 * Math.pow(1.4, level) * (level + 1),
      15000 * Math.pow(1.4, level) * (level + 1),
      10000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock8: function (level) {
    // Megalith
    // Riduce i costi e i tempi di costruzione per gli edifici specifici Rock’tal.
    return [
      50000 * Math.pow(1.4, level) * (level + 1),
      35000 * Math.pow(1.4, level) * (level + 1),
      15000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock9: function (level) {
    // Crystal Refinery
    // Incrementa la produzione di cristallo sul pianeta.
    return [
      85000 * Math.pow(1.4, level) * (level + 1),
      44000 * Math.pow(1.4, level) * (level + 1),
      25000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock10: function (level) {
    // Deuterium Synthesiser
    // Aumenta la produzione di deuterio sul pianeta.
    return [
      120000 * Math.pow(1.4, level) * (level + 1),
      50000 * Math.pow(1.4, level) * (level + 1),
      20000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock11: function (level) {
    // Mineral Research Centre
    // Riduce i costi di costruzione per tutti gli edifici di produzione risorse.
    return [
      250000 * Math.pow(1.4, level) * (level + 1),
      150000 * Math.pow(1.4, level) * (level + 1),
      100000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock12: function (level) {
    // Advanced Recycling Plant
    // Permette di ottenere risorse dal campo di detriti, aumentando il quantitativo ad ogni livello.
    return [
      250000 * Math.pow(1.4, level) * (level + 1),
      125000 * Math.pow(1.4, level) * (level + 1),
      125000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  
  lftechrock1: function (level) {
    // Volcanic Batteries
    return [
      10000 * Math.pow(1.5, level) * (level + 1),
      6000  * Math.pow(1.5, level) * (level + 1),
      1000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock2: function (level) {
    // Acoustic Scanning
    return [
      7500  * Math.pow(1.5, level) * (level + 1),
      12500 * Math.pow(1.5, level) * (level + 1),
      5000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock3: function (level) {
    // High Energy Pump Systems
    return [
      15000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1),
      5000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock4: function (level) {
    // Cargo Hold Expansion (Civilian Ships)
    return [
      20000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1),
      7500  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock5: function (level) {
    // Magma-Powered Production
    return [
      25000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock6: function (level) {
    // Geothermal Power Plants
    return [
      50000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock7: function (level) {
    // Depth Sounding
    return [
      70000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock8: function (level) {
    // Ion Crystal Enhancement (Heavy Fighter)
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock9: function (level) {
    // Improved Stellarator
    return [
      75000 * Math.pow(1.5, level) * (level + 1),
      55000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock10: function (level) {
    // Hardened Diamond Drill Heads
    return [
      85000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      35000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock11: function (level) {
    // Seismic Mining Technology
    return [
      120000 * Math.pow(1.5, level) * (level + 1),
      30000  * Math.pow(1.5, level) * (level + 1),
      25000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock12: function (level) {
    // Magma-Powered Pump Systems
    return [
      100000 * Math.pow(1.5, level) * (level + 1),
      40000  * Math.pow(1.5, level) * (level + 1),
      30000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock13: function (level) {
    // Ion Crystal Modules
    return [
      200000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock14: function (level) {
    // Optimised Silo Construction Method
    return [
      220000 * Math.pow(1.5, level) * (level + 1),
      110000 * Math.pow(1.5, level) * (level + 1),
      110000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock15: function (level) {
    // Diamond Energy Transmitter
    return [
      240000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock16: function (level) {
    // Obsidian Shield Reinforcement
    return [
      250000 * Math.pow(1.5, level) * (level + 1),
      250000 * Math.pow(1.5, level) * (level + 1),
      250000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock17: function (level) {
    // Rune Shields
    return [
      500000 * Math.pow(1.5, level) * (level + 1),
      300000 * Math.pow(1.5, level) * (level + 1),
      200000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock18: function (level) {
    // Rock’tal Collector Enhancement
    return [
      300000 * Math.pow(1.5, level) * (level + 1),
      180000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1)
    ];
  },  

  // FUNZIONI HUMAN
  lfbuildhuma1: function(level) {
    // Residential Sector
    // Fornisce alloggio per T1 Humans. Ogni livello aumenta lo spazio abitativo e il tasso di crescita.
    return [
      7 * Math.pow(1.5, level) * (level + 1),
      2 * Math.pow(1.5, level) * (level + 1),
      0 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma2: function(level) {
    // Biosphere Farm
    // Aumenta la capacità di stoccaggio e la quantità di cibo prodotto al secondo.
    return [
      5 * Math.pow(1.5, level) * (level + 1),
      2 * Math.pow(1.5, level) * (level + 1),
      0 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma3: function(level) {
    // Research Centre
    // Sblocca l'albero delle tecnologie per Humans e riduce costi e durata della ricerca.
    return [
      20000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma4: function(level) {
    // Academy of Sciences
    // Formazione da T1 a T2 Humans: ogni livello aumenta il numero di individui addestrati.
    return [
      5000 * Math.pow(1.5, level) * (level + 1),
      3200 * Math.pow(1.5, level) * (level + 1),
      1500 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma5: function(level) {
    // Neuro-Calibration Centre
    // Formazione da T2 a T3 Humans: ogni livello aumenta il numero di individui addestrati.
    return [
      50000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma6: function(level) {
    // High Energy Smelting
    // Incrementa la produzione di metallo sul pianeta.
    return [
      9000 * Math.pow(1.5, level) * (level + 1),
      6000 * Math.pow(1.5, level) * (level + 1),
      3000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma7: function(level) {
    // Food Silo
    // Distribuisce il cibo in modo più efficiente: aumenta il quantitativo massimo e riduce il consumo.
    return [
      25000 * Math.pow(1.5, level) * (level + 1),
      13000 * Math.pow(1.5, level) * (level + 1),
      7000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma8: function(level) {
    // Fusion-Powered Production
    // Incrementa la produzione di cristallo e deuterio.
    return [
      50000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma9: function(level) {
    // Skyscraper
    // Aumenta il numero massimo di Humans e la velocità di crescita della popolazione.
    return [
      75000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma10: function(level) {
    // Biotech Lab
    // Incrementa la produzione di cibo.
    return [
      150000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma11: function(level) {
    // Metropolis
    // Migliora tutte le tecnologie sul pianeta.
    return [
      80000 * Math.pow(1.5, level) * (level + 1),
      35000 * Math.pow(1.5, level) * (level + 1),
      60000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma12: function(level) {
    // Planetary Shield
    // Protegge parte della popolazione in caso d'attacco.
    return [
      250000 * Math.pow(1.5, level) * (level + 1),
      125000 * Math.pow(1.5, level) * (level + 1),
      125000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  // Human Research (Technologies)
  lftechhuma1: function(level) {
    // Intergalactic Envoys
    // Rilevano civiltà extra-terrestri e riducono la durata delle esplorazioni.
    return [
      5000 * Math.pow(1.5, level) * (level + 1),
      2500 * Math.pow(1.5, level) * (level + 1),
      500 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma2: function(level) {
    // High-Performance Extractors
    // Aumentano la produzione di metallo, cristallo e deuterio.
    return [
      7000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma3: function(level) {
    // Fusion Drives
    // Incrementano la velocità delle navi civili.
    return [
      15000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma4: function(level) {
    // Stealth Field Generator
    // Riduce costi e durata delle ricerche in ambito spionaggio.
    return [
      20000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1),
      7500 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma5: function(level) {
    // Orbital Den
    // Aumenta la capacità di stoccaggio delle risorse in orbita.
    return [
      25000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma6: function(level) {
    // Research AI
    // Accelera i progetti di ricerca.
    return [
      35000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma7: function(level) {
    // High-Performance Terraformer
    // Riduce i costi, l'energia richiesta e la durata di costruzione dei terraformers.
    return [
      70000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma8: function(level) {
    // Enhanced Production Technologies
    // Aumentano la produzione di metallo, cristallo e deuterio.
    return [
      80000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma9: function(level) {
    // Light Fighter Mk II
    // Migliora integrità strutturale, scudi, potenza di fuoco, capacità di carico e velocità di base dei Light Fighters.
    return [
      320000 * Math.pow(1.5, level) * (level + 1),
      240000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma10: function(level) {
    // Cruiser Mk II
    // Migliora le caratteristiche dei Cruisers.
    return [
      320000 * Math.pow(1.5, level) * (level + 1),
      240000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma11: function(level) {
    // Improved Lab Technology
    // Riduce i tempi e i costi della ricerca.
    return [
      120000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma12: function(level) {
    // Plasma Terraformer
    // Riduce costi, energia richiesta e durata di costruzione del terraformer.
    return [
      100000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma13: function(level) {
    // Low-Temperature Drives
    // Riduce i costi e la durata delle ricerche in ambito spionaggio.
    return [
      200000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma14: function(level) {
    // Bomber Mk II
    // Migliora le caratteristiche dei Bombers.
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma15: function(level) {
    // Destroyer Mk II
    // Migliora le caratteristiche dei Destroyers.
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma16: function(level) {
    // Battlecruiser Mk II
    // Migliora le caratteristiche dei Battlecruisers.
    return [
      320000 * Math.pow(1.5, level) * (level + 1),
      240000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma17: function(level) {
    // Robot Assistants
    // Accelerano i progetti di ricerca.
    return [
      300000 * Math.pow(1.5, level) * (level + 1),
      180000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma18: function(level) {
    // Supercomputer
    // Permette di completare progetti di astrophysics molto più velocemente.
    return [
      500000 * Math.pow(1.5, level) * (level + 1),
      300000 * Math.pow(1.5, level) * (level + 1),
      200000 * Math.pow(1.5, level) * (level + 1)
    ];
  },


  // FUNZIONI MECH
  lfbuildmech1: function(level) {
    // Assembly Line
    // Provides accommodation for T1 Mechas. Each level increases the living space and growth rate.
    return [
      6 * Math.pow(1.4, level) * (level + 1),
      2 * Math.pow(1.4, level) * (level + 1),
      0 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech2: function(level) {
    // Fusion Cell Factory
    // Expands storage capacity and increases the amount of food produced per second.
    return [
      5 * Math.pow(1.4, level) * (level + 1),
      2 * Math.pow(1.4, level) * (level + 1),
      0 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech3: function(level) {
    // Robotics Research Centre
    // Unlocks the tech tree for Mechas and reduces research costs and duration.
    return [
      30000 * Math.pow(1.4, level) * (level + 1),
      20000 * Math.pow(1.4, level) * (level + 1),
      10000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech4: function(level) {
    // Update Network
    // Trains T1 Mechas to become T2 Mechas; each level increases the number of trained Mechas.
    return [
      5000 * Math.pow(1.4, level) * (level + 1),
      3800 * Math.pow(1.4, level) * (level + 1),
      1000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech5: function(level) {
    // Quantum Computer Centre
    // Trains T2 Mechas to become T3 Mechas; each level increases the number of trained Mechas.
    return [
      50000 * Math.pow(1.4, level) * (level + 1),
      40000 * Math.pow(1.4, level) * (level + 1),
      50000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech6: function(level) {
    // Automatised Assembly Centre
    // Reduces the construction time of ships.
    return [
      7500 * Math.pow(1.4, level) * (level + 1),
      7000 * Math.pow(1.4, level) * (level + 1),
      1000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech7: function(level) {
    // High-Performance Transformer
    // Increases energy production on the planet and boosts the technology bonus.
    return [
      35000 * Math.pow(1.4, level) * (level + 1),
      15000 * Math.pow(1.4, level) * (level + 1),
      10000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech8: function(level) {
    // Microchip Assembly Line
    // Improved microchips make Mechas more efficient, increasing food production and training speed.
    return [
      50000 * Math.pow(1.4, level) * (level + 1),
      20000 * Math.pow(1.4, level) * (level + 1),
      30000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech9: function(level) {
    // Production Assembly Hall
    // New Mechas can be assembled even faster; increases maximum number and training speed.
    return [
      100000 * Math.pow(1.4, level) * (level + 1),
      10000 * Math.pow(1.4, level) * (level + 1),
      3000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech10: function(level) {
    // High-Performance Synthesiser
    // Increases the production of deuterium on the planet.
    return [
      100000 * Math.pow(1.4, level) * (level + 1),
      40000 * Math.pow(1.4, level) * (level + 1),
      20000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech11: function(level) {
    // Chip Mass Production
    // Increases the technology bonus on the planet with every level.
    return [
      55000 * Math.pow(1.4, level) * (level + 1),
      50000 * Math.pow(1.4, level) * (level + 1),
      30000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildmech12: function(level) {
    // Nano Repair Bots
    // Increases the number of ships left in the wreckage after a battle.
    return [
      250000 * Math.pow(1.4, level) * (level + 1),
      125000 * Math.pow(1.4, level) * (level + 1),
      125000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  // Mecha Research (Technologies)
  lftechmech1: function(level) {
    // Catalyser Technology
    // Increases the production of deuterium on all planets.
    return [
      10000 * Math.pow(1.5, level) * (level + 1),
      6000  * Math.pow(1.5, level) * (level + 1),
      1000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech2: function(level) {
    // Plasma Drive
    // Increases the speed of all ships (excluding Deathstars).
    return [
      7500  * Math.pow(1.5, level) * (level + 1),
      12500 * Math.pow(1.5, level) * (level + 1),
      5000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech3: function(level) {
    // Efficiency Module
    // Decreases the fuel consumption of all ships.
    return [
      15000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1),
      5000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech4: function(level) {
    // Depot AI
    // Reduces the costs and construction time for the Alliance Depot.
    return [
      20000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1),
      7500  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech5: function(level) {
    // General Overhaul (Light Fighter)
    // Increases the structural integrity, shield strength, firepower, cargo capacity and basic speed of Light Fighters.
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech6: function(level) {
    // Automated Transport Lines
    // Increases the production of metal, crystals and deuterium on all planets.
    return [
      50000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech7: function(level) {
    // Improved Drone AI
    // Reduces the costs and research time of spy technology.
    return [
      70000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech8: function(level) {
    // Experimental Recycling Technology
    // Increases the structural integrity, shield strength, firepower, cargo capacity and basic speed of Recyclers.
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech9: function(level) {
    // General Overhaul (Cruiser)
    // Enhances the structural integrity, shield strength, firepower, cargo capacity and basic speed of Cruisers.
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech10: function(level) {
    // Slingshot Autopilot
    // Allows reclaiming fuel when recalling the fleet; each level increases the amount reclaimed.
    return [
      85000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      35000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech11: function(level) {
    // High-Temperature Superconductors
    // Reduces the costs and research time of energy technology.
    return [
      120000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech12: function(level) {
    // General Overhaul (Battleship)
    // Enhances the structural integrity, shield strength, firepower, cargo capacity and basic speed of Battleships.
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech13: function(level) {
    // Artificial Swarm Intelligence
    // Increases the production of metal, crystals and deuterium on all planets.
    return [
      200000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech14: function(level) {
    // General Overhaul (Battlecruiser)
    // Enhances the structural integrity, shield strength, firepower, cargo capacity and basic speed of Battlecruisers.
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech15: function(level) {
    // General Overhaul (Bomber)
    // Enhances the structural integrity, shield strength, firepower, cargo capacity and basic speed of Bombers.
    return [
      320000 * Math.pow(1.5, level) * (level + 1),
      240000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech16: function(level) {
    // General Overhaul (Destroyer)
    // Enhances the structural integrity, shield strength, firepower, cargo capacity and basic speed of Destroyers.
    return [
      320000 * Math.pow(1.5, level) * (level + 1),
      240000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech17: function(level) {
    // Experimental Weapons Technology
    // Reduces the costs and research time of weapons technology.
    return [
      500000 * Math.pow(1.5, level) * (level + 1),
      300000 * Math.pow(1.5, level) * (level + 1),
      200000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech18: function(level) {
    // Mechan General Enhancement
    // Increases class bonuses (with some exceptions) for Mechas.
    return [
      300000 * Math.pow(1.5, level) * (level + 1),
      180000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1)
    ];
  },



  // FUNZIONI KAEL
  lfbuildkael1: function(level) {
    // Sanctuary
    // Provides accommodation for T1 Kaelesh.
    // Base: [4, 3, 0]
    return [
      4 * Math.pow(1.5, level) * (level + 1),
      3 * Math.pow(1.5, level) * (level + 1),
      0 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael2: function(level) {
    // Antimatter Condenser
    // Increases storage capacity and food production.
    // Base: [6, 3, 0]
    return [
      6 * Math.pow(1.5, level) * (level + 1),
      3 * Math.pow(1.5, level) * (level + 1),
      0 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael3: function(level) {
    // Vortex Chamber
    // Unlocks the tech tree for Kaelesh; research costs and duration decrease.
    // Base: [20000, 20000, 30000]
    return [
      20000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael4: function(level) {
    // Halls of Realisation
    // Trains T1 Kaelesh to become T2 Kaelesh.
    // Base: [7500, 5000, 800]
    return [
      7500 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1),
      800 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael5: function(level) {
    // Forum of Transcendence
    // Trains T2 Kaelesh to become T3 Kaelesh.
    // Base: [60000, 30000, 50000]
    return [
      60000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael6: function(level) {
    // Antimatter Convector
    // Reduces food consumption on the planet.
    // Base: [8500, 5000, 3000]
    return [
      8500 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1),
      3000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael7: function(level) {
    // Cloning Laboratory
    // Increases the speed at which T1 Kaelesh are trained.
    // Base: [15000, 15000, 20000]
    return [
      15000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael8: function(level) {
    // Chrysalis Accelerator
    // Increases the maximum number and training speed of Kaelesh.
    // Base: [75000, 25000, 30000]
    return [
      75000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael9: function(level) {
    // Bio Modifier
    // Increases the number of planet fields.
    // Base: [87500, 25000, 30000]
    return [
      87500 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael10: function(level) {
    // Psionic Modulator
    // Reduces the requirements for all technology slots.
    // Base: [150000, 30000, 30000]
    return [
      150000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael11: function(level) {
    // Ship Manufacturing Hall
    // Reduces the construction time of ships.
    // Base: [75000, 50000, 55000]
    return [
      75000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      55000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildkael12: function(level) {
    // Supra Refractor
    // Increases the chance and size of a moon.
    // Base: [500000, 250000, 250000]
    return [
      500000 * Math.pow(1.5, level) * (level + 1),
      250000 * Math.pow(1.5, level) * (level + 1),
      250000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  // Kael Research (Technologies)
  lftechkael1: function(level) {
    // Heat Recovery
    // Decreases the fuel consumption of all ships.
    // Base: [10000, 6000, 1000]
    return [
      10000 * Math.pow(1.5, level) * (level + 1),
      6000  * Math.pow(1.5, level) * (level + 1),
      1000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael2: function(level) {
    // Sulphide Process
    // Increases the production of deuterium on all planets.
    // Base: [7500, 12500, 5000]
    return [
      7500 * Math.pow(1.5, level) * (level + 1),
      12500 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael3: function(level) {
    // Psionic Network
    // Reduces the chance of losing ships on expeditions.
    // Base: [15000, 10000, 5000]
    return [
      15000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1),
      5000  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael4: function(level) {
    // Telekinetic Tractor Beam
    // Increases the number of ships found on expeditions.
    // Base: [20000, 15000, 7500]
    return [
      20000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1),
      7500  * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael5: function(level) {
    // Enhanced Sensor Technology
    // Increases the resources earned on expeditions.
    // Base: [25000, 20000, 10000]
    return [
      25000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael6: function(level) {
    // Neuromodal Compressor
    // Increases the cargo capacity of civilian ships.
    // Base: [50000, 50000, 20000]
    return [
      50000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael7: function(level) {
    // Neuro-Interface
    // Increases the speed of research projects.
    // Base: [70000, 40000, 20000]
    return [
      70000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael8: function(level) {
    // Interplanetary Analysis Network
    // Increases the range of all phalanx scans.
    // Base: [80000, 50000, 20000]
    return [
      80000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael9: function(level) {
    // Overclocking (Heavy Fighter)
    // Increases the attributes of Heavy Fighters.
    // Base: [320000, 240000, 100000]
    return [
      320000 * Math.pow(1.5, level) * (level + 1),
      240000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael10: function(level) {
    // Telekinetic Drive
    // Increases fleet speed on expeditions.
    // Base: [85000, 40000, 35000]
    return [
      85000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      35000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael11: function(level) {
    // Sixth Sense
    // Increases the resources earned on expeditions.
    // Base: [120000, 30000, 25000]
    return [
      120000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael12: function(level) {
    // Psychoharmoniser
    // Increases the production of deuterium on all planets.
    // Base: [100000, 40000, 30000]
    return [
      100000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael13: function(level) {
    // Efficient Swarm Intelligence
    // Speeds up research projects.
    // Base: [200000, 100000, 100000]
    return [
      200000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael14: function(level) {
    // Overclocking (Large Cargo)
    // Increases the attributes of Large Cargo ships.
    // Base: [160000, 120000, 50000]
    return [
      160000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael15: function(level) {
    // Gravitation Sensors
    // Increases the amount of Dark Matter earned on expeditions.
    // Base: [240000, 120000, 120000]
    return [
      240000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael16: function(level) {
    // Overclocking (Battleship)
    // Increases the attributes of Battleships.
    // Base: [320000, 240000, 100000]
    return [
      320000 * Math.pow(1.5, level) * (level + 1),
      240000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael17: function(level) {
    // Psionic Shield Matrix
    // Reduces the costs and research time of shield technology.
    // Base: [500000, 300000, 200000]
    return [
      500000 * Math.pow(1.5, level) * (level + 1),
      300000 * Math.pow(1.5, level) * (level + 1),
      200000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael18: function(level) {
    // Kaelesh Discoverer Enhancement
    // Increases class bonuses as Discoverer.
    // Base: [300000, 180000, 120000]
    return [
      300000 * Math.pow(1.5, level) * (level + 1),
      180000 * Math.pow(1.5, level) * (level + 1),
      120000 * Math.pow(1.5, level) * (level + 1)
    ];
  }


};

function uipp_getCost(type, level) {
  if (!costsFunctions[type]) {
    return null;
  }

  return costsFunctions[type](level);
}

function uipp_getCummulativeCost(type, fromLevel, toLevel) {
  if (!costsFunctions[type]) {
    return null;
  }

  var totalCost = [0, 0, 0];
  for (var level = fromLevel; level <= toLevel; level++) {
    var levelCost = window.uipp_getCost(type, level);
    totalCost[0] += levelCost[0];
    totalCost[1] += levelCost[1];
    totalCost[2] += levelCost[2];
  }
  return totalCost;
}

window.uipp_getProduction = function uipp_getProduction(type, level, averageTemp, coords, opts) {
  opts = opts || {};
  if (opts.plasma == undefined) opts.plasma = true;
  if (opts.class == undefined) opts.class = true;
  if (opts.geologist == undefined) opts.geologist = true;
  if (opts.officers == undefined) opts.officers = true;
  if (opts.bonus == undefined) opts.bonus = 0;

  var speed = Number(window.config.universe.speed);

  var positionMultiplier = 1;
  if (coords) {
    if (type == 'crystal' && coords[2] == 1) positionMultiplier = 1.4;
    if (type == 'crystal' && coords[2] == 2) positionMultiplier = 1.3;
    if (type == 'crystal' && coords[2] == 3) positionMultiplier = 1.2;
    if (type == 'metal' && coords[2] == 6) positionMultiplier = 1.17;
    if (type == 'metal' && coords[2] == 7) positionMultiplier = 1.23;
    if (type == 'metal' && coords[2] == 8) positionMultiplier = 1.35;
    if (type == 'metal' && coords[2] == 9) positionMultiplier = 1.23;
    if (type == 'metal' && coords[2] == 10) positionMultiplier = 1.17;
  }

  // multiplier is for miner class, geologist, officer council
  var multiplier = 0;
  if ($('.characterclass.miner').length && opts.class) {
    multiplier += 0.25;
  }
  if ($('.geologist.on').length && opts.geologist) {
    multiplier += 0.1;
  }
  if ($('#officers.all').length && opts.officers) {
    multiplier += 0.02;
  }

  // for unspecified temperature, take an arbitrary temperature of 30° average
  if (averageTemp !== 0 && !averageTemp) {
    averageTemp = 30;
  }

  switch (type) {
    case 'metal':
      var baseProd = 30 * speed * positionMultiplier;
      var mineProd = Math.floor(30 * level * Math.pow(1.1, level) * speed * positionMultiplier);
      var bonusProd = multiplier * (baseProd + mineProd);
      var additionalProd = opts.bonus * mineProd;
      var plasmaProd = opts.plasma ? (window.config.plasmaTech || 0) * 0.01 * mineProd : 0;
      return baseProd + mineProd + bonusProd + additionalProd + plasmaProd;
    case 'crystal':
      var baseProd = 15 * speed * positionMultiplier;
      var mineProd = Math.floor(20 * level * Math.pow(1.1, level) * speed * positionMultiplier);
      var bonusProd = multiplier * (baseProd + mineProd);
      var additionalProd = opts.bonus * mineProd;
      var plasmaProd = opts.plasma ? (window.config.plasmaTech || 0) * 0.0066 * mineProd : 0;
      return baseProd + mineProd + bonusProd + additionalProd + plasmaProd;
    case 'deuterium':
      var baseProd = 0;
      var mineProd = Math.floor(10 * level * Math.pow(1.1, level) * speed * (1.36 - 0.004 * averageTemp));
      var bonusProd = multiplier * (baseProd + mineProd);
      var additionalProd = opts.bonus * mineProd;
      var plasmaProd = opts.plasma ? (window.config.plasmaTech || 0) * 0.0033 * mineProd : 0;
      return baseProd + mineProd + bonusProd + additionalProd + plasmaProd;
    default:
      return null;
  }
};
