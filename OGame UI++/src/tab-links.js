'use strict';

$(document).ready(function() {
  // Assicura che window.config esista
  window.config = window.config || {};
  window.config.links = window.config.links || {
    BattleSim: 'https://battlesim.logserver.org/it',
    TradeCalc: 'https://proxyforgame.com/it/ogame/calc/trade.php',
    OTools: 'https://www.ghiroblu.com/o-tools/it/building_costs/',
    LifeformBuilding: 'https://lonestarx.net/'
  };

  // Aggiunge link ai tab
  window._addLinkTabs = function _addLinkTabs() {
    // Controlla se gli elementi necessari sono presenti nella pagina
    var universeElement = $('[name="ogame-universe"]');
    var playerNameElement = $('[name="ogame-player-name"]');
    
    if (universeElement.length > 0 && playerNameElement.length > 0) {
      var universe = universeElement.attr('content');
      var serverLang = universe.split('-')[1].split('.')[0];
      var serverNum = universe.split('-')[0].replace('s', '');
      var playerName = playerNameElement.attr('content');

      // Sostituisce template con i valori reali
      function _getLink(template) {
        return template.replace('{serverLang}', serverLang)
                       .replace('{serverNum}', serverNum)
                       .replace('{playerName}', playerName);
      }

      // Aggiunge le voci al menu
      var i = 0;
      for (var key in window.config.links) {
        var $entry = $(
          [
            '<li style="margin-top:' + (i === 0 ? '10' : '0') + 'px;" class="customlink' + ++i + '">',
            '<a class="menubutton" href="' +
              _getLink(window.config.links[key]) +
              '" ' +
              (window.config.links[key].indexOf('://') !== -1 ? 'target="_blank"' : '') +
              '>',
            '<span class="textlabel" style="color:white">' + key + '</span>',
            '</a>',
            '</li>'
          ].join('')
        );
        $('#menuTable').append($entry);
      }
    } else {
      console.error("Required elements are missing from the page.");
    }
  };

  // Rimuove un link
  window._removeLink = function _removeLink(key, element) {
    if (window.config.links && window.config.links[key]) {
      delete window.config.links[key];
      window._saveConfig();
  
      var $el = $(element);
      $el.parent().remove();
    } else {
      console.error("Link not found or already removed.");
    }
  };

  // Aggiunge un link
  window._addLink = function _addLink() {
    var label = window.prompt('Link label?');
    var url = window.prompt('URL?');

    if (label && url) {
      window.config.links[label] = url;
      window._saveConfig();
      document.location.reload();
    } else {
      console.error("Invalid input for label or URL.");
    }
  };

  // Chiama la funzione per aggiungere i tab
  window._addLinkTabs();
});
