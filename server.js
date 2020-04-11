const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const helmet = require('helmet');
const methodOverride = require('method-override');
const apiRouter = require('./router/apiRouter');

app.use(cors());
app.use(helmet());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', apiRouter);

app.use(function (req, res, next) {
  res.status(404).send('404 - Not Found!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on 3000');
});