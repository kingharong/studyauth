const express= require('express');
const { isLoggedIn } = require('./middleware');
const User = require('../models/user');
const Auth = require('../models/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const util = require('util');
const router = express.Router();


router.post('/requestemailauth',isLoggedIn, async (req,res,next)=>{
    try {
        if (req.decoded.auth === 'before'){
            const promisecrypto = util.promisify(crypto.randomBytes);
            const token = await promisecrypto(20);
            const encodedtoken = encodeURIComponent(token.toString('hex'));
            await Auth.create({
                token: token.toString('hex'),
                userId: req.decoded.id,
                snsId: req.decoded.snsId
            });
            const transporter =  nodemailer.createTransport({
                service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false
                , auth: {
                    user: process.env.GOOGLE_EMAIL_USER,
                    pass: process.env.GOOGLE_EMAIL_PASS,
                }
            });

                const emailOptions = {
                    from: process.env.GOOGLE_EMAIL_USER,
                    to: req.body.email,
                    subject: '인증 메일입니다.',
                    html: '인증을 위해 아래의 URL을 클릭하여 주세욥.'
                        + `http://localhost:8003/emailauth/authmail?token=${encodedtoken}`
                };

            const info = await transporter.sendMail(emailOptions)
                .then(()=> {
                    return res.status(200).json({message: '메일을 보냈습니다. 확인해 주세요'});
                })
                .catch(()=>{
                    return res.status(400).json({message: '메일 보내기에 실패했습니다.'});
                });


        } else {
            res.status(200).json({message:'이미 인증된 회원입니다'})
        }
    } catch (err){
        console.error(err);
        next(err);
    }
});

router.get('/authmail',async (req,res,next)=>{
const token = req.query.token;

if (!token){
    return res.status(400).json({message: '잘못된 접근입니다'});
}
const decodedtoken = decodeURIComponent(token);
const auth = await Auth.findOne({
    where: {token: decodedtoken}
});
if (auth){
    await User.update({
        auth: 'user',
    }, {
        where: { id: auth.userId, snsId: auth.snsId }
    });
    await Auth.destroy({
        where: { token: decodedtoken }
    });
    return res.status(200).json({message: '인증이 완료되었습니다'});
} else {

    return res.status(400).json({message: '인증에 실패하였습니다'});
}

});

module.exports = router;