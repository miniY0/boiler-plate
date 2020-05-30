const { User } = require('../models/User')

let auth = (req, res, next) => {
    //인증 처리 파트
    //쿠키에서 토큰 가져옴
    let token = req.cookies.x_auth

    //토큰 디코딩 -> 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token
        req.user = user
        next()
    })

    //유저 일치하면 인증 확인
}

module.exports = {auth}