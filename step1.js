'use strict'

const hypercore = require('hypercore')
const Bfx = require('bitfinex-api-node')

const b = new Bfx()
const bfx = b.rest(2)

const n = Date.now()
const until = n - (60 * 60 * 24 * 1000 * 3) // three days ago
bfx.candles({
  timeframe: '5m',
  symbol: 'tBTCUSD',
  section: 'hist',
  query: {
    start: until,
    end: n
  }
}, (err, res) => {
  if (err) console.error('ouch!', err)
  console.log(JSON.stringify(res, null, '  '))
  console.log('now:', n)
})
