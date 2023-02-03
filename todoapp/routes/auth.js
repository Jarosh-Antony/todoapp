var express = require('express');
var router = express.Router();
const authController=require('../controllers/auth');


router.get('/login',authController.login);
router.get('/signup',authController.signup); 
router.post('/api/login',authController.api_login);
router.post('/api/signup',authController.api_signup); 


module.exports = router;