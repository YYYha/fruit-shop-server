const jwt = require('jsonwebtoken')

class Jwt {
    constructor(data) {
        this.data = data
    }
    generateToken() {
        let data = this.data
        let token = jwt.sign(data, 'secret_key', {
            expiresIn: 60 * 60
        })
        return token
    }
    async verifyToken() {
        let token = this.data
        return jwt.verify(token, 'secret_key', (err, decoded) => {
            if (err) {
                return false
            } else {
                return decoded
            }
        })
    }
}
module.exports = Jwt