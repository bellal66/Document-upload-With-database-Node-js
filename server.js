const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const multer = require('multer');
const connection = require('./lib/database');
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs')
})
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./documents")
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage
}).single('document');
app.post('/document_upload', (req, res) => {
    upload(req, res, function(err){
        if(err){
            return res.json([{
                message: 'Not now!',
                result: err
            }])
        }else{
            connection.query('SELECT * FROM `database_table` WHERE `document` = ?', [req.file.filename], function(error, result) {
                if(result.length == 0){
                    connection.query('UPDATE `database_table` SET `document`=? WHERE `userId`=? ', [req.file.filename,'bb'], function(err, rest) {
                        if(err){
                            return res.json([{
                                message: 'Not now!',
                                result: err
                            }])
                        }else{
                            return res.json([{
                                message: 'Yes of course',
                                result: 'Succesful'
                            }])
                        }
                    })
                }else{
                    return res.json([{
                        message: 'Not now!',
                        result: 'Already exist!'
                    }])
                }
            })
        }
    })

})

app.listen(4021)