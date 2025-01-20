'use strict';

/**
 * Avvia l'intervallo che scansiona i messaggi (sia di Spedizione 41 sia di Combattimento 25).
 */
window._addExpeditionMessageParserInterval = function _addExpeditionMessageParserInterval() {
  const currentUrl = window.location.href;

  // 1) Controlla se siamo su ingame&component=messages
  if (!(currentUrl.includes('page=ingame') && currentUrl.includes('component=messages'))) {
    return;
  }

  // 2) Ogni secondo cerca nuovi messaggi
  setInterval(parseMessages, 1000);

  function parseMessages() {
    $('div.msg:not(.uipp-parsed)').each(function () {
      $(this).addClass('uipp-parsed');
      handleMessage($(this));
    });
  }

  /**
   * handleMessage: a seconda del messagetype, gestisce spedizione (41) o combattimento (25).
   */
  function handleMessage($el) {
    const $raw = $el.find('.rawMessageData');
    if (!$raw.length) {
      return;
    }

    const coords = $raw.data('raw-coords');       
    const dateStr = $raw.data('raw-date');        
    const msgType = $raw.data('raw-messagetype'); // 41=spedizione, 25=combat, ecc.
    if (!coords || !dateStr) {
      return;
    }

    // Se filtravi "posizione=16", decommenta:
    if (coords.split(':')[2] !== '16') { return; }

    const timestamp = new Date(dateStr).getTime();

    if (msgType === 41) {
      // Spedizione
      handleExpeditionMessage($el, coords, timestamp);
    } else if (msgType === 25) {
      // Rapporto di Combattimento
      handleCombatMessage($el, coords, timestamp);
    }
  }

  /**
   * handleExpeditionMessage: come prima, parse + salva.
   */
  function handleExpeditionMessage($el, coords, timestamp) {
    const expeditionContent = window.uipp_parseExpeditionMessage($el);

    window.config.expeditionResults = window.config.expeditionResults || {};
    window.config.expeditionResults[timestamp + '|' + coords] = expeditionContent;
    for (var key in window.config.expeditionResults) {
      if (Object.keys(window.config.expeditionResults[key]).length === 0) {
        delete window.config.expeditionResults[key];
      }
    }

    window._saveConfig();
  }

  /**
   * handleCombatMessage: parse + salva i detriti come 'expe.data.debris'.
   */
  function handleCombatMessage($el, coords, timestamp) {
    const combatContent = window.uipp_parseCombatMessage($el);

    window.config.expeditionResults = window.config.expeditionResults || {};
    window.config.expeditionResults[timestamp + '|' + coords] = combatContent;
    window._saveConfig();
  }

};

// -----------------------------------------------------------------------------------------

/**
 * Parsing della SPEDIZIONE (messagetype=41). 
 * Rimane uguale a prima, con i vari flag (n, r, f, p, a, x...) e result (risorse, navi, ecc.).
 */
window.uipp_parseExpeditionMessage = function ($el) {
  const ret = {
    flags: {
      o: null,
      s: null,
      n: 0,
      l: 0,
      p: 0,
      a: 0,
      t: 0,
      i: 0,
      e: 0,
      d: 0,
      f: 0,
      r: 0,
      x: 0
    },
    result: {},
    text: $el.find('.msgContent').text()
  };

  const $raw = $el.find('.rawMessageData');
  if (!$raw.length) return ret;

  const expeditionResult = $raw.data('raw-expeditionresult');  
  const resourcesGained = $raw.data('raw-resourcesgained');    
  const shipsGained = $raw.data('raw-technologiesgained');     
  const depletionValue = $raw.data('raw-depletion');           
  const sizeValue = $raw.data('raw-size');
  const itemsGained = $raw.data('raw-itemsgained');                     
  // eventuali “navigation” ecc...

  switch (expeditionResult) {
    case 'nothing':
      ret.flags.n = 1;
      break;
    case 'ressources':
      ret.flags.r = 1;
      break;
    case 'shipwrecks':
      ret.flags.f = 1;
      break;
    case 'combatPirates':
      ret.flags.p = 1;
      break;
    case 'combatAliens':
      ret.flags.a = 1;
      break;
    case 'darkmatter':
      ret.flags.x = 1;
      break;
    case 'navigation':
      ret.flags.d = 1; 
      break;
    case 'items': // Nuovo caso per gli item
      ret.flags.i = 1;
      if (itemsGained) {
        try {
          const items = typeof itemsGained === 'string' ? JSON.parse(itemsGained) : itemsGained;
          ret.result.items = items.map(item => ({
            id: item.id,
            name: item.name,
            amount: item.amount
          }));
        } catch (error) {
          console.error('Errore nel parsing di itemsGained:', error);
        }
      }
      break;
  }

  if (resourcesGained) {
    if (resourcesGained.darkMatter) {
      ret.result.AM = resourcesGained.darkMatter;
    }
    if (resourcesGained.metal) {
      ret.result.metal = resourcesGained.metal;
    }
    if (resourcesGained.crystal) {
      ret.result.crystal = resourcesGained.crystal;
    }
    if (resourcesGained.deuterium) {
      ret.result.deuterium = resourcesGained.deuterium;
    }
  }

  if (shipsGained) {
    ret.flags.f = 1;
    for (const shipId in shipsGained) {
      ret.result[shipId] = shipsGained[shipId].amount;
    }
  }

  // mappa sizeValue -> s,m,l,h
  if (sizeValue === 0) ret.flags.s = 's';
  else if (sizeValue === 1) ret.flags.s = 'm';
  else if (sizeValue === 2) ret.flags.s = 'l';
  else if (sizeValue === 3) ret.flags.s = 'h';

  // mappa depletionValue -> l,m,h
  if (typeof depletionValue !== 'undefined') {
    if (depletionValue === 1) {
      ret.flags.o = 'l';
    } else if (depletionValue === 2) {
      ret.flags.o = 'm';
    } else if (depletionValue === 3) {
      ret.flags.o = 'h';
    } else {
      ret.flags.o = depletionValue;
    }
  }

  return ret;
};

/**
 * Parsing del RAPPORTO DI COMBATTIMENTO (messagetype=25).
 * Recuperiamo i “debris” da data-raw-result, e lo salviamo in ret.debris.
 */
window.uipp_parseCombatMessage = function ($el) {
  // Struttura simile a spedizione
  const ret = {
    debris: {
      metal: 0,
      crystal: 0
    },
    text: $el.find('.msgContent').text()
  };

  const $raw = $el.find('.rawMessageData');
  if (!$raw.length) {
    return ret;
  }

  // "data-raw-result" è un JSON con { "debris": { "resources": [ ... ] } ... }
  const rawResult = $raw.data('raw-result'); 
  // Di solito è un oggetto, tipo:
  // {
  //   "winner": "defender",
  //   "loot": {...},
  //   "debris": {
  //       "resources": [
  //         { "resource": "metal", "total": 7896400, "recycled": 0, "remaining": 7896400 },
  //         { "resource": "crystal", "total": 4461200, "recycled": 0, "remaining": 4461200 }
  //       ],
  //     ...
  //   },
  //   ...
  // }

  if (rawResult && rawResult.debris && rawResult.debris.resources) {
    rawResult.debris.resources.forEach(res => {
      if (res.resource === 'metal') {
        ret.debris.metal = res.total || 0;
      } else if (res.resource === 'crystal') {
        ret.debris.crystal = res.total || 0;
      }
    });
  }

  // Se vuoi anche salvare altre info, tipo “winner”, “loot”, ecc., puoi farlo qui:
  // ret.winner = rawResult.winner;
  // ret.loot = rawResult.loot;

  return ret;
};
