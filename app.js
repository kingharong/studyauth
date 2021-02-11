const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const passport = require('passport');

dotenv.config();

const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const emailauthRouter = require('./routes/emailauth');
const passportConfig = require('./passport');
const app = express();
passportConfig();
app.set('port',process.env.PORT || 8003)
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch: true
});
sequelize.sync({force: false})
    .then(()=>{
        console.log('DB 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    });
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        signed: true,
    }
}));
app.use('/post',postRouter);
app.use('/auth',authRouter);
app.use('/emailauth',emailauthRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method},${req.url} 라우터가 없습니다`);
    error.status(404);
    next(error);
});

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production'? err:{};
    res.status(err.status||500);
    res.render('error');
});

module.exports=app;