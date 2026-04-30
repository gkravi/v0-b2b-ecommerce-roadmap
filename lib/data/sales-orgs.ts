import type { BusinessUnit, SalesOrg, SalesOrgCode } from "@/lib/types"

export const businessUnits: Record<BusinessUnit["code"], BusinessUnit> = {
  IA: {
    code: "IA",
    name: "Industrial Automation",
    shortName: "IA",
    description:
      "Process control, sensing, and automation software for refineries, chemical plants and manufacturing.",
    colorToken: "chart-1",
  },
  BA: {
    code: "BA",
    name: "Building Automation",
    shortName: "BA",
    description:
      "Smart building controls, HVAC, fire and security platforms for commercial real estate and campuses.",
    colorToken: "chart-2",
  },
  PT: {
    code: "PT",
    name: "Process Technology",
    shortName: "PT",
    description:
      "Refining, petrochemical and sustainability technology, catalysts, adsorbents and licensing.",
    colorToken: "chart-3",
  },
}

export const salesOrgs: Record<SalesOrgCode, SalesOrg> = {
  IA01: {
    code: "IA01",
    name: "Industrial Automation - North America",
    businessUnit: "IA",
    currency: "USD",
    distributionChannel: "10 - Direct",
    division: "00 - Common",
    erp: "SAP BRP900 (ECC)",
    cpq: "Salesforce CPQ",
  },
  BA01: {
    code: "BA01",
    name: "Building Automation - North America",
    businessUnit: "BA",
    currency: "USD",
    distributionChannel: "20 - Channel Partner",
    division: "00 - Common",
    erp: "SAP BRP900 (ECC)",
    cpq: "SAP CPQ",
  },
  PT01: {
    code: "PT01",
    name: "Process Technology - Global",
    businessUnit: "PT",
    currency: "USD",
    distributionChannel: "10 - Direct",
    division: "00 - Common",
    erp: "SAP CIP300",
    cpq: "Salesforce CPQ",
  },
}

export function getBU(code: SalesOrgCode): BusinessUnit {
  return businessUnits[salesOrgs[code].businessUnit]
}

export function getSalesOrg(code: SalesOrgCode): SalesOrg {
  return salesOrgs[code]
}
