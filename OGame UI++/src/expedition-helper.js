'use strict';
// Funzione per salvare i bonus dalla pagina dei bonus
window._saveBonusFromLfBonusesPage = function _saveBonusFromLfBonusesPage() {
  //console.log('Esegui _saveBonusFromLfBonusesPage');
  
  if (window.location.href.includes('page=ingame&component=lfbonuses')) {
    //console.log('Siamo nella pagina dei bonus');

    // Assicurati che jQuery sia disponibile prima di proseguire
    if (typeof $ === 'undefined') {
      //console.error('jQuery non è disponibile!');
      return;
    }

    // Bonus "Tecnologia Sensori migliorata"
    const sensorBonusElement = $('inner-bonus-item-heading[data-toggable="subcategoryResourcesExpedition"] .subCategoryBonus');
    
    if (sensorBonusElement.length > 0) {
      const sensorBonus = parseFloat(sensorBonusElement.text().trim().replace('%', '').replace(',', '.')) || 0;
      localStorage.setItem('sensorBonus', sensorBonus);
      //console.log('sensorBonus salvato:', sensorBonus);
    } else {
      //console.warn('Elemento sensorBonus non trovato!');
    }

    // Bonus "Esploratore"
    const explorerBonusElement = $('inner-bonus-item-heading[data-toggable="subcategoryCharacterclasses3"] .subCategoryBonus');
    
    if (explorerBonusElement.length > 0) {
      const explorerBonusText = explorerBonusElement.text().trim();
      const explorerBonus = explorerBonusText.includes('Totale:')
        ? parseFloat(explorerBonusText.replace('Totale:', '').replace('%', '').replace(',', '.'))
        : 0;
      localStorage.setItem('explorerBonus', explorerBonus);
      //console.log('explorerBonus salvato:', explorerBonus);
    } else {
      //console.warn('Elemento explorerBonus non trovato!');
    }

    //console.log('Bonus salvati con successo!');
  } else {
    //console.warn('Non siamo nella pagina dei bonus.');
  }
};

// Esegui la funzione se siamo nella pagina corretta
if (window.location.href.includes('page=ingame&component=lfbonuses')) {
  //console.log('Aggiungi event listener per DOMContentLoaded');
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      window._saveBonusFromLfBonusesPage();
    }, 2000);  // Ritardo per assicurarsi che gli elementi siano caricati
  });
}


// Funzione per aggiungere l'intervallo dell'helper di spedizione
window._addExpeditionHelperInterval = function _addExpeditionHelperInterval() {
  //console.log('Esegui _addExpeditionHelperInterval');
  setInterval(function () {
    const $el = $('form#shipsChosen:not(.enhanced-expedition)');
    //console.log('$el:', $el);

    if ($el.length) {
      //console.log('Aggiungi classe enhanced-expedition');
      $el.addClass('enhanced-expedition');

      // Determina il punteggio massimo dell'universo
      let topScore = 0;
      if (config.universe.topScore) {
        topScore = Math.round(Number(config.universe.topScore));
      } else if (config.players) {
        for (const playerId in config.players) {
          const player = config.players[playerId];
          if (player.globalPosition === '1') {
            topScore = Math.round(Number(player.globalScore));
          }
        }
      }
      //console.log('topScore:', topScore);

      // Calcola i valori dinamici in base al punteggio massimo
      let ritrovamentoMassimoBase = 25000000;
      if (topScore < 100000000) ritrovamentoMassimoBase = 21000000;
      if (topScore < 75000000) ritrovamentoMassimoBase = 18000000;
      if (topScore < 50000000) ritrovamentoMassimoBase = 15000000;
      if (topScore < 25000000) ritrovamentoMassimoBase = 12000000;
      if (topScore < 5000000) ritrovamentoMassimoBase = 9000000;
      if (topScore < 1000000) ritrovamentoMassimoBase = 6000000;
      if (topScore < 100000) ritrovamentoMassimoBase = 2500000;
      //console.log('ritrovamentoMassimoBase:', ritrovamentoMassimoBase);

      let maxExpeditionPoints = 25000;
      if (topScore < 100000000) maxExpeditionPoints = 21000;
      if (topScore < 75000000) maxExpeditionPoints = 18000;
      if (topScore < 50000000) maxExpeditionPoints = 15000;
      if (topScore < 25000000) maxExpeditionPoints = 12000;
      if (topScore < 5000000) maxExpeditionPoints = 9000;
      if (topScore < 1000000) maxExpeditionPoints = 6000;
      if (topScore < 100000) maxExpeditionPoints = 2500;
      //console.log('maxExpeditionPoints:', maxExpeditionPoints);

      const shipPoints = {
        fighterLight: 20,
        fighterHeavy: 50,
        cruiser: 135,
        battleship: 300,
        interceptor: 350,
        bomber: 375,
        destroyer: 550,
        deathstar: 45000,
        reaper: 700,
        explorer: 115,
        transporterSmall: 20,
        transporterLarge: 60,
        colonyShip: 150,
        recycler: 80,
        espionageProbe: 5,
      };
      //console.log('shipPoints:', shipPoints);

      $(
        [
          '<div class="allornonewrap" style="margin-left:15px;user-select:none;padding:7px;position:relative;height: 0px;margin-bottom: 30px;height:20px">',
          [
            '<div style="position: absolute;bottom: 4px;right: 10px; cursor:pointer" onwheel="uipp_changeExpeditionSystemOffset(event)" onclick="uipp_autoFillExpedition()" onmousedown="uipp_sendExpedition(event)" oncontextmenu="uipp_autoFillMilitaryExpedition(event)" class="tooltip tooltipHTML" title="' +
              getTooltip() +
              '">',
            '<span style="display:inline-block;background: #333; padding: 5px; margin-right: 5px; border-radius: 5px; vertical-align: 1px;"><span id="system-offset" style="font-family: monospace;">' +
              ((config.expeditionSystemOffset || 0) >= 0 ? '+' : '') +
              (config.expeditionSystemOffset || 0) +
              '</span><span style="margin: 0px 3px 0 0" class="galaxy_icons solarsystem"></span></span>',
            '<span class="enhancement"><span id="uipp-current-expedition-points"></span> / ' +
              maxExpeditionPoints +
              '</span>',
            '&nbsp<span id="uipp-current-expedition-points-percent">(0%)</span>',
            '<img src="' +
              uipp_images.expeditionMission +
              '" style="height:26px; vertical-align: -8px; margin-left: 5px;"/>',
            '</div>'
          ].join(''),
          '</div>'
        ].join('')
      ).insertAfter($('#allornone'));
      //console.log('Elemento inserito dopo #allornone');

      function getTooltip() {
        //console.log('Esegui getTooltip');
        var ret = 'Optimal expedition fleet :|';
        ret += '<div style=&quot;width:200px&quot;>';

        var nExplorers = Number($('.explorer .amount').attr('data-value'));
        //console.log('nExplorers:', nExplorers);
        var maxSmallMetalDiscovery =
        ret +=
          'Left click to select ships with enough cargo to return the largest common metal find (' +
          uipp_scoreHumanReadable(maxSmallMetalDiscovery) +
          ') or to reach the maximum expedition points (' +
          maxExpeditionPoints +
          '), whichever is higher.';
        ret += '<hr style=&quot;border: none; border-top: 1px solid #394959; outline: none; margin: 10px 0;&quot;>';
        var expeSlotsUsed = $('#slots .fleft:nth-child(2)')
          .text()
          .match(/[0-9]+/g)[0];
        var expeSlotsTotal = $('#slots .fleft:nth-child(2)')
          .text()
          .match(/[0-9]+/g)[1];
        //console.log('expeSlotsUsed:', expeSlotsUsed, 'expeSlotsTotal:', expeSlotsTotal);
        var fleetDivider = expeSlotsTotal - expeSlotsUsed || 1;
        ret +=
          'Right click to select ' +
          (fleetDivider == 1
            ? 'all'
            : fleetDivider == 2
            ? 'half of'
            : fleetDivider == 3
            ? 'a third of'
            : '1/' + fleetDivider + 'th of') +
          ' your military and transport fleet with 1 pathfinder and 1 spy probe, to be sent on a military expedition (excludes death stars, colony ships, and recyclers).';
        ret += '<hr style=&quot;border: none; border-top: 1px solid #394959; outline: none; margin: 10px 0;&quot;>';
        ret +=
          "Middle click to directly send selected ships to the system's 16th position for an expedition that lasts 1h.";
        ret += '<hr style=&quot;border: none; border-top: 1px solid #394959; outline: none; margin: 10px 0;&quot;>';
        ret += 'Scroll up or down on the box to change the system offset.';
        ret += '</div>';
        return ret;
      }

      // Aggiorna i punti di spedizione
      setInterval(function () {
        //console.log('Aggiorna i punti di spedizione');
        let currentPoints = 0;
        const shipsSelected = {
          fighterLight: Number($('.fighterLight input[type=text]').val()),
          fighterHeavy: Number($('.fighterHeavy input[type=text]').val()),
          cruiser: Number($('.cruiser input[type=text]').val()),
          battleship: Number($('.battleship input[type=text]').val()),
          interceptor: Number($('.interceptor input[type=text]').val()),
          bomber: Number($('.bomber input[type=text]').val()),
          destroyer: Number($('.destroyer input[type=text]').val()),
          deathstar: Number($('.deathstar input[type=text]').val()),
          reaper: Number($('.reaper input[type=text]').val()),
          explorer: Number($('.explorer input[type=text]').val()),
          transporterSmall: Number($('.transporterSmall input[type=text]').val()),
          transporterLarge: Number($('.transporterLarge input[type=text]').val()),
          colonyShip: Number($('.colonyShip input[type=text]').val()),
          recycler: Number($('.recycler input[type=text]').val()),
          espionageProbe: Number($('.espionageProbe input[type=text]').val()),
        };
        //console.log('shipsSelected:', shipsSelected);

        for (const key in shipsSelected) {
          currentPoints += shipsSelected[key] * shipPoints[key];
        }
        //console.log('currentPoints:', currentPoints);

        $('#uipp-current-expedition-points').text(currentPoints);

        const percent = Math.round((100 * currentPoints) / maxExpeditionPoints);
        const $percent = $('#uipp-current-expedition-points-percent');
        $percent.text(`(${percent}%)`);
        $percent.css(
          'color',
          percent >= 100 ? '#99CC00' : percent >= 70 ? '#d29d00' : '#d43635'
        );
        //console.log('percent:', percent);
      }, 100);
    }
  }, 100);
};

window.uipp_changeExpeditionSystemOffset = function (event) {
  //console.log('Esegui uipp_changeExpeditionSystemOffset');
  // Calcola la direzione dello scroll: +1 (su) o -1 (giù)
  const diff = event.deltaY > 0 ? -1 : +1;
  //console.log('diff:', diff);

  // Aggiorna l'offset del sistema
  config.expeditionSystemOffset = (config.expeditionSystemOffset || 0) + diff;
  //console.log('config.expeditionSystemOffset:', config.expeditionSystemOffset);

  // Aggiorna l'interfaccia per mostrare l'offset aggiornato
  document.getElementById('system-offset').innerHTML =
    ((config.expeditionSystemOffset || 0) >= 0 ? '+' : '') + (config.expeditionSystemOffset || 0);

  // Determina il nuovo sistema basato sull'offset
  let system = window._getCurrentPlanetCoordinates()[1] + (config.expeditionSystemOffset || 0);
  //console.log('system:', system);

  // Garantisce che il sistema rientri nei limiti dell'universo
  if (system > Number(config.universe.systems)) system = config.universe.systems;
  if (system < 1) system = 1;
  //console.log('system dopo limiti:', system);

  // Aggiorna il campo di input del sistema
  $('input#system').val(String(system)).keyup();

  // Salva la configurazione aggiornata
  window._saveConfig();

  // Previene il comportamento predefinito dello scroll
  event.preventDefault();
  return false;
};

window.uipp_autoFillExpedition = function () {
  //console.log('Esegui uipp_autoFillExpedition');
  // Ottieni i dati dal gioco
  const nExplorers = Number($('.explorer .amount').attr('data-value'));
  const nReapers = Number($('.reaper .amount').attr('data-value'));
  const nPathfinders = Number($('.pathfinder .amount').attr('data-value'));
  const nProbes = Number($('.espionageProbe .amount').attr('data-value'));
  const topScore = config.universe.topScore || 0; // Punteggio massimo dell'universo
  //console.log('nExplorers:', nExplorers, 'nReapers:', nReapers, 'nPathfinders:', nPathfinders, 'nProbes:', nProbes, 'topScore:', topScore);

  // Determina il Ritrovamento massimo base dinamicamente
  let ritrovamentoMassimoBase = 25000000; // Valore predefinito
  if (topScore < 100000000) ritrovamentoMassimoBase = 21000000;
  if (topScore < 75000000) ritrovamentoMassimoBase = 18000000;
  if (topScore < 50000000) ritrovamentoMassimoBase = 15000000;
  if (topScore < 25000000) ritrovamentoMassimoBase = 12000000;
  if (topScore < 5000000) ritrovamentoMassimoBase = 9000000;
  if (topScore < 1000000) ritrovamentoMassimoBase = 6000000;
  if (topScore < 100000) ritrovamentoMassimoBase = 2500000;
  //console.log('ritrovamentoMassimoBase:', ritrovamentoMassimoBase);

  // Bonus dinamici (gestisce anche l'assenza di bonus iniziali)
  const bonusClasseEsploratore =
    parseFloat(localStorage.getItem('explorerBonus')) / 100 || 0;
  const bonusRitrovamentiRisorse =
    parseFloat(localStorage.getItem('sensorBonus')) / 100 || 0;
  const bonusPathfinder = nExplorers > 0 ? 2 : 1; // Bonus Pathfinder se ci sono esploratori
  //console.log('bonusClasseEsploratore:', bonusClasseEsploratore, 'bonusRitrovamentiRisorse:', bonusRitrovamentiRisorse, 'bonusPathfinder:', bonusPathfinder);

  // Calcola il Ritrovamento massimo effettivo
  const velocitaEconomica = config.universe.speed || 1; // Velocità dell'universo
  const ritrovamentoBaseEconomico =
    ritrovamentoMassimoBase * velocitaEconomica; // Primo termine della formula
  const bonusTotali = bonusClasseEsploratore + bonusRitrovamentiRisorse;
  const bonusConPathfinder = bonusTotali * bonusPathfinder; // Bonus Pathfinder
  const bonusTotaleApplicato =
    bonusConPathfinder * ritrovamentoMassimoBase; // Secondo termine della formula
  const ritrovamentoMassimoEffettivo =
    ritrovamentoBaseEconomico + bonusTotaleApplicato;
  //console.log('ritrovamentoMassimoEffettivo:', ritrovamentoMassimoEffettivo);

  // Calcola il numero di trasportatori grandi necessari
  const ownedBigTransport = Number($('.transporterLarge .amount').attr('data-value'));
  const bigTransportCapacity =
    (1 + (config.hyperspaceTech || 0) * 0.05) * 25000; // Capacità di trasporto per trasportatore grande
  const maxBigTransportForDiscovery = Math.ceil(
    ritrovamentoMassimoEffettivo / bigTransportCapacity
  );
  //console.log('ownedBigTransport:', ownedBigTransport, 'bigTransportCapacity:', bigTransportCapacity, 'maxBigTransportForDiscovery:', maxBigTransportForDiscovery);

  // Limita al numero di trasportatori disponibili
  const nBigTransport = Math.min(maxBigTransportForDiscovery, ownedBigTransport);
  //console.log('nBigTransport:', nBigTransport);

  // Imposta i trasportatori grandi nei campi di input
  $('input[name=transporterLarge]').val(nBigTransport).keyup();

  // Configura gli esploratori e altre navi
  if (nExplorers > 0) {
    $('input[name=explorer]').val(1).keyup();
  }
  // Configura Reaper
  if (nReapers > 0) {
    $('input[name=reaper]').val(1).keyup();
  }
  // Configura Pathfinder
  if (nPathfinders > 0) {
    $('input[name=pathfinder]').val(1).keyup();
  }
  // Configura Sonda Spia
  if (nProbes > 0) {
    $('input[name=espionageProbe]').val(1).keyup();
  }

  // Seleziona posizione 16 e sistema
  $('input#position').val('16').keyup();

  // select expedition mission
  $('#missionButton15').click();
};