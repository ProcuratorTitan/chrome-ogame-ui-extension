var fn = function () {
  'use strict';
  window._setConfigMyPlanets = function _setConfigMyPlanets () {
    if (!window.config.my) {
      window.config.my = {};
    }

    if (!window.config.my.planets) {
      window.config.my.planets = {};
    }

    if ($('#planetList').children().length === 1) {
      var onlyPlanetLink = $($('#planetList').children()[0]).find('.planetlink');
      var onlyPlanetName = onlyPlanetLink.find('.planet-name').text();
      var onlyPlanetCoords = onlyPlanetLink.find('.planet-koords').text();

      window.config.my.planets[onlyPlanetCoords] = window.config.my.planets[onlyPlanetCoords] || {};
      window.config.my.planets[onlyPlanetCoords].name = onlyPlanetName;
      window.config.my.planets[onlyPlanetCoords].coords = onlyPlanetCoords.replace(/[[\]]/g, '').split(':').map(Number);
      window.config.my.planets[onlyPlanetCoords].href = onlyPlanetLink.attr('href');

	  var tooltiphtml = onlyPlanetLink.attr('title');
        if (tooltiphtml) { // user may already have deployed the tooltip when this code is run
          var temperatures = tooltiphtml.match(/[-0-9 ]+°C/g);
          if (temperatures && window.config.my.planets[onlyPlanetCoords]) {
            temperatures = temperatures.map(function (temp) {
              return Number(temp.replace('°C', '').trim());
            });
            window.config.my.planets[onlyPlanetCoords].averageTemp = (temperatures[0] + temperatures[1]) / 2;
          }
        }
    } else {
      $('#planetList').children().each(function () {
        var link = $(this).find('.planetlink');
        var planetName = link.find('.planet-name').text();
        var planetCoords = link.find('.planet-koords').text();
        if (link.hasClass('active')) {
          window.config.my.planets[planetCoords] = window.config.my.planets[planetCoords] || {};
          window.config.my.planets[planetCoords].name = planetName;
          window.config.my.planets[planetCoords].coords = planetCoords.replace(/[[\]]/g, '').split(':').map(Number);
          window.config.my.planets[planetCoords].href = link.attr('href');
        }

        var tooltiphtml = link.attr('title');
        if (tooltiphtml) { // user may already have deployed the tooltip when this code is run
          var temperatures = tooltiphtml.match(/[-0-9 ]+°C/g);
          if (temperatures && window.config.my.planets[planetCoords]) {
            temperatures = temperatures.map(function (temp) {
              return Number(temp.replace('°C', '').trim());
            });
            window.config.my.planets[planetCoords].averageTemp = (temperatures[0] + temperatures[1]) / 2;
          }
        }

        if ($(this).find('.moonlink').length) {
          window.config.my.planets[planetCoords + 'L'] = window.config.my.planets[planetCoords + 'L'] || {};
          window.config.my.planets[planetCoords + 'L'].coords = planetCoords.replace(/[[\]]/g, '').split(':').map(Number);
          window.config.my.planets[planetCoords + 'L'].href = $(this).find('.moonlink').attr('href');
          window.config.my.planets[planetCoords + 'L'].isMoon = true;
          if (window.config.my.planets[planetCoords]) {
            window.config.my.planets[planetCoords].moon = planetCoords + 'L';
          }
        }
      });
    }

    for (var key in window.config.my.planets) {
      if (!window.config.my.planets[key].coords) {
        delete window.config.my.planets[key];
      }
    }

    // clear abandoned planets & destroyed moons
    var myPlanets = $('#myPlanets').html();
    if (myPlanets) {
      for (var key in config.my.planets) {
        if (!key) { continue }
        if (key.indexOf('L') === -1) {
          if (myPlanets.indexOf(key) === -1) {
            //console.log('delete planet', key);
            delete config.my.planets[key];
            _saveConfig();
          }
        } else {
          $('#planetList > div').each(function() {
            if ($(this).html().indexOf(key.replace('L', '')) !== -1) {
              //console.log('moon', key, 'is in', $(this));
              if (!$(this).find('.icon-moon').length) {
                //console.log('moon is gone', key);
                delete config.my.planets[key];
                _saveConfig();
              } else {
                //console.log('moon still here', key);
              }
            }
          });
        }
      }
    }

    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
