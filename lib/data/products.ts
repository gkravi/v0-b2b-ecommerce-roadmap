import type { Product } from "@/lib/types"

export const products: Product[] = [
  // ---------- IA: Industrial Automation ----------
  {
    id: "p-ia-01",
    sku: "IA-EXP-C300-PM",
    name: "Experion C300 Process Controller",
    shortDescription: "Redundant process controller for distributed control systems.",
    description:
      "High-performance, redundant process controller engineered for Experion PKS deployments. Supports advanced regulatory and logic strategies with deterministic execution and on-process migration.",
    category: "Process Controllers",
    icon: "Cpu",
    type: "Hardware",
    tags: ["DCS", "Experion", "Redundant"],
    availability: [
      { salesOrg: "IA01", listPrice: 12450, leadTimeDays: 21, inStock: true, minOrderQty: 1 },
      { salesOrg: "IA02", listPrice: 11680, leadTimeDays: 28, inStock: true, minOrderQty: 1 },
      { salesOrg: "PT01", listPrice: 12990, leadTimeDays: 28, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ia-02",
    sku: "IA-SMV-800",
    name: "SmartLine Multivariable Transmitter",
    shortDescription: "Pressure, DP and temperature in a single transmitter.",
    description:
      "Multivariable smart transmitter measuring differential pressure, static pressure and process temperature with HART and FOUNDATION Fieldbus protocols.",
    category: "Field Instruments",
    icon: "Gauge",
    type: "Standard",
    tags: ["HART", "Field Instrument"],
    availability: [
      { salesOrg: "IA01", listPrice: 3210, leadTimeDays: 10, inStock: true, minOrderQty: 1 },
      { salesOrg: "IA02", listPrice: 3050, leadTimeDays: 14, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ia-03",
    sku: "IA-RAD-VBR-500",
    name: "Vibration Monitoring Sensor 500",
    shortDescription: "Wireless triaxial vibration sensor for rotating equipment.",
    description:
      "Battery-powered wireless triaxial vibration and temperature sensor for predictive maintenance of pumps, compressors and motors.",
    category: "Asset Monitoring",
    icon: "Activity",
    type: "Standard",
    tags: ["Wireless", "Predictive Maintenance"],
    availability: [
      { salesOrg: "IA01", listPrice: 1180, leadTimeDays: 7, inStock: true, minOrderQty: 5 },
      { salesOrg: "IA02", listPrice: 1110, leadTimeDays: 10, inStock: true, minOrderQty: 5 },
    ],
  },
  {
    id: "p-ia-04",
    sku: "IA-SW-FORGE-OPS",
    name: "Forge for Industrial Performance",
    shortDescription: "Operations performance software with cloud analytics.",
    description:
      "Subscription analytics software unifying historian, alarm and KPI data across plants for performance management.",
    category: "Industrial Software",
    icon: "Zap",
    type: "Software",
    tags: ["SaaS", "Subscription"],
    availability: [
      { salesOrg: "IA01", listPrice: 48000, leadTimeDays: 1, inStock: true, minOrderQty: 1 },
      { salesOrg: "IA02", listPrice: 45200, leadTimeDays: 1, inStock: true, minOrderQty: 1 },
      { salesOrg: "PT01", listPrice: 52000, leadTimeDays: 1, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ia-05",
    sku: "IA-SVC-COMM",
    name: "Commissioning Services - On-site",
    shortDescription: "Field commissioning services for DCS migrations.",
    description:
      "Engineering and commissioning services for control system migrations, including loop checking, FAT/SAT support and operator training.",
    category: "Services",
    icon: "Wrench",
    type: "Service",
    tags: ["Service", "Engineering"],
    availability: [
      { salesOrg: "IA01", listPrice: 1850, leadTimeDays: 14, inStock: true, minOrderQty: 1 },
      { salesOrg: "IA02", listPrice: 1740, leadTimeDays: 14, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ia-06",
    sku: "IA-RTU-2020-LX",
    name: "RTU 2020 LX Remote Terminal Unit",
    shortDescription: "Linux-based RTU for SCADA at unmanned sites.",
    description:
      "Hardened Linux RTU for oil & gas, water and pipeline SCADA. Cellular, Ethernet and serial connectivity with edge computing.",
    category: "SCADA",
    icon: "Radio",
    type: "Hardware",
    tags: ["SCADA", "Edge"],
    availability: [
      { salesOrg: "IA01", listPrice: 4120, leadTimeDays: 14, inStock: true, minOrderQty: 1 },
      { salesOrg: "IA02", listPrice: 3920, leadTimeDays: 21, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ia-07",
    sku: "IA-FLW-CORIO-G3",
    name: "Coriolis Flowmeter G3",
    shortDescription: "High-accuracy mass flow meter for custody transfer.",
    description:
      "Coriolis mass flowmeter delivering 0.05% accuracy for custody transfer applications across hydrocarbons and chemicals.",
    category: "Field Instruments",
    icon: "Gauge",
    type: "Standard",
    tags: ["Custody Transfer", "Flow"],
    availability: [
      { salesOrg: "IA01", listPrice: 8950, leadTimeDays: 28, inStock: true, minOrderQty: 1 },
      { salesOrg: "IA02", listPrice: 8340, leadTimeDays: 35, inStock: true, minOrderQty: 1 },
    ],
  },

  // ---------- BA: Building Automation ----------
  {
    id: "p-ba-01",
    sku: "BA-TST-T7-PRO",
    name: "T7 Pro Commercial Thermostat",
    shortDescription: "Programmable BACnet thermostat for commercial HVAC.",
    description:
      "Smart commercial thermostat with BACnet/IP, occupancy sensing and remote management via Niagara framework.",
    category: "HVAC Controls",
    icon: "Thermometer",
    type: "Standard",
    tags: ["BACnet", "HVAC"],
    availability: [
      { salesOrg: "BA01", listPrice: 320, leadTimeDays: 5, inStock: true, minOrderQty: 1 },
      { salesOrg: "BA02", listPrice: 305, leadTimeDays: 7, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ba-02",
    sku: "BA-VAV-CTRL-V8",
    name: "VAV Controller V8",
    shortDescription: "Variable air volume box controller with pressure sensor.",
    description:
      "DDC controller for VAV boxes with integrated differential pressure sensor and BACnet MS/TP communication.",
    category: "HVAC Controls",
    icon: "Wind",
    type: "Standard",
    tags: ["BACnet", "VAV"],
    availability: [
      { salesOrg: "BA01", listPrice: 540, leadTimeDays: 5, inStock: true, minOrderQty: 4 },
      { salesOrg: "BA02", listPrice: 510, leadTimeDays: 7, inStock: true, minOrderQty: 4 },
    ],
  },
  {
    id: "p-ba-03",
    sku: "BA-FIRE-NFXI-3030",
    name: "NFXI Fire Alarm Panel",
    shortDescription: "Intelligent addressable fire alarm control panel.",
    description:
      "UL-listed addressable fire alarm panel supporting up to 318 devices, voice evacuation and network configurations.",
    category: "Life Safety",
    icon: "Flame",
    type: "Hardware",
    tags: ["Fire", "Life Safety"],
    availability: [
      { salesOrg: "BA01", listPrice: 4850, leadTimeDays: 14, inStock: true, minOrderQty: 1 },
      { salesOrg: "BA02", listPrice: 4620, leadTimeDays: 21, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ba-04",
    sku: "BA-SW-NIAGARA-N4",
    name: "Niagara N4 Supervisor License",
    shortDescription: "Building management supervisor software license.",
    description:
      "Open framework supervisor license for integrating mechanical, electrical and life-safety systems across a building portfolio.",
    category: "Building Software",
    icon: "Boxes",
    type: "Software",
    tags: ["Niagara", "BMS"],
    availability: [
      { salesOrg: "BA01", listPrice: 6900, leadTimeDays: 1, inStock: true, minOrderQty: 1 },
      { salesOrg: "BA02", listPrice: 6480, leadTimeDays: 1, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ba-05",
    sku: "BA-SEC-PROWATCH",
    name: "Pro-Watch Access Controller",
    shortDescription: "Enterprise access control panel, 4 readers.",
    description:
      "IP-based access control panel supporting up to 4 readers, integrates with Pro-Watch enterprise security platform.",
    category: "Security",
    icon: "ShieldCheck",
    type: "Hardware",
    tags: ["Access Control", "Security"],
    availability: [
      { salesOrg: "BA01", listPrice: 1620, leadTimeDays: 7, inStock: true, minOrderQty: 1 },
      { salesOrg: "BA02", listPrice: 1540, leadTimeDays: 10, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-ba-06",
    sku: "BA-SEN-CO2-W900",
    name: "CO2 / Occupancy Sensor W900",
    shortDescription: "Wall-mount IAQ sensor for demand-controlled ventilation.",
    description:
      "Indoor air quality sensor measuring CO2, temperature, humidity and occupancy with BACnet output for DCV strategies.",
    category: "HVAC Controls",
    icon: "Activity",
    type: "Standard",
    tags: ["IAQ", "BACnet"],
    availability: [
      { salesOrg: "BA01", listPrice: 410, leadTimeDays: 5, inStock: true, minOrderQty: 4 },
      { salesOrg: "BA02", listPrice: 390, leadTimeDays: 7, inStock: true, minOrderQty: 4 },
    ],
  },
  {
    id: "p-ba-07",
    sku: "BA-SVC-COMM-BMS",
    name: "BMS Commissioning Package",
    shortDescription: "Building management system commissioning services.",
    description:
      "Field commissioning services for BMS deployments including point-to-point checkout, sequence verification and turnover documentation.",
    category: "Services",
    icon: "Wrench",
    type: "Service",
    tags: ["Service", "Commissioning"],
    availability: [
      { salesOrg: "BA01", listPrice: 1450, leadTimeDays: 10, inStock: true, minOrderQty: 1 },
      { salesOrg: "BA02", listPrice: 1380, leadTimeDays: 14, inStock: true, minOrderQty: 1 },
    ],
  },

  // ---------- PT: Process Technology ----------
  {
    id: "p-pt-01",
    sku: "PT-CAT-RFG-X12",
    name: "Refining Catalyst X12 (per kg)",
    shortDescription: "FCC catalyst for residue upgrading.",
    description:
      "Fluid catalytic cracking catalyst optimized for high residue feeds, improving propylene yield and bottoms upgrading.",
    category: "Catalysts",
    icon: "Droplets",
    type: "Standard",
    tags: ["FCC", "Refining"],
    availability: [
      { salesOrg: "PT01", listPrice: 38, leadTimeDays: 30, inStock: true, minOrderQty: 1000 },
      { salesOrg: "PT02", listPrice: 41, leadTimeDays: 45, inStock: true, minOrderQty: 1000 },
    ],
  },
  {
    id: "p-pt-02",
    sku: "PT-ADS-MOLSV-13X",
    name: "Molecular Sieve 13X (drum)",
    shortDescription: "Adsorbent for gas dehydration and CO2 removal.",
    description:
      "High-capacity 13X molecular sieve adsorbent for natural gas dehydration, CO2 removal and air pre-purification units.",
    category: "Adsorbents",
    icon: "Boxes",
    type: "Standard",
    tags: ["Adsorbent", "Gas Treatment"],
    availability: [
      { salesOrg: "PT01", listPrice: 920, leadTimeDays: 21, inStock: true, minOrderQty: 4 },
      { salesOrg: "PT02", listPrice: 980, leadTimeDays: 28, inStock: true, minOrderQty: 4 },
    ],
  },
  {
    id: "p-pt-03",
    sku: "PT-SVC-LICENSE-CCR",
    name: "CCR Platforming Process License",
    shortDescription: "Process license + basic engineering package.",
    description:
      "Continuous catalyst regeneration platforming process license including basic engineering design package, training and start-up support.",
    category: "Process Licensing",
    icon: "Radio",
    type: "Service",
    tags: ["License", "Engineering"],
    availability: [
      { salesOrg: "PT01", listPrice: 1250000, leadTimeDays: 90, inStock: true, minOrderQty: 1 },
      { salesOrg: "PT02", listPrice: 1320000, leadTimeDays: 90, inStock: true, minOrderQty: 1 },
    ],
  },
  {
    id: "p-pt-04",
    sku: "PT-CAT-HYDRO-Z9",
    name: "Hydrocracking Catalyst Z9 (per kg)",
    shortDescription: "Hydrocracking catalyst for distillate maximization.",
    description:
      "High-activity hydrocracking catalyst optimized for distillate maximization with extended cycle length and low hydrogen consumption.",
    category: "Catalysts",
    icon: "Droplets",
    type: "Standard",
    tags: ["Hydrocracking", "Refining"],
    availability: [
      { salesOrg: "PT01", listPrice: 62, leadTimeDays: 45, inStock: true, minOrderQty: 2000 },
      { salesOrg: "PT02", listPrice: 67, leadTimeDays: 60, inStock: true, minOrderQty: 2000 },
    ],
  },
  {
    id: "p-pt-05",
    sku: "PT-SW-UNISIM-DESIGN",
    name: "UniSim Design Suite License",
    shortDescription: "Process simulation software for refining and chemicals.",
    description:
      "Steady-state and dynamic process simulation software for refining, gas processing and petrochemicals engineering workflows.",
    category: "Process Software",
    icon: "Zap",
    type: "Software",
    tags: ["Simulation", "License"],
    availability: [
      { salesOrg: "PT01", listPrice: 28500, leadTimeDays: 1, inStock: true, minOrderQty: 1 },
      { salesOrg: "PT02", listPrice: 30200, leadTimeDays: 1, inStock: true, minOrderQty: 1 },
    ],
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export function getProductBySku(sku: string) {
  return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase())
}
