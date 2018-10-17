'use strict'

const hypercore = require('hypercore')
const Bfx = require('bitfinex-api-node')
const network = require('@hyperswarm/network')

const b = new Bfx()
const ws = b.ws(2, {})

const feed = hypercore('./candle-5m-btcusd-dataset', { valueEncoding: 'utf-8' })
const writeStream = feed.createWriteStream()
const net = network()

const CANDLE_KEY = 'trade:5m:tBTCUSD'

ws.on('open', () => {
  ws.subscribeCandles(CANDLE_KEY)
})

ws.onCandle({ key: CANDLE_KEY }, (data) => {
  const str = JSON.stringify(data)
  writeStream.write(str)
})

feed.on('ready', () => {
  console.log('our discovery key:', feed.discoveryKey.toString('hex'))

  ws.open()
  share(feed)
})

function share (feed) {
  net.join(feed.discoveryKey, {
    lookup: true, // find & connect to peers
    announce: true // optional- announce self as a connection target
  })

  net.on('connection', (socket, details) => {
    console.log('new connection!', details)
    const readStream = feed.createReadStream({ live: true })
    readStream.pipe(socket)
  })
}
