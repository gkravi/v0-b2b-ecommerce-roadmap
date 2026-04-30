import type { Customer } from "@/lib/types"

export const customer: Customer = {
  id: "CUST-1",
  name: "Priya Shah",
  email: "priya.shah@acme-industries.com",
  company: "ACME Industries Holdings",
  persona: "Buyer",
  soldTos: [
    {
      id: "ST-1001",
      name: "ACME Refining - Houston Plant",
      salesOrgs: ["IA01", "PT01"],
      defaultSalesOrg: "IA01",
      paymentTerms: "Net 45",
      shipTos: [
        {
          id: "SH-1001-A",
          name: "ACME Refining - Receiving Dock A",
          line1: "1200 Bayport Blvd",
          city: "Pasadena",
          state: "TX",
          country: "USA",
          postal: "77507",
        },
        {
          id: "SH-1001-B",
          name: "ACME Refining - Control Room Annex",
          line1: "1200 Bayport Blvd, Bldg 4",
          city: "Pasadena",
          state: "TX",
          country: "USA",
          postal: "77507",
        },
      ],
    },
    {
      id: "ST-1002",
      name: "ACME Properties - Midtown Tower",
      salesOrgs: ["BA01"],
      defaultSalesOrg: "BA01",
      paymentTerms: "Net 30",
      shipTos: [
        {
          id: "SH-1002-A",
          name: "ACME Midtown Tower - Loading Bay",
          line1: "501 Madison Ave",
          city: "New York",
          state: "NY",
          country: "USA",
          postal: "10022",
        },
      ],
    },
    {
      id: "ST-1003",
      name: "ACME Industries - Enterprise Account",
      salesOrgs: ["IA01", "BA01", "PT01"],
      defaultSalesOrg: "IA01",
      paymentTerms: "Net 60",
      shipTos: [
        {
          id: "SH-1003-A",
          name: "ACME HQ - Central Receiving",
          line1: "200 Industrial Way",
          city: "Charlotte",
          state: "NC",
          country: "USA",
          postal: "28202",
        },
        {
          id: "SH-1003-B",
          name: "ACME West Campus",
          line1: "880 Tech Park Dr",
          city: "San Jose",
          state: "CA",
          country: "USA",
          postal: "95110",
        },
      ],
    },
  ],
}
