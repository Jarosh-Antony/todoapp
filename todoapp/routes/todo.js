const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks');

router.get('/',taskController.index);
router.get('/tasks',taskController.get);
router.post('/tasks/create',taskController.create);
router.put('/tasks/update',taskController.update);
router.delete('/tasks/delete',taskController.remove);

module.exports = router;
