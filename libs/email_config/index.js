const nodemailer = require('nodemailer')
const db = require('../../libs/database/index')

const config = {
    host: 'smtp.qq.com',
    port: 465,
    secureConnection: true, // use SSL 
    secure: true,
    auth: {
        user: '1312555615@qq.com',
        pass: 'slacvojdweyxichc'
    },
    tls: { // 解决unable to verify the first certificate
        rejectUnauthorized: false
    }
}
// 创建SMTP连接池
const transporter = nodemailer.createTransport(config)
module.exports = async function (email) {
    let code = Math.floor(Math.random() * 1000000)
    let mail = {
        from: '1312555615@qq.com',
        to: email,
        subject: '水果商城',
        text: `你本次的注册的验证码为:${code}，你正在注册水果商城账号，此验证码10分钟内有效。`
    }
    try {
        let info = await transporter.sendMail(mail)
        if (info.accepted[0] === email) {
            return code
        }
    } catch (error) {
        return {
            code: 1,
            msg: '请输入正确的邮箱'
        }
    }
}