const {LoginResponse} = require('../../controller/authController');

describe('LoginResponse', ()=>{
    const res = {
        cookie: jest.fn(()=>res),
        status: jest.fn(()=>res),
        json: jest.fn(),
        redirect: jest.fn(),
    };
    const req = {
        login: jest.fn(()=>res),
    }
    const jwt = {
        sign: jest.fn(),
    }

    test('에러 있으면 400',()=>{
        let err='에러';
        let user = [{id: 3223, snsId: 323232, nick:'랄라',auth:'before'}];
        LoginResponse(req,res,err,user);
        expect(res.status).toBeCalledWith(400);
    });
    test('user 없을 때 redirect',()=>{
        let err=null;
        let user=null;
        LoginResponse(req,res,err,user);
       // expect(res.cookie).toBeCalledWith('studyauth');
        expect(res.redirect).toBeCalledWith('/');
    });
    test('정상 작동',()=>{
        let err= null;
        let user = [{id: 3223, snsId: 323232, nick:'랄라',auth:'before'}];
        LoginResponse(req,res,err,user);
        expect(req.login).lastReturnedWith(res.status(200));
    })
})