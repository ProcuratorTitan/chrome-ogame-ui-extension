'use strict';
window._addCostsHelperInterval = function _addCostsHelperInterval() {
  var worth = window.uipp_getResourcesWorth();
  var resources = window._getCurrentPlanetResources();

  if (!resources) {
    return;
  }

  var resNames = ['metal', 'crystal', 'deuterium'];
  var missingResources = {};

  window._enhanceOnceOnDomChange('#technologydetails .content', function () {
    var costs = {};
    resNames.forEach(function (res) {
      costs[res] = Number(
        $('.resource.' + res + '.tooltip')
          .first()
          .attr('data-value') || '0'
      );
      missingResources[res] = Math.max(0, costs[res] - resources[res].now);
    });

    if (costs.metal || costs.crystal || costs.deuterium) {
      if (window.config.features.missingresources) {
        _addRessourceCountHelper();
      }

      if (window.config.features.shipresources) {
        _addRessourceCountTransportHelper();
      }

      if (window.config.features.minetext) {
        _addProductionRentabilityTimeTextHelper(costs);
      }

      //_addProductionBuildableInTextHelper(_getAvailableIn(resources, missingResources));
    }
  });

  function _addRessourceCountHelper() {
    [...resNames, 'energy', 'population'].forEach(function (res) {
      var $element = $('.costs .' + res + ':not(.enhanced)').first();
      if ($element.length > 0) {
        $('.costs').css('top', 'auto');
        $('.costs').css('bottom', '0');
        $element.css('height', 'auto');
        if (missingResources[res] > 0) {
          var $missingCount = $('<div class="enhancement"></div>');
          $missingCount.html('-' + window._num(missingResources[res], -1 * resources[res].prod || 0));
          $element.append($missingCount);

          var readyIn = Math.ceil((1000 * missingResources[res]) / resources[res].prod);
          if (readyIn < 24 * 36e5) {
            setTimeout(function () {
              $missingCount.html('&nbsp;');
              $missingCount.parent().removeClass('insufficient');
            }, readyIn);
          }
        } else {
          $element.append('<div class="enhancement">&nbsp;</div>');
        }

        $element.addClass('enhanced');
      }
    });
  }

  function _addRessourceCountTransportHelper() {
    if (missingResources.metal > 0 || missingResources.crystal > 0 || missingResources.deuterium > 0) {
      if ($('.capacity').length) return; // not on storage detail (there is no room)

      var planet = null;
      var res = 0;
      for (var key in config.my.planets) {
        var p = config.my.planets[key];
        var pKey =
          '[' + _getCurrentPlanetCoordinates().join(':') + ']' + (_getCurrentPlanetCoordinates().isMoon ? 'L' : '');
        if (key == pKey) {
          continue;
        }
        if (p.resources) {
          if (p.resources.metal.now > missingResources['metal']) {
            if (p.resources.crystal.now > missingResources['crystal']) {
              if (p.resources.deuterium.now > missingResources['deuterium']) {
                var res2 = p.resources.metal.now + p.resources.crystal.now + p.resources.deuterium.now;
                if (res2 > res) {
                  res = res2;
                  planet = p;
                }
              }
            }
          }
        }
      }

      if (planet) {
        $('.description').first().append(`
        <a href="?page=ingame&component=fleetdispatch&galaxy=${_getCurrentPlanetCoordinates()[0]}&system=${
          _getCurrentPlanetCoordinates()[1]
        }&position=${_getCurrentPlanetCoordinates()[2]}&type=1&mission=3&cp=${planet.id}&metal=${
          missingResources['metal']
        }&crystal=${missingResources['crystal']}&deuterium=${missingResources['deuterium']}">
          <div class="txt_box enhancement">
            <img src="${uipp_images.ship}" style="height:18px;vertical-align:-4px;margin-right:2px;"/>
            ${config.labels['3']}
            ${gfNumberGetHumanReadable(missingResources['metal'], false)} ${config.labels.metal}, 
            ${gfNumberGetHumanReadable(missingResources['crystal'], false)} ${config.labels.crystal}, 
            ${gfNumberGetHumanReadable(missingResources['deuterium'], false)} ${config.labels.deuterium}
            (${
              planet.isMoon
                ? '<figure class="planetIcon moon" style="vertical-align:-4px;margin-right:2px"></figure>'
                : ''
            }${config.my.planets['[' + planet.coords.join(':') + ']'].name})
          </div>
        </a>
        `);
      }
    }
  }

  function _getAvailableIn(resources, missingResources) {
    var ret = {};
    ['metal', 'crystal', 'deuterium'].forEach(function (res) {
      var availableIn = 0;
      if (missingResources[res] > 0) {
        availableIn = missingResources[res] / resources[res].prod;
        if (isNaN(availableIn)) {
          availableIn = Infinity;
        }
      }

      ret[res] = availableIn;
    });

    return ret;
  }

  function _addProductionBuildableInTextHelper(availableIn) {
    var $el = $('#technologydetails .content .build-it_wrap:not(.enhanced-buildable-in)');
    $el.addClass('enhanced-buildable-in');
    $el.css('text-align', 'center');

    var availableInMax = Math.max(availableIn.metal, availableIn.crystal, availableIn.deuterium);

    if (availableInMax > 0) {
      $el.html(
        '<p class="enhancement" style="margin: 8px 0">' +
          window._translate('BUILDABLE_IN', {
            time: window._time(availableInMax, -1)
          }) +
          '</p>'
      );
      var $btn = $('<button class="upgrade">Alert me</button>');
      var now = Date.now();
      $btn.on('click', function () {
        if ($btn.attr('disabled')) {
          return;
        }
        $btn.attr('disabled', 'disabled');
        var elapsed = (Date.now() - now) / 1000;
        setTimeout(function () {
          alert(window._translate('PRODUCTION_READY'));
          var techId = $el.parent().parent().parent().attr('data-technology-id');
          $el.html(
            '<button class="upgrade" data-technology="' +
              techId +
              '"><span class="tooltip" title="">' +
              window._translate('UPGRADE') +
              '</span></button>'
          );
        }, (availableInMax - elapsed) * 1000);
      });
      $el.append($btn);
    }
  }

  function _addProductionMaximumBuildableTextHelper(costs) {
    var $amount = $('.content .build_amount:not(.enhanced)');
    $amount.find('label').css('margin-top', '-4px');
    if ($amount.length > 0) {
      var maxMetal = resources.metal.now / costs.metal;
      var maxCrystal = resources.crystal.now / costs.crystal;
      var maxDeuterium = resources.deuterium.now / costs.deuterium;
      var max = Math.floor(Math.min(maxMetal, maxCrystal, maxDeuterium));
      if (isFinite(max)) {
        var $max = $(
          '<div class="enhancement" style="font-size:9px;cursor:pointer;position:absolute;top:-10px"><u>Max:</u> ' +
            max +
            '</div>'
        );
        $max.on('click', function () {
          $('#build_amount')[0].value = max;
        });
        $amount.append($max);
      }

      $amount.addClass('enhanced');
    }
  }

  function _addProductionRentabilityTimeTextHelper() {
    var tradeRateStr = window.config.tradeRate.map(String).join(' / ');

    var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
    var planet = window.config.my.planets[currentPlanetCoordinatesStr];
    var appendedContent = false;

    // if we are viewing a metal mine, computes rentability time
    if ($('.building.metalMine:not(.enhanced)').length > 0) {
      $('.content .information .narrow').append(
        '<li class="enhancement">' +
          window._translate('ROI', {
            time: window._time(
              window._getRentabilityTime(
                'metal',
                resources.metal.prod,
                resources.metal.level,
                resources.metal.level + 1,
                planet.averageTemp,
                planet.coords
              )
            ),
            tradeRate: tradeRateStr
          }) +
          '</li>'
      );
      $('.building.metalMine').addClass('enhanced');
      appendedContent = true;
    }

    // if we are viewing a crystal mine, computes rentability time
    else if ($('.building.crystalMine:not(.enhanced)').length > 0) {
      $('.content .information .narrow').append(
        '<li class="enhancement">' +
          window._translate('ROI', {
            time: window._time(
              window._getRentabilityTime(
                'crystal',
                resources.crystal.prod,
                resources.crystal.level,
                resources.crystal.level + 1,
                planet.averageTemp,
                planet.coords
              )
            ),
            tradeRate: tradeRateStr
          }) +
          '</li>'
      );
      $('.building.crystalMine').addClass('enhanced');
      appendedContent = true;
    }

    // if we are viewing a deuterium mine, computes rentability time
    else if ($('.building.deuteriumSynthesizer:not(.enhanced)').length > 0) {
      $('.content .information .narrow').append(
        '<li class="enhancement">' +
          window._translate('ROI', {
            time: window._time(
              window._getRentabilityTime(
                'deuterium',
                resources.deuterium.prod,
                resources.deuterium.level,
                resources.deuterium.level + 1,
                planet.averageTemp,
                planet.coords
              )
            ),
            tradeRate: tradeRateStr
          }) +
          '</li>'
      );
      $('.building.deuteriumSynthesizer').addClass('enhanced');
      appendedContent = true;
    }

    // if we are viewing a plasma technology, computes rentability time
    else if ($('.building.plasmaTechnology:not(.enhanced)').length > 0) {
      var technologyLevel = Number($('#technologydetails_content span.level').text().trim().split(' ').pop()) || 0;
      var rentabilityTime = window._getRentabilityTime('plasma', null, technologyLevel);
      $('.content .information > ul').append(
        '<li class="enhancement">' +
          window._translate('ROI', {
            time: window._time(rentabilityTime),
            tradeRate: tradeRateStr
          }) +
          '</li>'
      );
      $('.building.plasmaTechnology').addClass('enhanced');
      appendedContent = true;
    }

    // if we are viewing a lifeform tech that boosts production, computes rentability time
    else {
      var lftech = {
        // buildings
        lfbuildrock1: 'lifeformTech12101',
        lfbuildrock2: 'lifeformTech12102',
        lfbuildrock3: 'lifeformTech12103',
        lfbuildrock4: 'lifeformTech12104',
        lfbuildrock5: 'lifeformTech12105',
        lfbuildrock6: 'lifeformTech12106',
        lfbuildrock7: 'lifeformTech12107',
        lfbuildrock8: 'lifeformTech12108',
        lfbuildrock9: 'lifeformTech12109',
        lfbuildrock10: 'lifeformTech12110',
        lfbuildrock11: 'lifeformTech12111',
        lfbuildrock12: 'lifeformTech12112',
        lfbuildhuma1: 'lifeformTech11101',
        lfbuildhuma2: 'lifeformTech11102',
        lfbuildhuma3: 'lifeformTech11103',
        lfbuildhuma4: 'lifeformTech11104',
        lfbuildhuma5: 'lifeformTech11105',
        lfbuildhuma6: 'lifeformTech11106',
        lfbuildhuma7: 'lifeformTech11107',
        lfbuildhuma8: 'lifeformTech11108',
        lfbuildhuma9: 'lifeformTech11109',
        lfbuildhuma10: 'lifeformTech11110',
        lfbuildhuma11: 'lifeformTech11111',
        lfbuildhuma12: 'lifeformTech11112',
        lfbuildmech1: 'lifeformTech13101',
        lfbuildmech2: 'lifeformTech13102',
        lfbuildmech3: 'lifeformTech13103',
        lfbuildmech4: 'lifeformTech13104',
        lfbuildmech5: 'lifeformTech13105',
        lfbuildmech6: 'lifeformTech13106',
        lfbuildmech7: 'lifeformTech13107',
        lfbuildmech8: 'lifeformTech13108',
        lfbuildmech9: 'lifeformTech13109',
        lfbuildmech10: 'lifeformTech13110',
        lfbuildmech11: 'lifeformTech13111',
        lfbuildmech12: 'lifeformTech13112',
        lfbuildmech13: 'lifeformTech13113',
        lfbuildkael1: 'lifeformTech14101',
        lfbuildkael2: 'lifeformTech14102',
        lfbuildkael3: 'lifeformTech14103',
        lfbuildkael4: 'lifeformTech14104',
        lfbuildkael5: 'lifeformTech14105',
        lfbuildkael6: 'lifeformTech14106',
        lfbuildkael7: 'lifeformTech14107',
        lfbuildkael8: 'lifeformTech14108',
        lfbuildkael9: 'lifeformTech14109',
        lfbuildkael10: 'lifeformTech14110',
        lfbuildkael11: 'lifeformTech14111',
        lfbuildkael12: 'lifeformTech14112',
        // tech
        lftechmech1: 'lifeformTech13201',
        lftechhuma2: 'lifeformTech11202',
        lftechhuma3: 'lifeformTech11203',
        lftechhuma4: 'lifeformTech11204',
        lftechhuma5: 'lifeformTech11205',
        lftechhuma6: 'lifeformTech11206',
        lftechhuma7: 'lifeformTech11207',
        lftechhuma8: 'lifeformTech11208',
        lftechhuma9: 'lifeformTech11209',
        lftechhuma10: 'lifeformTech11210',
        lftechhuma11: 'lifeformTech11211',
        lftechhuma12: 'lifeformTech11212',
        lftechhuma13: 'lifeformTech11213',
        lftechhuma14: 'lifeformTech11214',
        lftechhuma15: 'lifeformTech11215',
        lftechhuma16: 'lifeformTech11216',
        lftechhuma17: 'lifeformTech11217',
        lftechhuma18: 'lifeformTech11218',
        lftechkael1: 'lifeformTech14201',
        lftechkael2: 'lifeformTech14202',
        lftechkael3: 'lifeformTech14203',
        lftechkael4: 'lifeformTech14204',
        lftechkael5: 'lifeformTech14205',
        lftechkael6: 'lifeformTech14206',
        lftechkael7: 'lifeformTech14207',
        lftechkael8: 'lifeformTech14208',
        lftechkael9: 'lifeformTech14209',
        lftechkael10: 'lifeformTech14210',
        lftechkael11: 'lifeformTech14211',
        lftechkael12: 'lifeformTech14212',
        lftechkael13: 'lifeformTech14213',
        lftechkael14: 'lifeformTech14214',
        lftechkael15: 'lifeformTech14215',
        lftechkael16: 'lifeformTech14216',
        lftechkael17: 'lifeformTech14217',
        lftechkael18: 'lifeformTech14218',
        lftechrock1: 'lifeformTech12201',
        lftechrock2: 'lifeformTech12202',
        lftechrock3: 'lifeformTech12203',
        lftechrock4: 'lifeformTech12204',
        lftechrock5: 'lifeformTech12205',
        lftechrock6: 'lifeformTech12206',
        lftechrock7: 'lifeformTech12207',
        lftechrock8: 'lifeformTech12208',
        lftechrock9: 'lifeformTech12209',
        lftechrock10: 'lifeformTech12210',
        lftechrock11: 'lifeformTech12211',
        lftechrock12: 'lifeformTech12212',
        lftechrock13: 'lifeformTech12213',
        lftechrock14: 'lifeformTech12214',
        lftechrock15: 'lifeformTech12215',
        lftechrock16: 'lifeformTech12216',
        lftechrock17: 'lifeformTech12217',
        lftechrock18: 'lifeformTech12218',
        lftechmech1: 'lifeformTech13201',
        lftechmech2: 'lifeformTech13202',
        lftechmech3: 'lifeformTech13203',
        lftechmech4: 'lifeformTech13204',
        lftechmech5: 'lifeformTech13205',
        lftechmech6: 'lifeformTech13206',
        lftechmech7: 'lifeformTech13207',
        lftechmech8: 'lifeformTech13208',
        lftechmech9: 'lifeformTech13209',
        lftechmech10: 'lifeformTech13210',
        lftechmech11: 'lifeformTech13211',
        lftechmech12: 'lifeformTech13212',
        lftechmech13: 'lifeformTech13213',
        lftechmech14: 'lifeformTech13214',
        lftechmech15: 'lifeformTech13215',
        lftechmech16: 'lifeformTech13216',
        lftechmech17: 'lifeformTech13217',
        lftechmech18: 'lifeformTech13218'
      };
      for (var key in lftech) {
        if ($('#technologydetails .' + lftech[key] + ':not(.enhanced)').length > 0) {
          var technologyLevel = Number($('#technologydetails_content span.level').text().trim().split(' ').pop()) || 0;
          var rentabilityTime = window._getRentabilityTime(key, null, technologyLevel);
          $('.content .information > ul').append(
            '<li class="enhancement">' +
              window._translate('ROI', {
                time: window._time(rentabilityTime),
                tradeRate: tradeRateStr
              }) +
              '</li>'
          );
          $('#technologydetails .' + lftech[key]).addClass('enhanced');
          appendedContent = true;
        }
      }
    }

    // vanilla CSS fixes to allow display of additional info
    if (appendedContent) {
      $('.content .information > ul').css('width', 'auto');
      $('.content .information .narrow li').css('margin-bottom', '6px');
      $('.information li:not(.resource)').css('margin-bottom', '1px'); // reduce margin to fit a 4th line
    }
  }
};
