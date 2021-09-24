const express = require("express");
const router = express.Router();

//const dotenv = require('dotenv').config({path:__dirname+'/./../.env'});
require('dotenv').config({ path: require('find-config')('.env') })

const WEBSITE_NAME = process.env.REACT_APP_WEBSITE_NAME || 'CHAT';
router.get('/', (req,res) => {
  res.send(`<h1>${WEBSITE_NAME}'s socket server is up and running</h1>` )
})

module.exports = router;