const crypto= require('crypto');

const hashed= (token)=>{

return crypto.createHash('sha256').update(token).digest('hex');

}

module.exports =hashed