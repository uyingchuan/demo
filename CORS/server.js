const http = require('http')
const PORT = 3011
const corsMiddleware = require('cors')({
    origin: 'http://127.0.0.1:3010',
    methods: 'PUT, DELETE',
    maxAge: 1278000,
    credentials: true
})

// http.createServer((req, res) => {
//     const url = req.url
//     console.log('request url: ', url)

//     res.writeHead(200, {
//         'Access-control-Allow-Origin': 'http://127.0.0.1:3010',
//         'Access-control-Allow-Credentials': true,
//         'Access-control-Allow-Headers': 'Test-CORS, Content-Type',
//         'Access-control-Allow-Methods': 'PUT, DELETE',
//         'Access-control-Max-Age': 86400
//     })

//     if (url === '/api/data') {
//         return res.end('ok!')
//     }
//     if (url === '/script') {
//         return res.end('console.log("hello world!");')
//     }
// }).listen(PORT)

// 使用node的 cors 模块
http.createServer((req, res) => {
    const { url, method } = req
    const nextFn = () => {
        if (method === 'PUT' && url === '/api/data') {
            return res.end('ok!')
        }
        return res.end()
    }

    console.log('request url: ', url, ', request method: ', method)

    corsMiddleware(req, res, nextFn)
}).listen(PORT)

console.log('Server listening on port ', PORT)