const express=require('express')
const middleware = require('../middleware/authmiddleware');
const { accessChat, fetchChat, createGroup, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatController');
const router=express.Router()

router.route('/').post(middleware,accessChat);
router.route('/').get(middleware,fetchChat);
router.route('/group').post(middleware,createGroup)
router.route('/rename').put(middleware,renameGroup)
router.route("/groupremove").put(middleware, removeFromGroup);
router.route("/groupadd").put(middleware, addToGroup);



module.exports=router