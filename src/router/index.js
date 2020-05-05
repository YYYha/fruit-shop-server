const Router = require('koa-router')
const db = require('../../libs/database/index')
const router = new Router()
const Ctypto = require('../../libs/md5/index')
const getCode = require('../../libs/email_config/index')
const Jwt = require('../../libs/token/index')

router.get('/', async ctx => {
    let data = await db.query('select * from test')
    data[0].content = data[0].content.split(',')
    ctx.body = data
})

router.get('/haha', ctx => {
    ctx.body = 'haha'
})
// 登录
router.post('/login', async ctx => {
    let data = ctx.request.fields
    let result = await db.query(`select password from user where username = '${data.username}' `)
    if (result.length === 0) {
        ctx.body = {
            code: 1,
            msg: '登录失败，用户名不存在'
        }
        return
    }
    // 加密
    let crypto = new Ctypto(data.password)
    let md5Pass = crypto.md5()
    if (md5Pass === result[0].password) {
        let jwt = new Jwt(data) // 传参类型是对象
        let token = jwt.generateToken()
        console.log(token)
        ctx.body = {
            code: 0,
            msg: '登录成功',
            token: token
        }
    } else {
        ctx.body = {
            code: 1,
            msg: '登录失败，密码错误'
        }
    }
})
// 注册
router.post('/register', async ctx => {
    let data = ctx.request.fields
    // 查找有无此用户
    let nouser = await db.query(`select username, isLive from user where username = '${data.username}'`)
    let n = JSON.parse(JSON.stringify(nouser))[0] || Array
    console.log(n)
    if (n.length !== 0) {
        if (n.username.length !== 0 && n.isLive == 'yes') {
            ctx.body = {
                code: 1,
                msg: '此用户名已被注册'
            }
            return
        }
    }


    // 验证认证码)(如果没有此人的记录，则在上面已经return出去了)
    let Confirm = await db.query(`select date, code from user where email = '${data.email}'`)
    let confirm = JSON.parse(JSON.stringify(Confirm))[0] || []
    if ((Date.now() - confirm.date) > 600000) {
        ctx.body = {
            code: 1,
            msg: '认证码已过期，请重新获取'
        }
        return
    }
    if (confirm.code !== data.vCode) {
        ctx.body = {
            code: 1,
            msg: '验证码错误，请重新输入'
        }
        return
    }
    // 加密密码
    let crypto = new Ctypto(data.password)
    let md5Pass = crypto.md5()
    let result = await db.query(`update user set username = '${data.username}',wallet = 0 ,password = '${md5Pass}', code = '', date = ${Date.now()}, isLive = 'yes' where email = '${data.email}'`)
    if (result.length !== 0) {
        ctx.body = {
            code: 0,
            msg: '注册成功'
        }
    }

})
// 获取验证码
router.post('/getCode', async ctx => {
    let data = ctx.request.fields
    let id = Math.floor(Math.random() * 10000)
    // 查找有无重复用户
    let noemail = await db.query(`select isLive, email from user where email = '${data.email}'`)
    let n = JSON.parse(JSON.stringify(noemail))[0] || []
    console.log(n)
    if (n.length !== 0) {
        if (n.email.length !== 0 && n.isLive == 'yes') {
            ctx.body = {
                code: 1,
                msg: '此邮箱已被注册'
            }
            return
        } else {
            db.query(`delete from user where email = '${data.email}'`)
        }
    }
    // 调用邮箱发送验证码
    let result = await getCode(data.email, ctx)
    if (typeof result !== 'number') {
        ctx.body = result
        return
    }
    // 将信息存入数据库中
    db.query('insert into user (id, username, email, code, date, isLive) value(?,?,?,?,?,?)', [id, data.username, data.email, result, Date.now(), 'no'])
    ctx.body = {
        code: 0,
        msg: '邮件已发送，请注意查收'
    }
})
// 商品列表
router.get('/goodslist', async ctx => {
    let result = await db.query('select * from goods')

    ctx.body = result
})
// 分类数据
router.get('/category', async ctx => {
    try {
        const data = await db.query('select * from category')
        ctx.body = data

    } catch (e) {
        ctx.body = {
            code: 1,
            msg: '数据库出错'
        }
    }
})
router.get('/categroyTow', async ctx => {
    let categoryId = ctx.request.query.categoryId
    try {
        let data = await db.query(`select * from goods where categoryId = ${categoryId}`)
        ctx.body = data
    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '数据库查询失败'
        }
    }

})
// 商品详情
router.get('/goodsDetail', async ctx => {
    let goodsId = ctx.request.query.goodsId
    try {
        let data = await db.query(`select * from goods where goodsId = ${goodsId}`)
        data[0].detail = data[0].detail.split(',')
        console.log(data[0].detail)
        ctx.body = data
    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '数据库查询失败'
        }
    }
})
// 购物车页，减少数量
router.post('/isAddNum', async ctx => {
    let isAdd = ctx.request.fields.isAdd
    let cartId = ctx.request.fields.cartId

    let result = await db.query(`select goodsNum from shoppingCart where id = ${cartId}`)
    let goodsNum = result[0].goodsNum
    try {
        if (isAdd) {
            goodsNum = goodsNum + 1
            let result = await db.query(`update shoppingCart set goodsNum = ${goodsNum} where id = ${cartId}`)
            ctx.body = {
                code: 0,
                msg: '增加成功'
            }
        } else {
            goodsNum = goodsNum - 1
            let result = await db.query(`update shoppingCart set goodsNum = ${goodsNum} where id = ${cartId}`)
            ctx.body = {
                code: 0,
                msg: '增加成功'
            }
        }

    } catch (error) {
        console.log(error)
    }

})
// 购物车
router.get('/shoppingCart', async ctx => {
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    try {
        let result = await db.query(`select id from user where username = '${user.username}'`)
        let id = result[0].id
        if (id.length === 0) return
        let cartMess = await db.query(`select * from shoppingcart left join goods on goods.goodsId = shoppingcart.goodsId where userId=${id}`)
        ctx.body = cartMess
    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '请登录'
        }
    }
})
// 购物车删除
router.get('/shoppingCartDel', async ctx => {
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id from user where username = '${user.username}'`)

    let id = result[0].id
    let goodsId = ctx.request.query.goodsId
    console.log(goodsId)
    try {
        let result = await db.query(`delete from shoppingcart where goodsId=${goodsId} and userId=${id}`)
        ctx.body = {
            code: 0,
            msg: '删除成功'
        }
    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '删除失败'
        }
    }
})
// 添加购物车
router.post('/addShoppingCart', async ctx => {
    function getId() {
        var id = Math.ceil(Math.random() * 10000)
        if (id.toString().length !== 4) {
            getId()
        } else {
            return id
        }
    }

    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id from user where username = '${user.username}'`)

    let id = getId()

    let userId = result[0].id
    let goodsId = ctx.request.fields.goodsId

    try {
        let isAdd = await db.query(`select id, goodsNum from shoppingCart where goodsId = ${goodsId} and userId = ${userId} `)
        if (isAdd.length !== 0) {
            let goodsNum = isAdd[0].goodsNum + 1
            id = isAdd[0].id
            let result = await db.query(`update shoppingCart set goodsNum = ${goodsNum} where id = ${id}`)
            if (result.length !== 0) {
                ctx.body = {
                    code: 0,
                    msg: '已添加入购物车'
                }
            }
        } else {
            try {
                let result = await db.query(`insert into shoppingcart (id, goodsId, goodsNum, userId) value (?, ?, ?, ?)`, [id, goodsId, 1, userId])
                if (result.length !== 0) {
                    ctx.body = {
                        code: 0,
                        msg: '已添加入购物车'
                    }
                }
            } catch (error) {
                console.log(error)
                ctx.body = {
                    code: 1,
                    msg: '添加失败'
                }
            }

        }
    } catch (error) {
        console.log(error)
    }
})
// 获取地址
router.get('/address', async ctx => {
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id from user where username = '${user.username}'`)
    let userId = result[0].id

    try {
        let result = await db.query(`select * from address where userId = ${userId}`)
        ctx.body = result
    } catch (error) {
        console.log(error)
    }
    console.log(userId)
})
// 修改/增加 地址
router.post('/modifyAddress', async ctx => {
    function getId() {
        var id = Math.ceil(Math.random() * 10000)
        if (id.toString().length !== 4) {
            getId()
        } else {
            return id
        }
    }
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id from user where username = '${user.username}'`)
    let userId = result[0].id
    let id = getId()

    const address = ctx.request.fields.address
    console.log(address)
    try {
        if (address.type === 0) {
            let result = await db.query(`update address set receiver = '${address.receiver}', phone=${address.phone }, address='${address.address}' where userId=${userId} and id=${address.id}`)
            if (result.length !== 0) {
                ctx.body = {
                    code: 0,
                    msg: '地址修改成功'
                }
            }
        } else if (address.type === 1) {
            let result = await db.query(`insert into address (id, receiver, phone, address, userId) value(?, ?, ?, ?, ?)`, [id, address.receiver, address.phone, address.address, userId])
            if (result.length !== 0) {
                ctx.body = {
                    code: 0,
                    msg: '地址添加成功'
                }
            }
        }
    } catch (error) {
        console.log(error)
        ctx.body = {
            code: 1,
            msg: '地址添加失败'
        }
    }
})
// 删除address
router.get('/delAddress', async ctx => {
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id from user where username = '${user.username}'`)

    let userId = result[0].id
    let id = ctx.request.query.id
    try {
        let result = await db.query(`delete from address where id=${id} and userId=${userId}`)
        if (result.length !== 0) {
            ctx.body = {
                code: 0,
                msg: '地址删除成功'
            }
        }
    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '地址删除失败'
        }
    }
})
//修改密码
router.post('/modifyPass', async ctx => {
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id, password from user where username = '${user.username}'`)

    let userId = result[0].id
    let password = result[0].password

    let pass = ctx.request.fields.password
    // 加密
    let oldPassCrypto = new Ctypto(pass.oldPass)
    let oldPass = oldPassCrypto.md5()
    let newPassCrypto = new Ctypto(pass.newPass)
    let newPass = newPassCrypto.md5()
    console.log('1')
    if (oldPass !== password) {
        ctx.body = {
            code: 0,
            msg: '请输入正确的密码'
        }
        return
    }
    try {
        let result = await db.query(`update user set password = '${newPass}' where id = ${userId} and password = '${oldPass}'`)
        if (result.changedRows === 1) {
            ctx.body = {
                code: 0,
                msg: '修改密码成功'
            }
            return
        }
        ctx.body = {
            code: 0,
            msg: '新密码与原密码一致'
        }
    } catch (error) {
        console.log(error)
    }
})
//搜索
router.get('/search', async ctx => {
    let content = ctx.request.query.content

    try {
        let result = await db.query(`select * from goods where goodsName like '%${content}%'`)
        ctx.body = result
    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '查找失败'
        }
    }
})
// 获取评论列表
router.get('/comment', async ctx => {
    let goodsId = ctx.request.query.goodsId

    try {
        let result = await db.query(`select * from comment where goodsId=${goodsId}`)
        console.log(result)
        ctx.body = result
    } catch (error) {
        console.log(error)
    }
})
// 添加评论
router.post('/comment', async ctx => {
    function getId() {
        var id = Math.ceil(Math.random() * 10000)
        if (id.toString().length !== 4) {
            getId()
        } else {
            return id
        }
    }
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id, username from user where username = '${user.username}'`)

    let id = getId()
    let username = result[0].username
    let {
        content,
        goodsId
    } = ctx.request.fields
    try {
        let result = await db.query(`insert into comment (id, content, time, goodsId, username) value(?, ?, ?, ?, ?)`,
            [id, content, new Date(), goodsId, username])
        ctx.body = {
            code: 0,
            msg: '评论成功'
        }
    } catch (error) {
        console.log(error)
        ctx.body = {
            code: 1,
            msg: '评论失败'
        }
    }
})
// 获取用户信息
router.get('/getuserinfo', async ctx => {
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select * from user where username = '${user.username}'`)
    ctx.body = result

})

// 获取订单数据
router.get('/orders', async ctx => {
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id, password from user where username = '${user.username}'`)

    let userId = result[0].id

    try {
        let result = await db.query(`select * from orders where userId = ${userId}`)
        let order = JSON.parse(JSON.stringify(result)) || Array
        if (order.length === 0) {
            ctx.body = {
                code: 0,
                msg: '暂无订单数据'
            }
            return
        }
        // order.forEach(async item=>{
        //     let result = await db.query(`select * from order_item where categoryId = ${item.categoryId}`) 
        //     let orderItems = JSON.parse(JSON.stringify(result)) || []
        //     item.children = orderItems 
        // })
        // let cateArr = []
        // order.forEach(item=>(
        //     cateArr.push(item.categoryId)
        // ))
        // let o_item = []
        // cateArr.forEach(async item=>{
        //     let result = await db.query(`select * from order_item where categoryId = ${item}`)
        //     o_item = JSON.parse(JSON.stringify(result)) || []
        // })
        for (var i = 0; i < order.length; i++) {
            let result = await db.query(`select * from order_item where categoryId = ${order[i].categoryId}`)
            let o_item = JSON.parse(JSON.stringify(result))
            order[i].children = o_item
            ctx.body = order
        }
        for (var i = 0; i < order.length; i++) {
            let result = await db.query(`select * from address where id = ${order[i].addressId}`)
            let address = JSON.parse(JSON.stringify(result))[0]
            order[i].address = address
            ctx.body = order
        }

    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '获取订单列表失败'
        }
        console.log(error)
    }
})
// 添加订单
router.post('/addOrder', async ctx => {
    function getId() {
        var id = Math.ceil(Math.random() * 10000)
        if (id.toString().length !== 4) {
            getId()
        } else {
            return id
        }
    }



    let id = getId()
    let token = ctx.request.header.authorization
    let jwt = new Jwt(token)
    let user = await jwt.verifyToken()
    let result = await db.query(`select id, wallet, password from user where username = '${user.username}'`)

    let userId = result[0].id
    let wallet = result[0].wallet
    let {
        goodsList,
        address,
        totalMoney,
        password
    } = ctx.request.fields
    // 加密
    let crypto = new Ctypto(password)
    let pass = crypto.md5()

    if (pass !== result[0].password) {
        ctx.body = {
            code: 1,
            msg: '支付密码错误'
        }
        return
    }

    if (wallet < totalMoney) {
        ctx.body = {
            code: 1,
            msg: '余额不足'
        }
        return
    }

    try {
        let result = await db.query(`insert into orders (id, categoryId, addressId, createTime, userId, count) value(?, ?, ?, ?, ?, ?)`,
            [id, id + 9, address.id, new Date(), userId, totalMoney])
        for (var i = 0; i < goodsList.length; i++) {
            let addResult = await db.query(`insert into order_item (goodsId, id, goodsName, goodsPrice, image, totalMoney, categoryId, goodsNum, goodsDes) value(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id + i, goodsList[i].goodsId, goodsList[i].goodsName, goodsList[i].goodsPrice, goodsList[i].image, goodsList[i].goodsNum * goodsList[i].goodsPrice, id + 9, goodsList[i].goodsNum, goodsList[i].goodsDes])
            // 清空购物车
            let delResult = await db.query(`delete from shoppingcart where goodsId = ${goodsList[i].goodsId} `)
        }
        await db.query(`update user set wallet = ${wallet - totalMoney} where id=${userId}`)
        ctx.body = {
            code: 0,
            msg: '购买成功'
        }

    } catch (error) {
        ctx.body = {
            code: 1,
            msg: '购买失败'
        }
        console.log(error)
    }
})







module.exports = router.routes()