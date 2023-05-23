const express=require('express')
const middleware = require('../middleware/authmiddleware')
const { sendMessage, getMessage } = require('../controllers/messController')
const router=express.Router()

router.route('/').post(middleware,sendMessage)
router.route('/:chatId').get(middleware,getMessage);

module.exports=router