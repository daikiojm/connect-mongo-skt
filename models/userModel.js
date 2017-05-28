/**
* スキーマ定義
**/
'use strict';

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model('Users', UserSchema);
