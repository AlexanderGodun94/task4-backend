const AppError = require('../../services/error');
const errorMessages = require('../../services/errorMessages');
const db = require('../../../app/services/db');
const config = require('../../../config');
const jwt = require('jsonwebtoken');

async function createUser(email, password, firstName, lastName) {
  try {
    const models = db.getModels();

    const user = await models.User.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    });

    let userObj = user.toJSON();
    userObj.accessToken = jwt.sign(userObj, config.server.secret, {expiresIn: config.server.expiresIn});
    return userObj;
  } catch (err) {
    if (err.original && err.original.constraint.includes('users_email_key'))
      throw new AppError({status: 400, message: errorMessages.EMAIL_EXIST});
    if (err instanceof AppError) throw err;
    throw new AppError({err: err});
  }
}

module.exports = createUser;

