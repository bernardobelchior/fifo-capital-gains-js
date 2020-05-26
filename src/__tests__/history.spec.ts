import { Operation } from '..'
import { consolidateHistory } from '../history'

describe('consolidateHistory', () => {
  it('correctly consolidates history', () => {
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
        date: new Date('2020-06-01'),
        price: 200,
        symbol: 'STK2',
        type: 'BUY',
      },
      {
        amount: 5,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK2',
        type: 'SELL',
      },
      {
        amount: 10,
        date: new Date('2021-03-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
      {
        amount: 15,
        date: new Date('2022-01-01'),
        price: 300,
        symbol: 'STK1',
        type: 'BUY',
      },
    ]

    expect(consolidateHistory(history)).toEqual([
      {
        amount: 5,
        date: new Date('2020-06-01'),
        price: 200,
        symbol: 'STK2',
        type: 'BUY',
      },
      {
        amount: 15,
        date: new Date('2022-01-01'),
        price: 300,
        symbol: 'STK1',
        type: 'BUY',
      },
    ])
  })

  it('correctly consolidates history when a sale has a higher amount than the first purchase', () => {
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
        date: new Date('2020-06-01'),
        price: 200,
        symbol: 'STK1',
        type: 'BUY',
      },
      {
        amount: 15,
        date: new Date('2021-01-01'),
        price: 200,
        symbol: 'STK1',
        type: 'SELL',
      },
    ]

    expect(consolidateHistory(history)).toEqual([
      {
        amount: 5,
        date: new Date('2020-06-01'),
        price: 200,
        symbol: 'STK1',
        type: 'BUY',
      },
    ])
  })
})
