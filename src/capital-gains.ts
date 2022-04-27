import { Operation } from '.'

export interface CapitalGains {
  /**
   * Sale that triggered the capital gains
   */
  sale: Operation

  /**
   * Capital gains triggered from the sale
   */
  capitalGains: number
}

/**
 * Calculates the FIFO capital gains for the given operation history.
 * It separates capital gains of securities using the symbols given
 * in each operation.
 *
 * @param operationHistory History of operations (buy and sales) to
 * calculate the capital gains for.
 *
 * @throws If the amount of securities of all sell operations of a given symbol
 * exceeds the amount of securities of all buy operations for the same symbol.
 * This indicates that there is an error in the input, since it is not possible
 * to sell more securities than the ones bought.
 *
 * @returns The FIFO capital gains for each sell operation
 */
export function calculateFIFOCapitalGains(
  operationHistory: Operation[]
): CapitalGains[] {
  const history = operationHistory.map((obj) => ({ ...obj }))
  const sales = history.filter(({ type }) => type === 'SELL')

  return sales.reduce<CapitalGains[]>(
    (capitalGains, sale) => [
      ...capitalGains,
      calculateCapitalGainsForSale(history, sale),
    ],
    []
  )
}

function calculateCapitalGainsForSale(
  operationHistory: Operation[],
  sale: Operation
): CapitalGains {
  let capitalGains = 0
  const saleCopy = { ...sale }

  operationHistory
    .filter(
      ({ type, symbol, date }) =>
        type === 'BUY' && symbol === sale.symbol && date < sale.date
    )
    .forEach((buy) => {
      const amountSold = Math.min(sale.amount, buy.amount)

      buy.amount -= amountSold
      sale.amount -= amountSold
      capitalGains += amountSold * (sale.price - buy.price)
    })

  if (Math.round(sale.amount, 4) > 0) {
    throw Error(
      `Amount of sales for symbol ${sale.symbol} exceeds the amount of buys by ${sale.amount}`
    )
  }

  return {
    capitalGains,
    sale: saleCopy,
  }
}
