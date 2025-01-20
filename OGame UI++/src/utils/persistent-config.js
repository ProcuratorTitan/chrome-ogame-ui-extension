'use strict';

// e.g. s192-fr.ogame.gameforge.com:100123
var configKey = [
  $('meta[name="ogame-universe"]').attr('content'),
  ':',
  $('meta[name="ogame-player-id"]').attr('content')
].join('');
//console.log('Initial configKey:', configKey);

// Funzione per aggiornare la chiave di configurazione
function updateConfigKey() {
  //console.log('Aggiornamento della chiave di configurazione in corso...');
  var newConfigKey = [
    $('meta[name="ogame-universe"]').attr('content'),
    ':',
    $('meta[name="ogame-player-id"]').attr('content')
  ].join('');
  if (newConfigKey !== configKey) {
    configKey = newConfigKey;
    //console.log('Config key aggiornata:', configKey);
  } else {
    //console.log('Config key invariata.');
  }
}

// Save config: add a buffer timeout to prevent multiple writes
var saveConfigTimeout = null;
window._saveConfig = function saveConfigBuffered() {
  //console.log('Salvataggio della configurazione (buffered)...');
  updateConfigKey(); // Aggiorna la chiave di configurazione prima di salvare

  if (saveConfigTimeout) {
    //console.log('Reset del timeout per il salvataggio della configurazione.');
    clearTimeout(saveConfigTimeout);
  }

  saveConfigTimeout = setTimeout(actuallyDoSaveConfig, 10);
};

function actuallyDoSaveConfig() {
  //console.log('Salvataggio effettivo della configurazione in corso...');
  window.config.lastUpdate = Date.now();
  var configToSave = JSON.parse(JSON.stringify(window.config));
  delete configToSave['players'];
  delete configToSave['history'];
  //console.log('Configurazione da salvare:', configToSave);
  saveData(configKey, configToSave);
}

// Save players data (contains all planets)
window._savePlayers = function _savePlayers() {
  //console.log('Salvataggio dei dati dei giocatori...');
  saveData(configKey + ':players', window.config.players);
};

// Save players score history (large dataset, grows over time)
window._saveHistory = function _saveHistory() {
  //console.log('Salvataggio della cronologia dei punteggi dei giocatori...');
  saveData(configKey + ':history', window.config.history);
};

// Get config as a consolidated object containing players & history
window._getConfigAsync = function getConfigAsync(cbConfig, cbPlayers, cbHistory) {
  //console.log('Recupero configurazione, giocatori e cronologia in corso...');
  getDataAsync([configKey], function (data) {
    var config = data[configKey] || {};
    //console.log('Configurazione ricevuta:', config);
    config.universe = config.universe || {};
    config.labels = config.labels || {};
    config.lastPlayersUpdate = config.lastPlayersUpdate || 0;
    config.lastUpdate = config.lastUpdate || 0;
    config.inprog = config.inprog || 0;
    config.playerId = $('[name=ogame-player-id]').attr('content');
    cbConfig && cbConfig(config);

    // get players
    getDataAsync([configKey + ':players'], function (data) {
      var players = data[configKey + ':players'] || {};
      //console.log('Giocatori ricevuti:', players);
      cbPlayers && cbPlayers(players);

      // get history
      getDataAsync([configKey + ':history'], function (data) {
        var history = data[configKey + ':history'] || {};
        //console.log('Cronologia ricevuta:', history);
        cbHistory && cbHistory(history);
      });
    });
  });
};

// Generic functions: save & load data from local storage
function saveData(key, value) {
  //console.log('Salvataggio dati con chiave:', key, 'e valore:', value);
  var payload = JSON.stringify({ key, value });
  var evt = new CustomEvent('UIPPSaveData', {
    bubbles: true,
    cancelable: true,
    detail: payload
  });
  //console.log('Dispatch evento UIPPSaveData:', payload);
  document.dispatchEvent(evt);
}

function getDataAsync(keys, cb) {
  //console.log('Richiesta dati per le chiavi:', keys);
  var listener = function (evt) {
    var data = JSON.parse(evt.detail);
    //console.log('Risposta ricevuta per le chiavi:', keys, 'con dati:', data);
    document.removeEventListener('UIPPGetDataResponse:' + keys.join(','), listener);
    cb(data);
  };
  document.addEventListener('UIPPGetDataResponse:' + keys.join(','), listener);

  var evt = new CustomEvent('UIPPGetData', {
    bubbles: true,
    cancelable: true,
    detail: keys.join(',')
  });
  //console.log('Dispatch evento UIPPGetData per le chiavi:', keys);
  document.dispatchEvent(evt);
}
