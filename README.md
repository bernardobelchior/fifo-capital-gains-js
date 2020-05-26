# FIFO Capital Gains

> Calculate your FIFO capital gains for tax-purposes

[![Build Status](https://travis-ci.org/bernardobelchior/fifo-capital-gains-js.svg?branch=master)](https://travis-ci.org/bernardobelchior/fifo-capital-gains-js)
[![NPM version](https://img.shields.io/npm/v/fifo-capital-gains-js.svg)](https://www.npmjs.com/package/fifo-capital-gains-js)
![Downloads](https://img.shields.io/npm/dm/fifo-capital-gains-js.svg)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

---

## ✨ Features

- Generate FIFO capital gains per sale
- Ability to aggregate capital gains per civil year
- Supports differentation of securities by using a symbol (e.g., stock ticker)

## 🔧 Installation

```sh
npm install --save fifo-capital-gains-js
```

## 🎬 Getting started

Let's demonstrate a simple usage by obtaining the FIFO capital gains per civil year:

```js
const operationHistory = [
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
    amount: 8,
    date: new Date('2020-03-01'),
    price: 200,
    symbol: 'STK1',
    type: 'SELL',
  },
  {
    amount: 7,
    date: new Date('2021-01-01'),
    price: 300,
    symbol: 'STK1',
    type: 'SELL',
  },
]

const capitalGainsByYear = aggregateByYear(
  calculateFIFOCapitalGains(operationHistory)
)
// {
//   2020: 800,
//   2021: 1150,
// }
```

Now, let's say just you want the FIFO capital gains per operation, so you can execute your custom logic:

```js
const operationHistory = [
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
// [
//   {
//     sale: { <-- Operation that originated the capital gains
//       amount: 15,
//       date: new Date('2020-03-01'),
//       price: 200,
//       symbol: 'STK1',
//       type: 'SELL',
//     },
//     capitalGains: 1250, <-- Capital gains = (200-100)*10 + (200-150)*5
//   },
// ]
```

Note: When you have multiple securities, you can use the `symbol` property in operations to distinguish between them.

In case you want to aggregate the capital gains by civil year, regardless of the symbols that produced them, you can use the `aggregateByYear` function:

```js
const capitalGains = [
  {
    sale: {
      amount: 1,
      date: new Date('2020-01-01'),
      price: 1500,
      symbol: 'STK2',
      type: 'SELL',
    },
    capitalGains: 400,
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
]

const capitalGainsByYear = aggregateByYear(capitalGains)
// {
//   2020: 700,
//   2021: 500,
// }
```

## 📜 API

Operations are represented using the `Operation` object. Its composition is the following:

```ts
interface Operation {
  /**
   * Symbol that identifies the underlying security. It is used only for differentation between
   * operations of different securities. Can be the stock ticker or any other identifier that
   * is different from other securities'.
   */
  symbol: string

  /**
   * Date when the operation took place
   */
  date: Date

  /**
   * Price of the security when the operation took place.
   * If it is a buy operation, this is the buying price; if a sell operation,
   * then this is the selling price.
   */
  price: number

  /**
   * Number of units transacted.
   */
  amount: number

  /**
   * Type of the operation
   */
  type: 'BUY' | 'SELL'
}
```

Capital gains are represented using the `CapitalGains` object, which is defined as:

```ts
interface CapitalGains {
  /**
   * Sale that triggered the capital gains
   */
  sale: Operation

  /**
   * Capital gains triggered from the sale
   */
  capitalGains: number
}
```

### `calculateFIFOCapitalGains(operationHistory: Operation[]): CapitalGains[]`

This method calculates the FIFO capital gains for each sell operation in the
given operation history. It separates capital gains of securities using the symbols given
in each operation.

`operationHistory` contains the history of operations (buy and sales) to
calculate the capital gains for.

This method will throw if the amount of securities of all sell operations of a
given symbol exceeds the amount of securities of all buy operations for the same
symbol. This indicates that there is an error in the input, since it is not
possible to sell more securities than the ones bought.

**Example:**

```js
const operationHistory = [
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
// [
//   {
//     sale: { <-- Operation that originated the capital gains
//       amount: 15,
//       date: new Date('2020-03-01'),
//       price: 200,
//       symbol: 'STK1',
//       type: 'SELL',
//     },
//     capitalGains: 1250, <-- Capital gains = (200-100)*10 + (200-150)*5
//   },
// ]
```

### `aggregateByYear(saleCapitalGains: CapitalGains[]): YearlyCapitalGains`

This method aggregates the capital gains generated by a sequence of sales in
a yearly basis. It returns an object with the civil year as its key and
the capital gains generated in the given year as its value.

`saleCapitalGains` is an array of capital gains generated by sell operations.
It can be generated by calling `calculateFIFOCapitalGains` with the operation
history.

**Example:**

```js
const capitalGains = [
  {
    sale: {
      amount: 1,
      date: new Date('2020-01-01'),
      price: 1500,
      symbol: 'STK2',
      type: 'SELL',
    },
    capitalGains: 400,
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
]

const capitalGainsByYear = aggregateByYear(capitalGains)
// {
//   2020: 700,
//   2021: 500,
// }
```

### `calculateSalesForNetWithdrawal(history: Operation[], options: NetSalesOptions): Operation[]`

This method calculates the sales required to obtain a withdrawal amount set, given the history of purchases and sales and some settings.

```ts
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

const sales = calculateSalesForNetWithdrawal(history, options))
// [
//   {
//     amount: 10,
//     date: new Date('2022-01-01'),
//     price: 300,
//     symbol: 'STK1',
//     type: 'SELL',
//   },
//   {
//     amount: 5,
//     date: new Date('2022-01-01'),
//     price: 600,
//     symbol: 'STK2',
//     type: 'SELL',
//   },
// ])
```

## 🥂 License

[MIT](./LICENSE.md) as always
