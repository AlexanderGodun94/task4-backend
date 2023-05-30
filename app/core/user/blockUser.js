const AppError = require('../../services/error');
const errorMessages = require('../../services/errorMessages');
const db = require('../../../app/services/db');

const models = db.getModels();

async function blockUser(userId, status) {
  try {
    const models = db.getModels();
    let user = await models.User.findOne({where: {id: userId}});
    if (!user) throw new AppError({status: 400, message: errorMessages.USER_NOT_FOUND});
    user.set('status', status);
    return await user.save();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({err: err});
  }
}

module.exports = blockUser;

