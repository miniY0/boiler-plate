const express = require('express')
const app = express()
const port = 8000
const bodyParser = require('body-parser')
const config = require('./config/key')
const { User } = require('./models/User')

//application/x-www-form-urlencoded 형태 데이터 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello world. this is nodemon test'))

app.post('/register', (req, res) => {

    //회원 가입 정보 가져와서 DB에 넣어줌
    
    //body-parser 이용해서 id, pw등 데이터를 req.body에서 가져옴
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})

        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`example app on port: ${port}`))