const Koa = require('koa')
const path = require('path')
const statics = require('koa-static')
const body = require('koa-better-body')
const JwtUtil = require('./libs/token/index')
let server = new Koa()
server.listen(3000, () => {
    console.log('server running at 3000')
})
//文件获取 上传
server.use(statics(
    path.resolve(__dirname, './public')
))

// koa-better-body  为获取post数据
server.use(body({
    uploadDir: path.resolve(__dirname, './public')
}))
// 同一处理跨域
server.use(async (ctx, next) => {
    if (ctx.method == "OPTIONS") {
        ctx.body = 200
    }
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', '*')
    await next()
})
// 判断请求路径，处理token
server.use(async (ctx, next) => {
    if (ctx.request.url != '/login' && ctx.request.url != '/register' && ctx.request.url != '/getCode' && ctx.request.url != '/goodslist' && ctx.request.url != '/test') {
        let data = ctx.request.header.authorization
        let jwt = new JwtUtil(data)
        let result = jwt.verifyToken()
        if (await result) {
            await next()
        } else {
            ctx.body = {
                code: 2,
                msg: 'token无效，请重新登录'
            }
        }
    } else {
        await next()
    }
})

// 挂载路由
server.use(require('./src/router/index'))