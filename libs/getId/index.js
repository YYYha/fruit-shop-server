function getId(le){
    var r = Math.random()
    r = r.toString().substr(2, le)
    return r
}
module.exports =  {getId}