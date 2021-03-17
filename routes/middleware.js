const jwt = require('jsonwebtoken');
exports.isLoggedIn = (req,res,next)=>{
    try {
        req.decoded = jwt.verify(req.cookies.studyauth, process.env.JWT_SECRET);

        return next();
    } catch (err){
        if (err.name === 'TokenExpiredError'){
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다'
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다'
        });
    }
}

exports.isAuthorized = (req,res,next)=>{
    try {
        console.log(req.decoded.auth);
        if(req.decoded.auth === 'user' || req.decoded.auth === 'admin'){
            next();
        }
        else if(req.decoded.auth === 'before'){
            return res.status(401).json({message: '인증이 필요한 회원입니다'});
        }
        else if(req.decoded.auth === 'suspend'){
            return res.status(401).json({message: '정지된 회원입니다'});
        }
    } catch(err){
        console.error(err);
        next(err);
    }
}