var express = require('express');
var router = express.Router();
let User = require('../models/userModel.js');

let users = require('./users.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  // debug
  console.log(req.session);
  if (req.session.user) {
    // すでにログイン時
    res.redirect('/users')
  }
  res.render('login', { title: 'Express' });
});

/* ログイン */
router.post('/login', function(req, res, next) {
  // 簡単なバリデーション
  if (!req.body.username || !req.body.password) {
    res.redirect('/');
  }
  let query = {
    username: req.body.username,
    password: req.body.password // sha1などで暗号化するのがベター
  }
  User.find(query, function(err, data) {
    if (err) {
      // エラー発生時
      console.log(err);
      res.redirect('/');
    }
    if (data.length > 0) {
      // ログイン成功時
      req.session.user_id = data[0]._id;
      res.redirect('/users');
    }
    else {
      // ログイン失敗時
      res.redirect('/');
    }
  });
});

router.post('/register', function(req, res) {
  // 簡単なバリデーション
  if (!req.body.username || !req.body.password) {
    res.redirect('/');
  }
  let user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.save(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

router.post('/logout', function(req, res) {
  delete req.session.user;
  res.redirect('/');
});

let loginCheck = (req, res, next) => {
  if (req.session.user_id) {
    next();
  } else {
    res.redirect('/');
  }
}

router.use('/users', loginCheck, users); // loginCheck

module.exports = router;
