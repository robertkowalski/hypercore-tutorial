'use strict'

const hypercore = require('hypercore')
const network = require('@hyperswarm/network')
const feed = hypercore('./candle-5m-btcusd-dataset-copy', { valueEncoding: 'utf-8' })

const KEY = process.argv[2]
console.log('connecting to', KEY)
const bKey = Buffer.from(KEY, 'hex')

const net = network()
feed.on('ready', () => {
  net.join(bKey, {
    lookup: true,
    announce: true
  })

  net.on('connection', (socket, details) => {
    socket.pipe(process.stdout)
  })
})
