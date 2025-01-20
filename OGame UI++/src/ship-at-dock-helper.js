'use strict';

window.uipp_getShipResources = function (ships) {
  var shipResources = {
    204: [3000, 1000, 0], // lf
    205: [6000, 4000, 0], // hf
    206: [20000, 7000, 2000], // c
    207: [45000, 15000, 0], // bs
    215: [30000, 40000, 15000], // bc
    211: [50000, 25000, 15000], // bo
    213: [60000, 50000, 15000], // des
    214: [5000000, 4000000, 1000000], // ds
    218: [85000, 55000, 20000], // reaper
    219: [8000, 15000, 8000], // pf

    202: [2000, 2000, 0], // small cargo
    203: [6000, 6000, 0], // large cargo
    208: [10000, 20000, 10000], // colony ship
    209: [10000, 6000, 2000], // recycler
    210: [0, 1000, 0] // spy sat?page=ingame&component=fleetdispatch
  };

  var currentShipResources = [0, 0, 0];

  for (var key in ships) {
    if (ships[key] === 0) {
      delete ships[key];
    } else {
      currentShipResources[0] += ships[key] * shipResources[key][0];
      currentShipResources[1] += ships[key] * shipResources[key][1];
      currentShipResources[2] += ships[key] * shipResources[key][2];
    }
  }

  return currentShipResources;
};

window.uipp_getShipPoints = function (ships) {
  var shipPoints = {
    204: 4,
    205: 10,
    206: 29,
    207: 60,
    215: 70,
    211: 90,
    213: 125,
    214: 10000,
    218: 160,
    219: 31,

    202: 4,
    203: 12,
    208: 40,
    209: 18,
    210: 1
  };

  var currentPoints = 0;

  for (var key in ships) {
    if (ships[key] === 0) {
      delete ships[key];
    } else {
      currentPoints += ships[key] * shipPoints[key];
    }
  }

  return currentPoints;
};

window._addShipAtDockHelper = function _addShipAtDockHelper() {
  for (var key in config.my.planets) {
    if (!config.my.planets[key].shipsLastUpdate) {
      config.my.planets[key].shipsNeedUpdate = 1;
      _saveConfig();
    }
  }

  _parseCurrentPlanetShips();
  _addPlanetListHelpers();
  _handleMissionsInProg();
};

function _parseCurrentPlanetShips() {
  if (document.location.href.indexOf('fleetdispatch') === -1 && document.location.href.indexOf('shipyard') === -1) {
    return;
  }

  // Mappa che associa gli ID delle navi ai loro nomi (puoi usare i nomi che preferisci)
  const shipIdMap = {
    204: 'fighterLight',
    205: 'fighterHeavy',
    206: 'cruiser',
    207: 'battleship',
    215: 'interceptor',
    211: 'bomber',
    213: 'destroyer',
    214: 'deathstar',
    218: 'reaper',
    219: 'explorer',
    202: 'transporterSmall',
    203: 'transporterLarge',
    208: 'colonyShip',
    209: 'recycler',
    210: 'espionageProbe'
  };

  const shipsAtDock = {};

  // Selettore per tutte le navi visibili, sia militari che civili
  const shipElements = $('#military .technology, #civil .technology');

  shipElements.each(function() {
    const $shipElement = $(this);
    const shipId = Number($shipElement.attr('data-technology'));

    // Verifica se l'ID della nave è valido
    if (!shipIdMap.hasOwnProperty(shipId)) {
      console.warn(`Unknown ship ID: ${shipId}`);
      return; // Passa alla prossima nave
    }

    // Estrae la quantità di navi
    let amount = 0;
    const amountElement = $shipElement.find('.amount');

    // Caso 1: La quantità è nell'elemento .amount (come per la maggior parte delle navi)
    if (amountElement.length) {
      amount = Number(amountElement.attr('data-value'));
    } 
    // Caso 2: La quantità è nel tooltip data-tooltip-title (come per transporterSmall e transporterLarge)
    else {
      const tooltipTitle = $shipElement.attr('data-tooltip-title');
      const amountMatch = tooltipTitle.match(/Amount : <b>([\d.]+)<\/b>/); // Cerca "Amount : <b>...</b>"
      if (amountMatch) {
        amount = Number(amountMatch[1].replace('.', '')); // Estrae il numero e rimuove i punti
      }
    }

    // Gestisce eventuali errori di conversione in numero
    if (isNaN(amount)) {
      console.error(`Invalid amount for ship ID ${shipId}: ${amountElement.length ? amountElement.attr('data-value') : $shipElement.attr('data-tooltip-title')}`);
      amount = 0;
    }

    shipsAtDock[shipId] = amount;
  });

  // Imposta a 0 le navi non trovate nell'HTML, per completezza
  for (const shipId in shipIdMap) {
    if (!shipsAtDock.hasOwnProperty(shipId)) {
      shipsAtDock[shipId] = 0;
    }
  }

  var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
  if ($('meta[name=ogame-planet-type]').attr('content') === 'moon') {
    currentPlanetCoordinatesStr += 'L';
  }

  if (window.config.my.planets[currentPlanetCoordinatesStr]) {
    window.config.my.planets[currentPlanetCoordinatesStr].shipPoints = uipp_getShipPoints(shipsAtDock);
    window.config.my.planets[currentPlanetCoordinatesStr].shipResources = uipp_getShipResources(shipsAtDock);
    window.config.my.planets[currentPlanetCoordinatesStr].ships = shipsAtDock;
    window.config.my.planets[currentPlanetCoordinatesStr].shipsLastUpdate = Date.now();
    window.config.my.planets[currentPlanetCoordinatesStr].shipsNeedUpdate = Date.now() + 7 * 24 * 36e5;
    window._saveConfig();
  }
}

function _addPlanetListHelpers() {
  var threshold = window.config.shipsAtDockThreshold;
  if (threshold <= 0) {
    threshold *= Number(
      ((window.config.players || {})[$('[name=ogame-player-id]').attr('content')] || {}).militaryScore || '0'
    );
  }

  // Debug: Aggiungi il frammento di analisi qui
    $('#planetList > div').each(function () {
      const planetCoords = $(this).find('.planet-koords').text();
      const planet = config.my.planets[planetCoords] || {};
      const shipPoints = planet.shipPoints || 0;
      const shipsNeedUpdate = planet.shipsNeedUpdate && planet.shipsNeedUpdate <= Date.now();

      if (shipPoints > threshold || shipsNeedUpdate) {
      } else {
      }
  });

  $('.shipsatdockhelper').remove();

  // Iteriamo direttamente sugli elementi con .planetlink
  $('#planetList').find('.planetlink').each(function () {
    var $planetDiv = $(this).closest('.smallplanet'); // risali all'elemento del pianeta
    var planetCoords = $planetDiv.find('.planet-koords').text();
    var planet = window.config.my.planets[planetCoords] || {};
    var shipPoints = planet.shipPoints || 0;

    var planetLink = $(this).attr('href');
    if (!planetLink) {
      return; // Nessun href, salto
    }
    var cpParts = planetLink.split('cp=');
    if (cpParts.length < 2) {
      return; // Nessun cp= trovato, salto
    }
    var cp = cpParts[1];

    var shipsNeedUpdate = planet.shipsNeedUpdate && planet.shipsNeedUpdate <= Date.now();

    if (shipPoints > threshold || shipsNeedUpdate) {
      var img = uipp_images.atk;
      var tooltip = window._translate('SHIP_AT_DOCK') + ' : ' + _num(shipPoints * 1000) + '|';
      tooltip += window._translate('LAST_UPDATE') + ' : ' + _time((Date.now() - planet.shipsLastUpdate) / 1000) + '<br><br>';
      tooltip += '<table class=&quot;marketitem_price_tooltip&quot;>';
      for (var key in planet.ships) {
        tooltip += [
          '<tr>',
          '<th>' + window.config.labels[key] + '</th>',
          '<td>' + planet.ships[key] + '</td>',
          '</tr>'
        ].join('');
      }
      tooltip += '</table>';

      if (shipsNeedUpdate) {
        tooltip = window._translate('SHIP_AT_DOCK') + ' : ???|';
        tooltip += window._translate('LAST_UPDATE') + ' : ' + _time((Date.now() - planet.shipsLastUpdate) / 1000) + '<br><br>';
        tooltip += window._translate('SHIP_AT_DOCK_THRESHOLD_NEED_UPDATE');
        img = uipp_images.atkunk;
      }

      $planetDiv.append(
        [
          '<a class="shipsatdockhelper" href="?page=ingame&component=fleetdispatch&cp=' + cp + '">',
          '<img src="' +
            img +
            '" class="tooltipHTML" title="' +
            tooltip +
            '" style="position: absolute; top: 3px; left: 22px; height: 18px; width: 18px;"/>',
          '</a>'
        ].join('')
      );
    }

    // Gestione luna, se presente
    var $moonLink = $planetDiv.find('.moonlink');
    if ($moonLink.length) {
      var moonCoords = planetCoords + 'L';
      var myPlanetMoon = window.config.my.planets[moonCoords] || {};
      var shipPointsMoon = myPlanetMoon.shipPoints || 0;

      var moonLinkHref = $moonLink.attr('href');
      if (!moonLinkHref) {
        return; // Nessun href per la luna
      }
      var moonParts = moonLinkHref.split('cp=');
      if (moonParts.length < 2) {
        return; // Nessun cp= nella luna
      }
      var cpMoon = moonParts[1];

      var shipsNeedUpdateMoon = myPlanetMoon.shipsNeedUpdate <= Date.now();

      if (shipPointsMoon > threshold || shipsNeedUpdateMoon) {
        var imgMoon = uipp_images.atk;
        var tooltipMoon = window._translate('SHIP_AT_DOCK') + ' : ' + _num(shipPointsMoon * 1000) + '|';
        if (myPlanetMoon.shipResources) {
          tooltipMoon += "<figure class='tf planetIcon'></figure> ";
          tooltipMoon += window.uipp_scoreHumanReadable(config.universe.debrisFactor * myPlanetMoon.shipResources[0]);
          tooltipMoon += ' / ';
          tooltipMoon += window.uipp_scoreHumanReadable(config.universe.debrisFactor * myPlanetMoon.shipResources[1]);
          tooltipMoon += ' / 0<br><br>';
        }
        tooltipMoon += window._translate('LAST_UPDATE') +
          ' : ' +
          _time((Date.now() - myPlanetMoon.shipsLastUpdate) / 1000) +
          '<br><br>';
        tooltipMoon += '<table class=&quot;marketitem_price_tooltip&quot;>';
        for (var k in myPlanetMoon.ships) {
          tooltipMoon += [
            '<tr>',
            '<th>' + window.config.labels[k] + '</th>',
            '<td>' + myPlanetMoon.ships[k] + '</td>',
            '</tr>'
          ].join('');
        }
        tooltipMoon += '</table>';

        if (shipsNeedUpdateMoon) {
          tooltipMoon = window._translate('SHIP_AT_DOCK') + ' : ???|';
          tooltipMoon += window._translate('LAST_UPDATE') +
            ' : ' +
            _time((Date.now() - myPlanetMoon.shipsLastUpdate) / 1000) +
            '<br><br>';
          tooltipMoon += window._translate('SHIP_AT_DOCK_THRESHOLD_NEED_UPDATE');
          imgMoon = uipp_images.atkunk;
        }

        $planetDiv.append(
          [
            '<a class="shipsatdockhelper" href="?page=ingame&component=fleetdispatch&cp=' + cpMoon + '">',
            '<img src="' +
              imgMoon +
              '" class="tooltipHTML" title="' +
              tooltipMoon +
              '" style="position: absolute; bottom: 5px; left: 19px; height: 15px; width: 15px;"/>',
            '</a>'
          ].join('')
        );
      }
    }
  });
}

function _handleMissionsInProg() {
  var missions = [];
  $('#eventContent .tooltip.tooltipClose').each(function () {
    var $tooltip = $($(this).attr('title'));
    var $tr = $(this).parent().parent();

    var entry = {
      id: Number($tr.attr('id').replace('eventRow-', '')),
      type: Number($tr.attr('data-mission-type')),
      from: $tr.find('.coordsOrigin a').text().trim(),
      fromMoon: $tr.find('.originFleet .moon').length > 0,
      to: $tr.find('.destCoords a').text().trim(),
      toMoon: $tr.find('.destFleet .moon').length > 0,
      returnMission: $tr.attr('data-return-flight') === 'true',
      t: Number($tr.attr('data-arrival-time')) * 1000
    };

    if (entry.returnMission) {
      // Se è un viaggio di ritorno, invertiamo origine e destinazione
      var to = entry.to;
      entry.to = entry.from;
      entry.from = to;
      var toMoon = entry.toMoon;
      entry.toMoon = entry.fromMoon;
      entry.fromMoon = toMoon;
    }

    missions.push(entry);
  });

  missions.forEach(function (m) {
    if (m.returnMission || m.type === 4) {
      var toCoords = m.to + (m.toMoon ? 'L' : '');
      if (m.type === 4 && m.returnMission) {
        toCoords = m.from + (m.fromMoon ? 'L' : '');
      }

      if (config.my.planets[toCoords] && m.t > config.my.planets[toCoords].shipsNeedUpdate) return;

      if (config.my.planets[toCoords] && config.my.planets[toCoords].shipsNeedUpdate != m.t) {
        config.my.planets[toCoords].shipsNeedUpdate = m.t;
        setTimeout(_addPlanetListHelpers, m.t - Date.now() + 1000);
        _saveConfig();
      }
    }
  });
}
