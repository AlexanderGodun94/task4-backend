const errorMessages = require('../services/errorMessages');
const AppError = require('../services/error');
const respond = require('../middlewares/respond');
const reqAuth = require('../middlewares/reqAuth');
const reqUser = require('../middlewares/reqUser');

const createUser = require('../core/user/createUser');
const getUsers = require('../core/user/getUsers');
const deleteUser = require('../core/user/deleteUser');
const blockUser = require('../core/user/blockUser');


module.exports = function () {

  const app = this.app;

  app.route('/api/v1/user')
    .get(reqAuth, reqUser, (req, res) => {
      respond(res, 200, req.user);
    })
    .post((req, res) => {
      if (!req.body.email || !req.body.password)
        return res.status(400).json(new AppError({status: 400, message: errorMessages.BAD_DATA}));
      respond(res, 201, createUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName));
    });

  app.route('/api/v1/user/users')
    .get(reqAuth, reqUser,(req, res) => {
      respond(res, 200, getUsers());
    })
    .delete((req, res) => {
      if (!req.body.userId)
        return res.status(400).json(new AppError({status: 400, message: errorMessages.BAD_DATA}));
      respond(res, 200, deleteUser(req.body.userId));
    });

  app.route('/api/v1/user/status')
    .put((req, res) => {
      if (!req.body.userId || !req.body.status || !(req.body.status === 'BLOCKED' || req.body.status === 'ACTIVE'))
        return res.status(400).json(new AppError({status: 400, message: errorMessages.BAD_DATA}));
      respond(res, 200, blockUser(req.body.userId, req.body.status));
    });


};

