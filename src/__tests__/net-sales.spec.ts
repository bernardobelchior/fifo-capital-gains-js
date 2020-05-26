import { Operation } from '..'
import { calculateSalesForNetWithdrawal, NetSalesOptions } from '../net-sales'

describe('calculateSalesForNetWithdrawal', () => {
  it('calculates sale correctly when there are only purchases in the history', () => {
    const history: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK1',
        type: 'BUY',
      },
    ]

    const options: NetSalesOptions = {
      netWithdrawal: 4000,
      capitalGainsTax: 0.5,
      date: new Date('2022-01-01'),
      prices: { STK1: 300 },
    }

    expect(calculateSalesForNetWithdrawal(history, options)).toEqual([
      {
        amount: 18,
        date: new Date('2022-01-01'),
        price: 300,
        symbol: 'STK1',
        type: 'SELL',
      },
    ])
  })

  it('calculates sale correctly when there are purchases and sales in the history', () => {
    const history: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 5,
        date: new Date('2020-06-01'),
        price: 100,
        symbol: 'STK1',
        type: 'SELL',
      },
      {
        amount: 10,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK1',
        type: 'BUY',
      },
    ]

    const options: NetSalesOptions = {
      netWithdrawal: 3000,
      capitalGainsTax: 0.5,
      date: new Date('2022-01-01'),
      prices: { STK1: 300 },
    }

    expect(calculateSalesForNetWithdrawal(history, options)).toEqual([
      {
        amount: 13,
        date: new Date('2022-01-01'),
        price: 300,
        symbol: 'STK1',
        type: 'SELL',
      },
    ])
  })

  it('calculates sale correctly when there are not enough buys', () => {
    const history: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
    ]

    const options: NetSalesOptions = {
      netWithdrawal: 2000,
      capitalGainsTax: 0.5,
      date: new Date('2020-03-01'),
      prices: { STK1: 200 },
    }

    expect(calculateSalesForNetWithdrawal(history, options)).toEqual([
      {
        amount: 10,
        date: new Date('2020-03-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
    ])
  })

  it('does not apply capital gains tax when there are negative capital gains', () => {
    const history: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
    ]

    const options: NetSalesOptions = {
      netWithdrawal: 400,
      capitalGainsTax: 0.5,
      date: new Date('2020-03-01'),
      prices: { STK1: 50 },
    }

    expect(calculateSalesForNetWithdrawal(history, options)).toEqual([
      {
        amount: 8,
        date: new Date('2020-03-01'),
        price: 50,
        symbol: 'STK1',
        type: 'SELL',
      },
    ])
  })

  it('calculates sales correctly when multiple symbols exist', () => {
    const history: Operation[] = [
      {
        amount: 10,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK2',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK1',
        type: 'BUY',
      },
    ]

    const options: NetSalesOptions = {
      netWithdrawal: 4000,
      capitalGainsTax: 0.5,
      date: new Date('2022-01-01'),
      prices: { STK1: 300, STK2: 600 },
    }

    expect(calculateSalesForNetWithdrawal(history, options)).toEqual([
      {
        amount: 10,
        date: new Date('2022-01-01'),
        price: 300,
        symbol: 'STK1',
        type: 'SELL',
      },
      {
        amount: 5,
        date: new Date('2022-01-01'),
        price: 600,
        symbol: 'STK2',
        type: 'SELL',
      },
    ])
  })

  it('ignores purchases that are more recent than the sale date', () => {
    const history: Operation[] = [
      {
        amount: 5,
        date: new Date('2020-01-01'),
        price: 100,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 10,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK1',
        type: 'BUY',
      },
    ]

    const options: NetSalesOptions = {
      netWithdrawal: 3000,
      capitalGainsTax: 0.5,
      date: new Date('2020-03-01'),
      prices: { STK1: 300 },
    }

    expect(calculateSalesForNetWithdrawal(history, options)).toEqual([
      {
        amount: 5,
        date: new Date('2020-03-01'),
        price: 300,
        symbol: 'STK1',
        type: 'SELL',
      },
    ])
  })
})
