const express = require('express');
const db = require('./config/connection');
const mainRouter = require('./controllers');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', mainRouter);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log('Application listening on ' + PORT);
    });
});
