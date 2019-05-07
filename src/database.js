const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodetube-db', {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
})
  .then((db) => console.log('Db is connected'))
  .catch((err) => console.error(err));