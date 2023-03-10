const { Router } = require('express');

const apiRouter = new Router();

const usersRouter = require('./users');
const thoughtsRouter = require('./thoughts');

apiRouter.use('/users', usersRouter);
apiRouter.use('/thoughts', thoughtsRouter);

module.exports = apiRouter;
