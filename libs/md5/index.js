const crypto = require('crypto')

class Crypto{
    constructor(str){
        this.str = str
    }
    md5(){
        let str = this.str
        return crypto.createHash('md5').update(str).digest('hex')
    }
}

module.exports = Crypto