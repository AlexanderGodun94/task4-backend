const errorMessages = require('../services/errorMessages');
const AppError = require('../services/error');
const respond = require('../middlewares/respond');

const reqAuth = require('../middlewares/reqAuth');

const generateUser = require('../core/guest/generateUser');

module.exports = function () {

  const app = this.app;

  app.route('/api/v1/guest/generateUsers')
    .get((req, res) => {
      console.log('1111')
      if (!req.query.countUsers || !req.query.seed || !req.query.startUser ||
        !(req.query.countryCode === 'uk' || req.query.countryCode === 'en_US' || req.query.countryCode === 'pl'))
        return res.status(400).json(new AppError({status: 400, message: errorMessages.BAD_DATA}));
      respond(res, 200, generateUser(req.query.countryCode, req.query.countUsers, req.query.startUser, req.query.seed));
    });


};

