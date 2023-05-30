const AppError = require('../services/error');
const errorMessages = require('../services/errorMessages');
const db = require('../../app/services/db');
const {Op} = require('sequelize');

async function setLastSession(user) {
  const lastSession = new Date();
  user.set('lastSession', lastSession);
  await user.save();
  return user;
}

async function reqUser(req, res, next) {
  try {
    if (!req.user) throw new AppError({status: 400, message: errorMessages.USER_NOT_FOUND});
    if (req.user.role !== 'investor') throw new AppError({status: 400, message: errorMessages.USER_NOT_FOUND});

    const models = db.getModels();
    const existUser = await models.User.findOne({where: {id: req.user.id}});

    if (!existUser) throw new AppError({status: 400, message: errorMessages.USER_NOT_FOUND});
    if (existUser.status === 'BLOCKED') throw new AppError({status: 400, message: errorMessages.USER_HAS_BEEN_BLOCKED});

    await setLastSession(existUser);

    req.user = existUser.toJSON();
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({status: 500, message: errorMessages.SERVER_ERROR, err: err});
  }
}

module.exports = async function (req, res, next) {
  try {
    await reqUser(req, res, next)
  } catch (err) {
    res.status(err.status || 500).json(err)
  }
};
