'use strict';

window._addReminderHelpers = function _addReminderHelpers() {
  // Cleanup delle notifiche passate
  //console.log('Inizio pulizia delle notifiche passate.');
  var now = Date.now();
  for (var timestamp in config.notifications) {
    if (Number(timestamp) < now) {
      //console.log(`Eliminazione notifica: ${timestamp}`);
      delete config.notifications[timestamp];
      _saveConfig();
    }
  }

  // Aggiunta di helper ogni 100ms
  setInterval(function () {
    //console.log('Esecuzione del ciclo di aggiunta helper.');

    // Helper per notifiche delle missioni
    var $missions = document.querySelectorAll('.fleetDetails:not(.enhanced-reminder)');
    if ($missions.length) {
      //console.log(`Trovate ${$missions.length} missioni non processate.`);
      $missions.forEach(function (mission) {
        //console.log('Processamento missione:', mission);
        mission.classList.add('enhanced-reminder');

        var timestamp = Number(mission.getAttribute('data-arrival-time')) * 1000;
        var alreadySet = (window.config.notifications || {})[timestamp] != null;
        
        var reminderButton = document.createElement('span');
        reminderButton.className = 'icon icon_chat tooltip';
        reminderButton.style = `
          user-select: none;
          filter: hue-rotate(45deg) saturate(2);
          cursor: pointer;
          ${alreadySet ? 'opacity:1;' : 'opacity:0.5;'}
        `;
        reminderButton.title = `Imposta un promemoria per ${new Date(timestamp).toLocaleString()}`;

        reminderButton.addEventListener('click', function () {
          //console.log('Cliccato bottone promemoria per timestamp:', timestamp);
          var img = mission.querySelector('img.tooltipHTML').src || '';
          var ships = mission.querySelector('.htmlTooltip table.fleetinfo').innerText.trim();
          var origin = mission.querySelector('.originCoords a').textContent.trim();
          var destination = mission.querySelector('.destinationCoords a').textContent.trim();
          
          var opts = {
            when: timestamp,
            img: img,
            message: `${ships} in arrivo da ${origin} a ${destination}`
          };

          if (alreadySet) {
            //console.log('Notifica già impostata, eliminazione in corso.');
            window.uipp_deleteNotification(opts);
            reminderButton.style.opacity = '0.5';
          } else {
            //console.log('Impostazione nuova notifica:', opts);
            window.uipp_notify(opts);
            reminderButton.style.opacity = '1';
          }
        });

        mission.prepend(reminderButton);
      });
    }

    // Helper per completamento costruzioni
    var $countdowns = document.querySelectorAll('.fleetStatus .reload:not(.enhanced-reminder)');
    if ($countdowns.length) {
      //console.log(`Trovati ${$countdowns.length} countdowns non processati.`);
      $countdowns.forEach(function (countdown) {
        //console.log('Processamento countdown:', countdown);
        countdown.classList.add('enhanced-reminder');

        var timestamp = Date.now() + 60000; // Simulazione del completamento in 1 minuto
        var alreadySet = (window.config.notifications || {})[timestamp] != null;
        
        var reminderButton = document.createElement('span');
        reminderButton.className = 'icon icon_chat tooltip';
        reminderButton.style = `
          user-select: none;
          filter: hue-rotate(45deg) saturate(2);
          cursor: pointer;
          ${alreadySet ? 'opacity:1;' : 'opacity:0.5;'}
        `;
        reminderButton.title = `Imposta un promemoria per ${new Date(timestamp).toLocaleString()}`;

        reminderButton.addEventListener('click', function () {
          //console.log('Cliccato bottone promemoria per countdown:', countdown);
          var img = countdown.querySelector('img').src || '';
          var planet = countdown.closest('.fleetStatus').querySelector('.current').textContent.trim();

          var opts = {
            when: timestamp,
            img: img,
            message: `Costruzione completata su ${planet}`
          };

          if (alreadySet) {
            //console.log('Notifica già impostata, eliminazione in corso.');
            window.uipp_deleteNotification(opts);
            reminderButton.style.opacity = '0.5';
          } else {
            //console.log('Impostazione nuova notifica:', opts);
            window.uipp_notify(opts);
            reminderButton.style.opacity = '1';
          }
        });

        countdown.append(reminderButton);
      });
    }
  }, 100);
};

// Funzione per creare notifiche
window.uipp_notify = function (opts) {
  //console.log('Creazione notifica:', opts);
  var now = Date.now();
  var when = opts.when || now;
  if (when != now) {
    window.config.notifications = window.config.notifications || {};
    window.config.notifications[when] = opts;
    _saveConfig();
  }
  var evt = new CustomEvent('UIPPNotification', { detail: opts });
  document.dispatchEvent(evt);
};

// Funzione per eliminare notifiche
window.uipp_deleteNotification = function (opts) {
  //console.log('Eliminazione notifica:', opts);
  var now = Date.now();
  var when = opts.when || now;
  if ((window.config.notifications || {})[when] != null) {
    delete window.config.notifications[when];
    _saveConfig();
  }
  var evt = new CustomEvent('UIPPNotificationDelete', { detail: opts });
  document.dispatchEvent(evt);
};