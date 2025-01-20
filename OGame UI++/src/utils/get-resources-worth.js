'use strict';

window.uipp_getResourcesWorth = function uipp_getResourcesWorth() {
  //console.log('uipp_getResourcesWorth function called');

  var tradeRate = window.config.tradeRate;
  //console.log('Trade rate from configuration:', tradeRate);

  // Verifica che tradeRate sia un array valido con almeno 3 numeri
  if (
    !tradeRate ||
    !Array.isArray(tradeRate) ||
    tradeRate.length < 3 ||
    tradeRate.some((rate) => typeof rate !== 'number' || rate <= 0)
  ) {
    //console.warn('Invalid trade rate configuration detected:', tradeRate);
    return { metal: 1, crystal: 1, deuterium: 1 }; // Fallback di sicurezza
  }

  //console.log('Trade rate is valid. Calculating resource worth...');

  var minRate = Math.min(tradeRate[0], tradeRate[1], tradeRate[2]);
  var maxRate = Math.max(tradeRate[0], tradeRate[1], tradeRate[2]);

  //console.log('Minimum rate:', minRate);
  //console.log('Maximum rate:', maxRate);

  var worth = {
    metal: ((minRate / tradeRate[0]) * maxRate * 100) / 100,
    crystal: ((minRate / tradeRate[1]) * maxRate * 100) / 100,
    deuterium: ((minRate / tradeRate[2]) * maxRate * 100) / 100
  };

  //console.log('Calculated worth for resources:', worth);

  return worth;
};
