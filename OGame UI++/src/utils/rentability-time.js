'use strict';
window._getRentabilityTime = function _getRentabilityTime(type, currentProd, level, targetLevel, averageTemp, coords) {
  //console.log('Function called with arguments:', { type, currentProd, level, targetLevel, averageTemp, coords });

  var currentHourlyProd = currentProd * 3600;
  //console.log('Current hourly production:', currentHourlyProd);

  var rentabilityTime = 0;
  var worth = window.uipp_getResourcesWorth();
  //console.log('Resources worth:', worth);

  targetLevel = targetLevel || level + 1;
  //console.log('Target level:', targetLevel);

  switch (type) {
    // mines
    case 'metal':
    case 'crystal':
    case 'deuterium':
      //console.log('Calculating for mine:', type);

      var calculatedProduction = window.uipp_getProduction(type, level, averageTemp, coords);
      //console.log('Calculated production for current level:', calculatedProduction);

      var ratio = currentHourlyProd / calculatedProduction;
      //console.log('Production ratio:', ratio);

      var calculatedNextLevelproduction = window.uipp_getProduction(type, targetLevel, averageTemp, coords) * ratio;
      //console.log('Calculated production for next level:', calculatedNextLevelproduction);

      var calculatedCurrentLevelproduction = window.uipp_getProduction(type, targetLevel - 1, averageTemp, coords) * ratio;
      //console.log('Calculated production for current level:', calculatedCurrentLevelproduction);

      var productionDiff = calculatedNextLevelproduction - calculatedCurrentLevelproduction;
      //console.log('Production difference:', productionDiff);

      var productionDiffWorth = productionDiff * worth[type];
      //console.log('Production difference worth:', productionDiffWorth);

      var costs = window.uipp_getCost(type, targetLevel - 1);
      //console.log('Upgrade costs:', costs);

      var productionCostWorth = costs[0] * worth.metal + costs[1] * worth.crystal;
      //console.log('Production cost worth:', productionCostWorth);

      rentabilityTime = (productionCostWorth / productionDiffWorth) * 3600;
      //console.log('Rentability time (in seconds):', rentabilityTime);
      break;

    // local production booster buildings
    case 'lfbuildrock6':
    case 'lfbuildrock9':
    case 'lfbuildrock10':
    case 'lfbuildhuma6':
    case 'lfbuildhuma8':
    case 'lfbuildmech10':
      //console.log('Calculating for local production booster:', type);

      var multipliers = {
        lfbuildrock6: [1.02, 1.0, 1.0],
        lfbuildrock9: [1.0, 1.02, 1.0],
        lfbuildrock10: [1.0, 1.0, 1.02],
        lfbuildhuma6: [1.015, 1.0, 1.0],
        lfbuildhuma8: [1.0, 1.015, 1.01],
        lfbuildmech10: [1.0, 1.0, 1.02]
      };
      //console.log('Multipliers:', multipliers);

      var resources = window._getCurrentPlanetResources();
      //console.log('Current planet resources:', resources);

      var currentProdWorth = 0;
      currentProdWorth += resources.metal.prod * worth.metal;
      currentProdWorth += resources.crystal.prod * worth.crystal;
      currentProdWorth += resources.deuterium.prod * worth.deuterium;
      //console.log('Current production worth:', currentProdWorth);

      var nextLevelProdWorth = 0;
      nextLevelProdWorth += resources.metal.prod * worth.metal * multipliers[type][0];
      nextLevelProdWorth += resources.crystal.prod * worth.crystal * multipliers[type][1];
      nextLevelProdWorth += resources.deuterium.prod * worth.deuterium * multipliers[type][2];
      //console.log('Next level production worth:', nextLevelProdWorth);

      var techCosts = window.uipp_getCost(type, targetLevel - 1);
      //console.log('Technology costs:', techCosts);

      var techCostsWorth = techCosts[0] * worth.metal + techCosts[1] * worth.crystal + techCosts[2] * worth.deuterium;
      //console.log('Technology costs worth:', techCostsWorth);

      rentabilityTime = techCostsWorth / (nextLevelProdWorth - currentProdWorth);
      //console.log('Rentability time (in seconds):', rentabilityTime);
      break;

    // global production booster researches
    case 'plasma':
    case 'lftechmech1':
    case 'lftechhuma2':
    case 'lftechrock2':
    case 'lftechkael2':
    case 'lftechrock3':
    case 'lftechrock5':
    case 'lftechmech6':
    case 'lftechrock7':
    case 'lftechhuma8':
    case 'lftechrock10':
    case 'lftechrock11':
    case 'lftechrock12':
    case 'lftechkael12':
    case 'lftechmech13':
      //console.log('Calculating for global production booster:', type);

      var multipliers = {
        plasma: [1.01, 1.0066, 1.0033],
        lftechmech1: [1.0, 1.0, 1.0008],
        lftechhuma2: [1.0006, 1.0006, 1.0006],
        lftechrock2: [1.0, 1.0008, 1.0],
        lftechkael2: [1.0, 1.0, 1.0008],
        lftechrock3: [1.0, 1.0, 1.0008],
        lftechrock5: [1.0008, 1.0008, 1.0008],
        lftechmech6: [1.0006, 1.0006, 1.0006],
        lftechrock7: [1.0008, 1.0, 1.0],
        lftechhuma8: [1.0006, 1.0006, 1.0006],
        lftechrock10: [1.0008, 1.0, 1.0],
        lftechrock11: [1.0, 1.0008, 1.0],
        lftechrock12: [1.0, 1.0, 1.0008],
        lftechkael12: [1.0006, 1.0006, 1.0006],
        lftechmech13: [1.0006, 1.0006, 1.0006]
      };
      //console.log('Multipliers:', multipliers);

      var currentGlobalProdWorth = 0;
      var nextLevelGlobalProdWorth = 0;
      for (var coords in window.config.my.planets) {
        var planet = window.config.my.planets[coords];
        if (planet.resources) {
          currentGlobalProdWorth +=
            planet.resources.metal.prod * worth.metal +
            planet.resources.crystal.prod * worth.crystal +
            planet.resources.deuterium.prod * worth.deuterium;
          nextLevelGlobalProdWorth +=
            planet.resources.metal.prod * worth.metal * multipliers[type][0] +
            planet.resources.crystal.prod * worth.crystal * multipliers[type][1] +
            planet.resources.deuterium.prod * worth.deuterium * multipliers[type][2];
        }
      }
      //console.log('Current global production worth:', currentGlobalProdWorth);
      //console.log('Next level global production worth:', nextLevelGlobalProdWorth);

      var techCosts = window.uipp_getCost(type, targetLevel - 1);
      //console.log('Technology costs:', techCosts);

      var techCostsWorth = techCosts[0] * worth.metal + techCosts[1] * worth.crystal + techCosts[2] * worth.deuterium;
      //console.log('Technology costs worth:', techCostsWorth);

      rentabilityTime = techCostsWorth / (nextLevelGlobalProdWorth - currentGlobalProdWorth);
      //console.log('Rentability time (in seconds):', rentabilityTime);
      break;

    default:
      //console.log('Unknown type:', type);
  }

  //console.log('Final rentability time (rounded):', Math.floor(rentabilityTime));
  return Math.floor(rentabilityTime);
};
