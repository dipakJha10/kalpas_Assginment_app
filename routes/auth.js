const router = require('express').Router();
const jwt=require('jsonwebtoken');
const authService= require('../configs/authinfo')

router.post('/login', (req, res) => {
let response=authService.verifyUser(req.body.username,req.body.password);
   if(response.authentication){
    jwt.sign({response}, authService.secretKey,  (err, token) => {
        res.json({
          status:200,
          message:response.message,           
          auth_token:token
        });
      });
   }else{
    res.status(500).json({status:403, message:response.message});
   }
});


module.exports = router;