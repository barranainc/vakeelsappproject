'use strict';

let express = require('express');
let router = express.Router();
const user = require('./user.routes');
const system = require('./system.routes');
const cases = require('./cases.routes');
const client = require('./client.routes');
const lawyer = require('./lawyer.routes');
const notification = require('./notifications.routes');

router.use('/users', user);
router.use('/auth', user);
router.use('/cases', cases);
router.use('/system', system);
router.use('/client', client);
router.use('/lawyers', lawyer);
router.use('/notifications', notification);
//router.use('/organizations', organization);


module.exports = router;