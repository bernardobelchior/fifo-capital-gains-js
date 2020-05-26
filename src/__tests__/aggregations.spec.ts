import { aggregateByYear } from '../aggregations'

describe('aggregateByYear calculates the aggregation correctly', () => {
  it('when there is only one operation', () => {
    expect(
      aggregateByYear([
        {
          sale: {
            amount: 1,
            date: new Date('2020-03-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 1250,
        },
      ])
    ).toEqual({
      2020: 1250,
    })
  })

  it('when operations span over multiple years', () => {
    expect(
      aggregateByYear([
        {
          sale: {
            amount: 1,
            date: new Date('2020-03-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 500,
        },
        {
          sale: {
            amount: 1,
            date: new Date('2021-01-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 500,
        },
        {
          sale: {
            amount: 1,
            date: new Date('2022-06-07'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 300,
        },
      ])
    ).toEqual({
      2020: 500,
      2021: 500,
      2022: 300,
    })
  })

  it('when there are multiple operations in one year', () => {
    expect(
      aggregateByYear([
        {
          sale: {
            amount: 1,
            date: new Date('2020-03-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 500,
        },
        {
          sale: {
            amount: 1,
            date: new Date('2021-01-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 500,
        },
        {
          sale: {
            amount: 1,
            date: new Date('2021-04-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 700,
        },
        {
          sale: {
            amount: 1,
            date: new Date('2022-06-07'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 300,
        },
      ])
    ).toEqual({
      2020: 500,
      2021: 1200,
      2022: 300,
    })
  })

  it('when operations have negative capital gains', () => {
    expect(
      aggregateByYear([
        {
          sale: {
            amount: 1,
            date: new Date('2020-03-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: -500,
        },
        {
          sale: {
            amount: 1,
            date: new Date('2020-06-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 300,
        },
        {
          sale: {
            amount: 1,
            date: new Date('2021-01-01'),
            price: 2000,
            symbol: 'STK1',
            type: 'SELL',
          },
          capitalGains: 500,
        },
      ])
    ).toEqual({
      2020: -200,
      2021: 500,
    })
  })
})
