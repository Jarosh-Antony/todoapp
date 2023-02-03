var express = require('express');
var router = express.Router();
const reportController=require('../controllers/report');


router.get('/',reportController.index);
router.get('/count',reportController.count);


module.exports = router;