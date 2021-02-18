var mongoose = require('mongoose');


const config = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
mongoose.connect('mongodb://localhost:27017/aryablog',config);