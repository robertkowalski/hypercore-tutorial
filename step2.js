'use strict'

const hypercore = require('hypercore')
const Bfx = require('bitfinex-api-node')

const b = new Bfx()
const bfx = b.rest(2)

const feed = hypercore('./candle-5m-btcusd-2018-dataset', { valueEncoding: 'json' })
function sync (opts, cb = () => {}) {
  function _sync (opts, cb) {
    bfx.candles({
      timeframe: opts.timeframe,
      symbol: opts.symbol,
      section: 'hist',
      query: opts.query
    }, cb)
  }

  let lastTime = opts.query.end
  const received = (err, res) => {
    if (err) return cb(err)

    const lastElement = res[res.length - 1]
    const lastElementTime = lastElement[0]

    if (lastTime === lastElementTime) {
      opts.stream.end(cb)
      return
    }

    lastTime = lastElementTime
    opts.query.end = lastElementTime

    res.forEach((el) => {
      opts.stream.write(el)
    })

    setTimeout(() => {
      _sync(opts, received)
    }, 1000 * (87 / 60)) // rate limit
  }

  _sync(opts, received)
}

const n = Date.now()
const until = n - (60 * 60 * 24 * 1000 * 3) // three days ago

feed.on('ready', () => {
  const stream = feed.createWriteStream()
  sync({
    timeframe: '5m',
    symbol: 'tBTCUSD',
    section: 'hist',
    query: {
      start: until,
      end: n
    },
    stream: stream
  }, (err, res) => {
    if (err) return console.error('ouch!', err)
  })
})
