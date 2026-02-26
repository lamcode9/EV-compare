const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '127.0.0.1'
const port = process.env.PORT || 9000

// Disable file watching to avoid EMFILE errors
process.env.WATCHPACK_POLLING = 'true'
const app = next({ dev, webpack: (config) => {
  config.watchOptions = {
    poll: 1000,
    aggregateTimeout: 300,
  }
  return config
}})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})

