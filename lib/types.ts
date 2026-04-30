export type SalesOrgCode = "IA01" | "IA02" | "BA01" | "BA02" | "PT01" | "PT02"

export type BusinessUnit = {
  code: "IA" | "BA" | "PT"
  name: string
  shortName: string
  description: string
  /** chart-1 / chart-2 / chart-3 token used for color */
  colorToken: "chart-1" | "chart-2" | "chart-3"
}

export type SalesOrg = {
  code: SalesOrgCode
  name: string
  businessUnit: BusinessUnit["code"]
  currency: "USD" | "EUR" | "GBP" | "SGD"
  distributionChannel: string
  division: string
  erp: "SAP BRP900 (ECC)" | "SAP CIP300" | "SAP S/4HANA"
  cpq: "Salesforce CPQ" | "SAP CPQ"
  region: "North America" | "EMEA" | "APAC" | "LATAM" | "Global"
}

export type Address = {
  id: string
  name: string
  line1: string
  city: string
  state: string
  country: string
  postal: string
}

export type SoldTo = {
  id: string
  name: string
  /** Sales orgs this sold-to is extended to */
  salesOrgs: SalesOrgCode[]
  /** Default sales org used to seed the storefront context */
  defaultSalesOrg: SalesOrgCode
  shipTos: Address[]
  paymentTerms: string
}

export type Customer = {
  id: string
  name: string
  email: string
  company: string
  persona: "Buyer" | "Approver" | "Admin"
  soldTos: SoldTo[]
}

export type Product = {
  id: string
  sku: string
  name: string
  shortDescription: string
  description: string
  category: string
  /** lucide-react icon name to use as visual */
  icon:
    | "Cpu"
    | "Gauge"
    | "Thermometer"
    | "Wind"
    | "Zap"
    | "Radio"
    | "Wrench"
    | "Boxes"
    | "Activity"
    | "ShieldCheck"
    | "Flame"
    | "Droplets"
  /** Which sales orgs offer this material (a material can be extended to multiple) */
  availability: {
    salesOrg: SalesOrgCode
    listPrice: number
    leadTimeDays: number
    inStock: boolean
    minOrderQty: number
  }[]
  type: "Standard" | "Configurable" | "Service" | "Software" | "Hardware"
  tags: string[]
}

export type CartLine = {
  productId: string
  sku: string
  name: string
  qty: number
  unitPrice: number
  icon: Product["icon"]
}

export type CartGroup = {
  /** A separate cart per sales org -> "split cart" */
  salesOrg: SalesOrgCode
  lines: CartLine[]
  poNumber?: string
  notes?: string
}

export type SavedCart = {
  id: string
  name: string
  createdAt: string
  groups: CartGroup[]
}

export type OrderStatus =
  | "Pending"
  | "Approved"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"

export type Order = {
  id: string
  orderNumber: string
  poNumber: string
  soldToId: string
  shipToId: string
  salesOrg: SalesOrgCode
  status: OrderStatus
  placedAt: string
  total: number
  currency: SalesOrg["currency"]
  lines: {
    sku: string
    name: string
    qty: number
    unitPrice: number
    lineTotal: number
    status: OrderStatus
  }[]
}

export type QuoteStatus =
  | "Draft"
  | "Submitted"
  | "In Approval"
  | "Approved"
  | "Customer Acceptance"
  | "Won"
  | "Expired"
  | "Rejected"

export type Quote = {
  id: string
  quoteNumber: string
  opportunityId: string
  soldToId: string
  salesOrg: SalesOrgCode
  status: QuoteStatus
  createdAt: string
  expiresAt: string
  approver: "Salesforce CPQ" | "SAP CPQ"
  total: number
  discountPct: number
  currency: SalesOrg["currency"]
  lines: {
    sku: string
    name: string
    qty: number
    listPrice: number
    discountPct: number
    netPrice: number
  }[]
}
