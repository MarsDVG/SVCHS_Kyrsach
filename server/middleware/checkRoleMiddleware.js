const jwt = require('jsonwebtoken')
module.exports = function(role) {
    return function (req,res, next){
 if(req.method === "OPTIONS"){
    next()
 }
try{
    const token = req.headers.authorization.split(' ')[1]
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbkBtYWlsLnJ1Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQ1MjMxODQ3LCJleHAiOjE3NDUzMTgyNDd9.7SwYNB-laf8RaIK8a_V4FEivBR4oFzj7lgsop78MptM"
    if(!token){
      return  res.status(401).json({message:"Not authoriz"})
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if(decoded.role !==role){
        return  res.status(403).json({message:"Not accepted"})
    }
    req.user = decoded
    next()
}catch(e){
    res.status(401).json({message:"Not authoriz"})
}

} 
}
