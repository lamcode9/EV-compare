const fs = require('fs');
const path = require('path');

// Battery capacities in kWh based on research
const batteryCapacities = {
  // Xpeng G6 - Standard Range
  'Xpeng G6': {
    'Standard Range': 66
  },

  // GAC Aion V
  'GAC Aion V': {
    'Plus': 70,
    'Ultra': 80
  },

  // Deepal S07
  'Deepal S07': {
    'Max': 66
  },

  // Chery Omoda E5
  'Chery Omoda E5': {
    'Standard': 61,
    'Premium': 61
  },

  // Geely Geometry C
  'Geely Geometry C': {
    'Standard': 53
  },

  // Ora Good Cat
  'Ora Good Cat': {
    'Pro': 47.8,
    'Ultra': 63.1
  },

  // Neta V
  'Neta V': {
    'Lite': 38.5,
    'Smart': 38.5
  },

  // Porsche Taycan
  'Porsche Taycan': {
    'Turbo': 93.4
  },

  // Kia EV6
  'Kia EV6': {
    'Air': 77.4,
    'GT-Line': 77.4
  },

  // Volvo EX30
  'Volvo EX30': {
    'Core': 64,
    'Twin Motor': 64
  },

  // Mercedes-Benz
  'Mercedes-Benz EQA': {
    '250': 66.5
  },
  'Mercedes-Benz EQB': {
    '350 4Matic': 66.5
  },

  // Mini Cooper SE
  'Mini Cooper SE': {
    'JCW': 28.9
  },

  // Honda e:N1
  'Honda e:N1': {
    'Standard': 35.5
  },

  // Tesla Model Y
  'Tesla Model Y': {
    'RWD': 60
  },

  // DFSK Gelora E
  'DFSK Gelora E': {
    'Blind Van': 42
  },

  // Mercedes-Benz (MY)
  'Mercedes-Benz EQA': {
    '250': 66.5
  },
  'Mercedes-Benz EQB': {
    '350 4Matic': 66.5
  },

  // Tesla
  'Tesla Model Y': {
    'Long Range AWD': 75
  },

  // Denza
  'Denza D9': {
    'Ultra': 90,
    'Executive': 90
  },

  // Xpeng G9
  'Xpeng G9': {
    'Standard': 93.1,
    'Performance': 93.1,
    'Standard Range': 93.1
  },

  // BMW i4
  'BMW i4': {
    'eDrive35': 83.9,
    'M50': 83.9
  },

  // Zeekr X
  'Zeekr X': {
    'RWD': 66
  },

  // Chery Tiggo 8 Pro e+
  'Chery Tiggo 8 Pro e+': {
    'Premium': 19.27 // PHEV
  },

  // Porsche Macan Electric
  'Porsche Macan Electric': {
    '4': 95,
    'Turbo': 95
  },

  // MG ZS EV (MY)
  'MG ZS EV': {
    'Standard': 50.3,
    'Luxury': 50.3
  },

  // Ora Good Cat
  'Ora Good Cat': {
    'GT': 63.1
  },

  // Mercedes-Benz EQC
  'Mercedes-Benz EQC': {
    '400 4Matic': 85
  },

  // Hyundai Ioniq 5 (MY)
  'Hyundai Ioniq 5': {
    'Standard Range': 58,
    'Long Range': 77.4
  },

  // Kia EV6 (MY)
  'Kia EV6': {
    'Air RWD': 77.4
  },

  // Lotus Eletre
  'Lotus Eletre': {
    'S': 109
  },

  // Dongfeng Box E3
  'Dongfeng Box E3': {
    '': 50.3 // Default variant
  },

  // Honda e:N2
  'Honda e:N2': {
    'e:Type': 68.8
  },

  // Volvo XC40 Recharge
  'Volvo XC40 Recharge': {
    'Core': 75
  },

  // Smart #1
  'Smart #1': {
    'Pure': 66,
    'Brabus': 66
  },

  // iCaur 03
  'iCaur 03': {
    'Standard': 53
  },

  // Perodua EM-O
  'Perodua EM-O': {
    'Standard': 31.9
  },

  // MINI Aceman
  'MINI Aceman': {
    'Classic': 54.2
  },

  // Volvo EX90
  'Volvo EX90': {
    'Twin Motor': 111
  },

  // Geely Geometry A Pro
  'Geely Geometry A Pro': {
    '': 51.9 // Default variant
  },

  // Perodua EMO-II
  'Perodua EMO-II': {
    'Standard': 31.9
  },

  // Hyptec HT
  'Hyptec HT': {
    'Premium': 61.1
  },

  // Opel Mokka-e
  'Opel Mokka-e': {
    'Standard': 50
  },

  // Final missing vehicles - different naming patterns
  'Mercedes EQA': {
    '250': 66.5
  },
  'Mercedes EQB': {
    '350 4Matic': 66.5
  },
  'Mercedes EQC': {
    '400 4Matic': 85
  },
  'Dongfeng Box': {
    'E3': 50.3
  },
  'Geely Geometry A': {
    'Pro': 51.9
  }
};

function addBatteryCapacities() {
  const vehiclesDataPath = path.join(__dirname, '../data/vehicles-data.json');

  try {
    const fileContent = fs.readFileSync(vehiclesDataPath, 'utf-8');
    const vehicles = JSON.parse(fileContent);

    let updated = 0;

    vehicles.forEach(vehicle => {
      if (batteryCapacities[vehicle.name] && batteryCapacities[vehicle.name][vehicle.modelTrim]) {
        if (!('batteryCapacityKwh' in vehicle) || vehicle.batteryCapacityKwh === null || vehicle.batteryCapacityKwh === undefined || vehicle.batteryCapacityKwh <= 0) {
          vehicle.batteryCapacityKwh = batteryCapacities[vehicle.name][vehicle.modelTrim];
          updated++;
          console.log(`Added battery capacity ${vehicle.batteryCapacityKwh} kWh to ${vehicle.name} ${vehicle.modelTrim || ''}`);
        }
      }
    });

    // Write back to file
    fs.writeFileSync(vehiclesDataPath, JSON.stringify(vehicles, null, 2));

    console.log(`\nUpdated ${updated} vehicles with battery capacity data.`);

    // Check remaining missing
    const missing = vehicles.filter(v =>
      !('batteryCapacityKwh' in v) ||
      v.batteryCapacityKwh === null ||
      v.batteryCapacityKwh === undefined ||
      v.batteryCapacityKwh <= 0
    );

    console.log(`Still missing battery capacity: ${missing.length} vehicles`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addBatteryCapacities();
