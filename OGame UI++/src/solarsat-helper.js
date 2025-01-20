'use strict';
window._addSolarSatHelperInterval = function _addSolarSatHelperInterval() {
  var productionCached = null; // Cache per evitare estrazioni ripetute

  // Funzione per estrarre la produzione energetica di un satellite solare
  function getSolarSatelliteProduction() {
    if (productionCached !== null) {
      return productionCached;
    }

    var $satelliteInfo = $('.txt_box .text');

    if ($satelliteInfo.length === 0) {
      return NaN;
    }

    var text = $satelliteInfo.text();
    var trimmedText = text.trim();
    var match = trimmedText.match(/produce una quantità di energia pari a\s*(\d+)\.?/i);

    if (match && match[1]) {
      productionCached = Number(match[1]);
      return productionCached;
    } else {
      return NaN;
    }
  }

  // Funzione principale per gestire gli aggiornamenti
  function mainFunction() {
    // ==========================================================================
    // Auto-fill number of solar satellites
    // ==========================================================================
    var $satelliteElements = $('#technologydetails .solarSatellite:not(.processedByScript)');
    
    if ($satelliteElements.length) {
      $satelliteElements.addClass('processedByScript'); // Aggiungi .processedByScript per evitare duplicazioni

      // Estrarre il numero di satelliti attuali dal data-value
      var satellitesAttr = $satelliteElements.find('.amount').attr('data-value');
      var currentSatellites = satellitesAttr ? Number(satellitesAttr) : 0;

      var energyText = $('#resources_energy').text().replace(/\./g, '');
      var energy = Number(energyText);

      if (energy < 0) {
        var production = getSolarSatelliteProduction();
        if (!isNaN(production)) {
          var n = Math.ceil(Math.abs(energy) / production);
          $('#build_amount').val(n);
        }
      }
    }

    // ==========================================================================
    // Solar satellite counter near energy consumption
    // ==========================================================================
    var energyProducedPerSat = getSolarSatelliteProduction();
    if (!isNaN(energyProducedPerSat)) {
      $('li.additional_energy_consumption:not(.enhanced)').each(function () {
        $(this).addClass('enhanced');

        var additionalEnergyNeededText = $(this).find('.value').attr('data-value');
        var additionalEnergyNeeded = Number(additionalEnergyNeededText);

        var nSats = Math.ceil(additionalEnergyNeeded / energyProducedPerSat);

        $(this).append(
          [
            '<span class="enhancement tooltip" style="font-weight:bold;margin-left:5px" title="' +
              $('.technology.solarSatellite').attr('aria-label') +
              ': ' +
              nSats +
              '">(',
            '<img src="' + uipp_images.ships[212] + '" style="height:16px;vertical-align:-4px"/> ',
            nSats,
            ')</span>'
          ].join('')
        );
      });
    }
  }

  // Inizializza MutationObserver per monitorare i cambiamenti nel DOM
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mainFunction();
    });
  });

  // Configura l'osservatore
  var config = { childList: true, subtree: true, characterData: true };

  // Inizia a osservare il body per cambiamenti
  observer.observe(document.body, config);

  // Esegui la funzione una volta all'avvio
  mainFunction();
};
