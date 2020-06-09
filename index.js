const express = require('express')
const app = express()
const port = 8000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

//application/x-www-form-urlencoded 형태 데이터 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}))
//application/json
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello world. this is nodemon test'))
app.get('/api/hello', (req, res) => res.send("hello"))

//회원가입
app.post('/api/users/register', (req, res) => {

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

//로그인
app.post('/api/users/login', (req, res) => {

    //요청된 계정을 DB에서 확인
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "일치하는 이메일 없음"
            })
        }

    //만약 DB에 존재하면 PW 도 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({
                loginSuccess: false,
                message: "비밀번호 틀림"
            })

    //PW 까지 일치하면 토큰 생성, 부여
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)

                //토큰을 저장, 쿠키 또는 로컬
                res.cookie("x_auth", user.token)    //x_auth 이름으로 쿠키에 토큰 저장
                .status(200)
                .json({loginSuccess: true, userId: user._id})
            })
        })
    })
})

//auth route
app.get('/api/users/auth', auth, (req, res) => {

    //미들웨어인 auth 를 통과한 파트
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })
})


//logout
app.get('/api/users/logout', auth, (req, res) => {
    
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token: ""},
        (err, user) => {
            if(err) return res.json({success: false, err})

            return res.status(200).send({success: true})
        }
    )
})

app.listen(port, () => console.log(`example app on port: ${port}`))