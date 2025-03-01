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
    case 'lfbuildrock1':
    case 'lfbuildrock2':
    case 'lfbuildrock3':
    case 'lfbuildrock4':
    case 'lfbuildrock5':
    case 'lfbuildrock6':
    case 'lfbuildrock7':
    case 'lfbuildrock8':
    case 'lfbuildrock9':
    case 'lfbuildrock10':
    case 'lfbuildrock11':
    case 'lfbuildrock12':
    case 'lfbuildkael1':
    case 'lfbuildkael2':
    case 'lfbuildkael3':
    case 'lfbuildkael4':
    case 'lfbuildkael5':
    case 'lfbuildkael6':
    case 'lfbuildkael7':
    case 'lfbuildkael8':
    case 'lfbuildkael9':
    case 'lfbuildkael10':
    case 'lfbuildkael11':
    case 'lfbuildkael12':
    case 'lfbuildhuma1':
    case 'lfbuildhuma2':
    case 'lfbuildhuma3':
    case 'lfbuildhuma4':
    case 'lfbuildhuma5':  
    case 'lfbuildhuma6':
    case 'lfbuildhuma7':
    case 'lfbuildhuma8':
    case 'lfbuildhuma9':
    case 'lfbuildhuma10':
    case 'lfbuildhuma11':
    case 'lfbuildhuma12':
    case 'lfbuildmech1':
    case 'lfbuildmech2':
    case 'lfbuildmech3':
    case 'lfbuildmech4':
    case 'lfbuildmech5':
    case 'lfbuildmech6':
    case 'lfbuildmech7':
    case 'lfbuildmech8':
    case 'lfbuildmech9':
    case 'lfbuildmech10':
    case 'lfbuildmech11':
    case 'lfbuildmech12':
      //console.log('Calculating for local production booster:', type);

      var multipliers = {
        lfbuildrock1: [1.02, 1.0, 1.0],
        lfbuildrock2: [1.0, 1.02],
        lfbuildrock3: [1.02, 1.0, 1.0],
        lfbuildrock4: [1.0, 1.02, 1.0],
        lfbuildrock5: [1.0, 1.0, 1.02],
        lfbuildrock6: [1.02, 1.0, 1.0],
        lfbuildrock7: [1.0, 1.02, 1.0],
        lfbuildrock8: [1.0, 1.0, 1.02],
        lfbuildrock9: [1.0, 1.02, 1.0],
        lfbuildrock10: [1.0, 1.0, 1.02],
        lfbuildrock11: [1.02, 1.0, 1.0],
        lfbuildrock12: [1.0, 1.02, 1.0],
        lfbuildkael1: [1.02, 1.0, 1.0],
        lfbuildkael2: [1.0, 1.02, 1.0],
        lfbuildkael3: [1.0, 1.0, 1.02],
        lfbuildkael4: [1.02, 1.0, 1.0],
        lfbuildkael5: [1.0, 1.02, 1.0],
        lfbuildkael6: [1.0, 1.0, 1.02],
        lfbuildkael7: [1.02, 1.0, 1.0],
        lfbuildkael8: [1.0, 1.02, 1.0],
        lfbuildkael9: [1.0, 1.0, 1.02],
        lfbuildkael10: [1.02, 1.0, 1.0],
        lfbuildkael11: [1.0, 1.02, 1.0],
        lfbuildkael12: [1.0, 1.0, 1.02],
        lfbuildhuma1: [1.02, 1.0, 1.0],
        lfbuildhuma2: [1.0, 1.02, 1.0],
        lfbuildhuma3: [1.0, 1.0, 1.02],
        lfbuildhuma4: [1.02, 1.0, 1.0],
        lfbuildhuma5: [1.0, 1.02, 1.0],
        lfbuildhuma6: [1.015, 1.0, 1.0],
        lfbuildhuma7: [1.0, 1.015, 1.0],
        lfbuildhuma8: [1.0, 1.015, 1.01],
        lfbuildhuma9: [1.0, 1.0, 1.015],
        lfbuildhuma10: [1.0, 1.0, 1.015],
        lfbuildhuma11: [1.0, 1.0, 1.015],
        lfbuildhuma12: [1.0, 1.0, 1.015],
        lfbuildmech1: [1.02, 1.0, 1.0],
        lfbuildmech2: [1.0, 1.02, 1.0],
        lfbuildmech3: [1.0, 1.0, 1.02],
        lfbuildmech4: [1.02, 1.0, 1.0],
        lfbuildmech5: [1.0, 1.02, 1.0],
        lfbuildmech6: [1.0, 1.0, 1.02],
        lfbuildmech7: [1.02, 1.0, 1.0],
        lfbuildmech8: [1.0, 1.02, 1.0],
        lfbuildmech9: [1.0, 1.0, 1.02],
        lfbuildmech10: [1.0, 1.0, 1.02],
        lfbuildmech11: [1.0, 1.0, 1.02],
        lfbuildmech12: [1.0, 1.0, 1.02]
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
      case 'lftechrock1':
      case 'lftechrock2':
      case 'lftechrock3':
      case 'lftechrock4':
      case 'lftechrock5':
      case 'lftechrock6':
      case 'lftechrock7':
      case 'lftechrock8':
      case 'lftechrock9':
      case 'lftechrock10':
      case 'lftechrock11':
      case 'lftechrock12':
      case 'lftechrock13':
      case 'lftechrock14':
      case 'lftechrock15':
      case 'lftechrock16':
      case 'lftechrock17':
      case 'lftechrock18':
      case 'lftechhuma1':
      case 'lftechhuma2':
      case 'lftechhuma3':
      case 'lftechhuma4':
      case 'lftechhuma5':
      case 'lftechhuma6':
      case 'lftechhuma7':
      case 'lftechhuma8':
      case 'lftechhuma9':
      case 'lftechhuma10':
      case 'lftechhuma11':
      case 'lftechhuma12':
      case 'lftechhuma13':
      case 'lftechhuma14':
      case 'lftechhuma15':
      case 'lftechhuma16':
      case 'lftechhuma17':
      case 'lftechhuma18':
      case 'lftechkael1':
      case 'lftechkael2':
      case 'lftechkael3':
      case 'lftechkael4':
      case 'lftechkael5':
      case 'lftechkael6':
      case 'lftechkael7':
      case 'lftechkael8':
      case 'lftechkael9':
      case 'lftechkael10':
      case 'lftechkael11':
      case 'lftechkael12':
      case 'lftechkael13':
      case 'lftechkael14':
      case 'lftechkael15':
      case 'lftechkael16':
      case 'lftechkael17':
      case 'lftechkael18':
      case 'lftechmech1':
      case 'lftechmech2':
      case 'lftechmech3':
      case 'lftechmech4':
      case 'lftechmech5':
      case 'lftechmech6':
      case 'lftechmech7':
      case 'lftechmech8':
      case 'lftechmech9':
      case 'lftechmech10':
      case 'lftechmech11':
      case 'lftechmech12':
      case 'lftechmech13':
      case 'lftechmech14':
      case 'lftechmech15':
      case 'lftechmech16':
      case 'lftechmech17':
      case 'lftechmech18':
      //console.log('Calculating for global production booster:', type);

      var multipliers = {
        plasma: [1.01, 1.0066, 1.0033],
        // lftechrock
        lftechrock1:  [1.0008, 1.0,    1.0],
        lftechrock2:  [1.0,    1.0008, 1.0],
        lftechrock3:  [1.0,    1.0,    1.0008],
        lftechrock4:  [1.0008, 1.0,    1.0],
        lftechrock5:  [1.0008, 1.0008, 1.0008],
        lftechrock6:  [1.0008, 1.0,    1.0],
        lftechrock7:  [1.0008, 1.0,    1.0],
        lftechrock8:  [1.0008, 1.0,    1.0],
        lftechrock9:  [1.0008, 1.0,    1.0],
        lftechrock10: [1.0008, 1.0,    1.0],
        lftechrock11: [1.0,    1.0008, 1.0],
        lftechrock12: [1.0,    1.0,    1.0008],
        lftechrock14: [1.0008, 1.0,    1.0],
        lftechrock15: [1.0008, 1.0,    1.0],
        lftechrock16: [1.0008, 1.0,    1.0],
        lftechrock17: [1.0008, 1.0,    1.0],
        lftechrock18: [1.0008, 1.0,    1.0],

        // lftechhuma
        lftechhuma1:  [1.0,    1.0,    1.0008],
        lftechhuma2:  [1.0006, 1.0006, 1.0006],
        lftechhuma3:  [1.0006, 1.0006, 1.0006],
        lftechhuma4:  [1.0006, 1.0006, 1.0006],
        lftechhuma5:  [1.0006, 1.0006, 1.0006],
        lftechhuma6:  [1.0006, 1.0006, 1.0006],
        lftechhuma7:  [1.0006, 1.0006, 1.0006],
        lftechhuma8:  [1.0006, 1.0006, 1.0006],
        lftechhuma9:  [1.0006, 1.0006, 1.0006],
        lftechhuma10: [1.0006, 1.0006, 1.0006],
        lftechhuma11: [1.0006, 1.0006, 1.0006],
        lftechhuma13: [1.0006, 1.0006, 1.0006],
        lftechhuma14: [1.0006, 1.0006, 1.0006],
        lftechhuma15: [1.0006, 1.0006, 1.0006],
        lftechhuma16: [1.0006, 1.0006, 1.0006],
        lftechhuma17: [1.0006, 1.0006, 1.0006],
        lftechhuma18: [1.0006, 1.0006, 1.0006],

        // lftechkael
        lftechkael1:  [1.0,    1.0008, 1.0],
        lftechkael2:  [1.0,    1.0,    1.0008],
        lftechkael3:  [1.0008, 1.0,    1.0],
        lftechkael4:  [1.0008, 1.0,    1.0],
        lftechkael5:  [1.0008, 1.0,    1.0],
        lftechkael6:  [1.0008, 1.0,    1.0],
        lftechkael7:  [1.0008, 1.0,    1.0],
        lftechkael8:  [1.0008, 1.0,    1.0],
        lftechkael9:  [1.0008, 1.0,    1.0],
        lftechkael10: [1.0008, 1.0,    1.0],
        lftechkael11: [1.0008, 1.0,    1.0],
        lftechkael12: [1.0008, 1.0,    1.0],
        lftechkael13: [1.0008, 1.0,    1.0],
        lftechkael14: [1.0008, 1.0,    1.0],
        lftechkael15: [1.0008, 1.0,    1.0],
        lftechkael16: [1.0008, 1.0,    1.0],
        lftechkael17: [1.0008, 1.0,    1.0],
        lftechkael18: [1.0008, 1.0,    1.0],

        // lftechmech
        lftechmech1:  [1.0,    1.0,    1.0008],
        lftechmech2:  [1.0006, 1.0006, 1.0006],
        lftechmech3:  [1.0006, 1.0006, 1.0006],
        lftechmech4:  [1.0006, 1.0006, 1.0006],
        lftechmech5:  [1.0006, 1.0006, 1.0006],
        lftechmech6:  [1.0006, 1.0006, 1.0006],
        lftechmech7:  [1.0006, 1.0006, 1.0006],
        lftechmech8:  [1.0006, 1.0006, 1.0006],
        lftechmech9:  [1.0006, 1.0006, 1.0006],
        lftechmech10: [1.0006, 1.0006, 1.0006],
        lftechmech11: [1.0006, 1.0006, 1.0006],
        lftechmech12: [1.0006, 1.0006, 1.0006],
        lftechmech13: [1.0006, 1.0006, 1.0006],
        lftechmech14: [1.0006, 1.0006, 1.0006],
        lftechmech15: [1.0006, 1.0006, 1.0006],
        lftechmech16: [1.0006, 1.0006, 1.0006],
        lftechmech17: [1.0006, 1.0006, 1.0006],
        lftechmech18: [1.0006, 1.0006, 1.0006]
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
