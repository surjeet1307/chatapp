const express=require('express')
const router=express.Router();
const {registerUser, authUser,allUser}=require('../controllers/userController');
const middleware = require('../middleware/authmiddleware');

router.route("/").post(registerUser).get(middleware,allUser)
router.route('/login').post(authUser)
module.exports=router