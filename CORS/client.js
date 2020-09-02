const http = require('http')
const fs = require('fs')
const PORT = 3010

// 创建服务器实例
http.createServer((req, res) => {
    // 将fs读取的数据流输出到res
    fs.createReadStream('index.html').pipe(res)
}).listen(PORT)

console.log('http://127.0.0.1:3010 ')