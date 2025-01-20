'use strict';

var _cachedInflightResources = null;

window.uipp_getResourcesInFlight = function uipp_getResourcesInFlight() {
    if (_cachedInflightResources) {
        //console.log('Cache hit:', _cachedInflightResources);
        return _cachedInflightResources;
    }

    _cachedInflightResources = { metal: 0, crystal: 0, deuterium: 0 };

    var missions = [];
    //console.log('Parsing resources in flight...');

    document.querySelectorAll('.eventFleet').forEach((fleetRow) => {
        const missionType = Number(fleetRow.getAttribute('data-mission-type'));
        const returnFlight = fleetRow.getAttribute('data-return-flight') === 'true';
        const arrivalTime = Number(fleetRow.getAttribute('data-arrival-time'));

        const origin = fleetRow.querySelector('.coordsOrigin a')?.textContent.trim() || '';
        const destination = fleetRow.querySelector('.destCoords a')?.textContent.trim() || '';

        // Extract resources from the tooltip
        const tooltipElement = fleetRow.querySelector('.icon_movement .tooltip, .icon_movement_reserve .tooltip');
        if (!tooltipElement) {
            //console.warn('Tooltip not found for fleet:', fleetRow.id);
            return;
        }

        const tooltipHTML = tooltipElement.getAttribute('data-tooltip-title');
        const resources = extractResourcesFromTooltip(tooltipHTML);

        const entry = {
            id: fleetRow.id,
            type: missionType,
            metal: resources.metal,
            crystal: resources.crystal,
            deuterium: resources.deuterium,
            from: origin,
            to: destination,
            nShips: parseInt(fleetRow.querySelector('.detailsFleet span')?.textContent.trim(), 10) || 0,
            returnMission: returnFlight,
        };

        //console.log('Mission details parsed:', entry);

        if (entry.returnMission) {
            const temp = entry.to;
            entry.to = entry.from;
            entry.from = temp;
            //console.log('Swapped from/to for return mission:', entry);
        }

        missions.push(entry);
    });

    missions = removeDuplicateMissions(missions);

    missions.forEach(function (mission) {
        _cachedInflightResources.metal += mission.metal;
        _cachedInflightResources.crystal += mission.crystal;
        _cachedInflightResources.deuterium += mission.deuterium;
    });

    //console.log('Final resources in flight:', _cachedInflightResources);
    return _cachedInflightResources;
};

// Funzione helper per estrarre risorse da un tooltip HTML
function extractResourcesFromTooltip(tooltipHTML) {
    const resources = { metal: 0, crystal: 0, deuterium: 0 };
    const parser = new DOMParser();

    // Decodifica entità HTML per trasformarle in HTML leggibile
    const decodedHTML = tooltipHTML.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

    // Parsing del contenuto HTML
    const tooltipDoc = parser.parseFromString(decodedHTML, 'text/html');

    // Estrazione delle righe che contengono le risorse
    const resourceRows = tooltipDoc.querySelectorAll('tr');

    resourceRows.forEach((row) => {
        const labelCell = row.querySelector('td[colspan="2"]');
        const valueCell = row.querySelector('.value');

        if (labelCell && valueCell) {
            const resourceName = labelCell.textContent.trim().toLowerCase();
            const resourceValue = parseInt(valueCell.textContent.replace(/\./g, ''), 10) || 0;

            // Associa i valori estratti al tipo di risorsa
            if (resourceName.includes('metallo')) {
                resources.metal = resourceValue;
            } else if (resourceName.includes('cristallo')) {
                resources.crystal = resourceValue;
            } else if (resourceName.includes('deuterio')) {
                resources.deuterium = resourceValue;
            }
        }
    });

    //console.log('Risorse estratte:', resources);
    return resources;
}

// Funzione per rimuovere missioni duplicate o inutili
function removeDuplicateMissions(missions) {
    //console.log('Initial missions:', missions);
    missions = missions.filter(function (mission, index, self) {
        var isDuplicate = mission.returnMission && self.findIndex(m =>
            m.from === mission.to &&
            m.to === mission.from &&
            m.nShips === mission.nShips &&
            m.metal === mission.metal &&
            m.crystal === mission.crystal &&
            m.deuterium === mission.deuterium
        ) !== -1;
        if (isDuplicate) {
            //console.log('Removed duplicate mission:', mission);
        }
        return !isDuplicate;
    });

    var missionIds = missions.map(e => e.id);
    missions = missions.filter(mission => {
        if (mission.type !== 15 || mission.returnMission) {
            return true;
        }
        var hasNextMission = missionIds.indexOf(mission.id + 1) !== -1;
        if (hasNextMission) {
            //console.log('Removed unnecessary exploration mission:', mission);
        }
        return !hasNextMission;
    });

    //console.log('Filtered missions:', missions);
    return missions;
}
