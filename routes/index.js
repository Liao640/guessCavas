var express = require('express');
var router = express.Router();

// var app = express()

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(global.messageList)

  res.render('login', {title: 'welcome chatroom'});
});
router.get('/index', function(req, res, next) {
  console.log(global.messageList)

  res.render('index', {
    title: 'Socket.IO chat',
    msgList: global.messageList,
    msgListJson: JSON.stringify(global.messageList)
  });
});
router.get('/canvas', function(req, res, next) {
  // console.log(global.messageList)
  res.render('canvas', {title: 'welcome chatroom'});
});

module.exports = router;
