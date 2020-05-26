import { Operation } from '..'
import { calculateFIFOCapitalGains } from '../capital-gains'

describe('calculateFIFOCapitalGains', () => {
  it('calculates FIFO capital gains with one symbol', () => {
    const operationHistory: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2020-02-01'),
        price: 150,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 15,
        date: new Date('2020-03-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
    ]

    const capitalGains = calculateFIFOCapitalGains(operationHistory)

    expect(capitalGains).toEqual([
      {
        sale: {
          amount: 15,
          date: new Date('2020-03-01'),
          price: 200,
          symbol: 'STK1',
          type: 'SELL',
        },
        capitalGains: 1250,
      },
    ])
  })

  it('calculates FIFO capital gains with multiple symbols', () => {
    const operationHistory: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2020-02-01'),
        price: 150,
        symbol: 'STK2',
        type: 'BUY',
      },
      {
        amount: 5,
        date: new Date('2020-03-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
      {
        amount: 10,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK2',
        type: 'SELL',
      },
    ]

    const capitalGains = calculateFIFOCapitalGains(operationHistory)

    expect(capitalGains).toEqual([
      {
        sale: {
          amount: 5,
          date: new Date('2020-03-01'),
          price: 200,
          symbol: 'STK1',
          type: 'SELL',
        },
        capitalGains: 500,
      },
      {
        sale: {
          amount: 10,
          date: new Date('2021-01-01'),
          price: 200,
          symbol: 'STK2',
          type: 'SELL',
        },
        capitalGains: 500,
      },
    ])
  })

  it('calculates FIFO capital gains with intercalated buys and sales', () => {
    const operationHistory: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2020-02-01'),
        price: 150,
        symbol: 'STK2',
        type: 'BUY',
      },
      {
        amount: 5,
        date: new Date('2020-03-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
      {
        amount: 10,
        date: new Date('2020-04-01'),
        price: 250,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK2',
        type: 'SELL',
      },
      {
        amount: 15,
        date: new Date('2022-01-01'),
        price: 300,
        symbol: 'STK1',
        type: 'SELL',
      },
    ]

    const capitalGains = calculateFIFOCapitalGains(operationHistory)

    expect(capitalGains).toEqual([
      {
        sale: {
          amount: 5,
          date: new Date('2020-03-01'),
          price: 200,
          symbol: 'STK1',
          type: 'SELL',
        },
        capitalGains: 500,
      },
      {
        sale: {
          amount: 10,
          date: new Date('2021-01-01'),
          price: 200,
          symbol: 'STK2',
          type: 'SELL',
        },
        capitalGains: 500,
      },
      {
        sale: {
          amount: 15,
          date: new Date('2022-01-01'),
          price: 300,
          symbol: 'STK1',
          type: 'SELL',
        },
        capitalGains: 1500,
      },
    ])
  })

  it("throws when a symbol's sales have a bigger amount than its buys", () => {
    const operationHistory: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 15,
        date: new Date('2020-03-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
    ]

    expect(() => calculateFIFOCapitalGains(operationHistory)).toThrow()
  })

  it('throws when there are sales, but no buys', () => {
    const operationHistory: Operation[] = [
      {
        amount: 15,
        date: new Date('2020-03-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
    ]

    expect(() => calculateFIFOCapitalGains(operationHistory)).toThrow()
  })
})
