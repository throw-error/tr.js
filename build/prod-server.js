const express = require('express')
const config = require('../config')
const fs = require('fs')
const opn = require('opn')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
const app = express()

// 使用中间件创建静态文件访问
app.use('/js', express.static('./dev/js'))

app.use('/errend.js', function (req, res) {
	res.sendfile('./dist/errend.js')
})

let htmlStr = null
fs.readFile('./dev/index.html', (err, file) => {
	htmlStr = file.toString().replace('</title>', `</title>
	<script src="errend.js"></script>`)
})

app.use('/', function (req, res) {
	res.send(htmlStr)
})

fs.exists('dist/errend.js', function (dist) {
  if (!dist) return console.error('还没有编译输出!')
  fs.exists('dev/index.html', function (dist) {
  	if (!dist) return console.error('缺少主页文件!')
  	app.listen(port, function (err) {
	    if (err) return console.error(err)
	    console.log('Listening at http://localhost:' + port + '\n')
	  	opn(`http://localhost:${port}`)
	  })
  })
})
