const errorMessages = require('../services/errorMessages');
const AppError = require('../services/error');
const respond = require('../middlewares/respond');

const reqAuth = require('../middlewares/reqAuth');

const auth = require('../core/auth');

module.exports = function () {

  const app = this.app;

  app.route('/api/v1/auth')
    .post((req, res) => {
      if (!req.body.email || !req.body.password)
        return res.status(400).json(new AppError({status: 400, message: errorMessages.BAD_DATA}));
      respond(res, 200, auth(req.body.email, req.body.password));
    });


};

