const passport = require('passport');
const jwt = require('jsonwebtoken');
const LoginResponse = (req,res,err,user)=> {
    if (err){
        return res.status(400).json({message: err.message});
    }
    if (!user){
        return res.redirect('/');
    }
    req.login(user, {session: false}, err =>{
        console.log(user[0].id, user[0].snsId);
        if (err){
            return res.status(400).json({message: err.message});
        }
        const token = jwt.sign({
            id: user[0].id,
            snsId: user[0].snsId,
            nick: user[0].nick,
            auth: user[0].auth
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'me',

        });
        console.log(token);
        return res.cookie("studyauth", token,{
            maxAge: 1000 * 60,
            httpOnly: true,
        }).status(200).json({message: 'success'});
    })
};

module.exports = {
    google: (req,res,next)=>{
        passport.authenticate('google', {scope: ['profile']})(req,res,next);
    },
    callback: (req,res,next)=>{
        passport.authenticate('google',(err,user)=>{
            LoginResponse(req,res,err,user);
        })(req,res,next);
    }
}