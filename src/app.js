require('dotenv').config();
const express = require('express');
const db = require('./models');
const fileUpload = require('express-fileupload');
const router = require('./routes');
const cors = require('cors');
const { SERVER_ERROR } = require('./handlers/status_codes');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

app.use(express.urlencoded());
app.use(express.json());
app.use(fileUpload());
app.use(router);

//errors handling
app.use((err, req, res, next) => {
    res.status(err.status || SERVER_ERROR).json({
        description : err.description || 'Oops something went wrong'
    });
});

app.listen(PORT, () =>{
    console.log('port on :' +  PORT);
    db.sequelize.sync({alter: true});
});


