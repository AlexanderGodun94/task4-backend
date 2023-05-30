const AppError = require('../../services/error');
const db = require('../../../app/services/db');

const models = db.getModels();

async function deleteUser(userId) {
  try {
    return await models.User.destroy({
      where: {id: userId},
      force: true
    });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({err: err});
  }
}

module.exports = deleteUser;

