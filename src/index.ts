import { aggregateByYear, Year, YearlyCapitalGains } from './aggregations'
import { calculateFIFOCapitalGains, CapitalGains } from './capital-gains'
import { calculateSalesForNetWithdrawal, NetSalesOptions } from './net-sales'
import { Operation } from './types'

export {
  calculateFIFOCapitalGains,
  aggregateByYear,
  calculateSalesForNetWithdrawal,
  CapitalGains,
  Year,
  YearlyCapitalGains,
  NetSalesOptions,
  Operation,
}
