'use strict'

const hypercore = require('hypercore')
const Bfx = require('bitfinex-api-node')
const network = require('@hyperswarm/network')

const b = new Bfx()
const ws = b.ws(2, {})

const CANDLE_KEY = 'trade:5m:tBTCUSD'

ws.on('open', () => {
  ws.subscribeCandles(CANDLE_KEY)
})

ws.onCandle({ key: CANDLE_KEY }, (data) => {
  console.log(data)
})

ws.open()
