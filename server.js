const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const methodOverride = require('method-override');
const apiRouter = require('./router/apiRouter');
const path = require('path');

app.use(cors());
app.use(helmet());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', apiRouter);
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(function (req, res, next) {
  res.status(404).send('404 - Not Found!');
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server started on 5000');
});
