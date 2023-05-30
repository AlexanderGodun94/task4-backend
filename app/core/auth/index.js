const AppError = require('../../services/error');
const errorMessages = require('../../services/errorMessages');
const db = require('../../../app/services/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

async function auth(email, password) {
  try {
    const models = db.getModels();

    let user = await models.User.findOne({where: {email: email}});
    if (!user) throw new AppError({status: 400, message: errorMessages.USER_NOT_FOUND});


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError({status: 400, message: errorMessages.WRONG_PASSWORD});

    let userObj = user.toJSON();
    userObj.accessToken = jwt.sign(userObj, config.server.secret, {expiresIn: config.server.expiresIn});
    return userObj;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({err: err});
  }
}

module.exports = auth;

