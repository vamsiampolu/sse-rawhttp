const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  let index = './sse.htm'
  let filename, interval
  console.log('URL:', req.url)
  if (req.url === '/') {
    filename = index
  } else {
    filename = './' + req.url.slice(1)
  }

  switch (filename) {
    case './stream': {
      console.log('Responding with event stream')
      const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
      res.writeHead(200, headers)
      res.write('retry: 10000\n')
      res.write('event: connecttime\n')
      res.write('data: ' + (new Date()) + '\n\n')
      res.write('data: ' + (new Date()) + '\n\n')
      interval = setInterval(() => {
        res.write('data: ' + (new Date()) + '\n\n')
      }, 1000)
      req.connection.addListener('close', function () {
        clearInterval(interval, 1000)
      }, false)
      break
    }
    case index: {
      fs.exists(filename, (exists) => {
        fs.readFile(filename, function (error, content) {
          if (error) {
            res.writeHead(500)
            res.end()
          } else {
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.end(content, 'utf-8')
          }
        })
      })
      break
    }
    default: {
      res.writeHead(404)
      res.end()
    }
  }
}).listen(4000, '127.0.0.1')
console.log('Server running at http://127.0.0.1:4000/')
