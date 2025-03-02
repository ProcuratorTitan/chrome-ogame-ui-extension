'use strict';

window._parseResearchTab = function _parseResearchTab() {
  if (document.location.href.indexOf('research') === -1) {
    return;
  }
  if (document.location.href.indexOf('lfresearch') !== -1) {
    return;
  }

  const getLevel = (selector) => {
    const $element = $(selector);
    if ($element.length === 0) {
      console.warn(`Element not found for selector: ${selector}`);
      return 0;
    }

    // Prova a ottenere il livello dall'attributo data-value
    const dataValue = $element.attr('data-value');
    if (dataValue) {
      return Number(dataValue);
    }

    // Prova a ottenere il livello dal testo all'interno di stockAmount
    const stockAmount = $element.find('.stockAmount').text();
    if (stockAmount) {
      return Number(stockAmount);
    }

    console.warn(`No valid level found for selector: ${selector}`);
    return 0;
  };

  window.config.combustionDrive = getLevel('.combustionDriveTechnology .level');
  window.config.impulseDrive = getLevel('.impulseDriveTechnology .level');
  window.config.hyperspaceDrive = getLevel('.hyperspaceDriveTechnology .level');
  window.config.plasmaTech = getLevel('.plasmaTechnology .level');
  window.config.astroTech = getLevel('.astrophysicsTechnology .level');
  window.config.computerTech = getLevel('.computerTechnology .level');
  window.config.hyperspaceTech = getLevel('.hyperspaceTechnology .level');
  window.config.energyTech = getLevel('.energyTechnology .level');
  window.config.espionageTech = getLevel('.espionageTechnology .level');
  window.config.laserTech = getLevel('.laserTechnology .level');
  window.config.ionTech = getLevel('.ionTechnology .level');
  window.config.researchTech = getLevel('.researchTechnology .level');
  window.config.weaponsTech = getLevel('.weaponsTechnology .level');
  window.config.shieldingTech = getLevel('.shieldingTechnology .level');
  window.config.armorTech = getLevel('.armorTechnology .level');


  window._saveConfig();
};
