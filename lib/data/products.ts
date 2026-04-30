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
    ],
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export function getProductBySku(sku: string) {
  return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase())
}
