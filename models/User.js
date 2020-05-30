const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//user 모델에 정보를 저장하기 전에 함수 실행
userSchema.pre('save', function(next) {
    var user = this

    //password 가 변경되었을때만 암호화
    if(user.isModified('password')) {
        //비밀번호를 암호화 시킴
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err)

            //plainPassword -> hash password
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)

                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)

        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this

    //jsonwebtoken 이용해 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)

        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this

    //토큰 디코딩
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //일치하는 아이디 있는지 확인
        //클라이언트에서 가져온 토큰과 DB의 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err)
            
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}