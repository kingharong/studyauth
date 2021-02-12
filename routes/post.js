const { isLoggedIn, isAuthorized } = require('./middleware');
const Post = require('../models/post');
const User = require('../models/user');
const { upload } = require('../uploads/multer');
const multer = require('multer');
const { Op } = require('sequelize');
const express = require('express');
const router = express.Router();

router.get('/test',isLoggedIn, (req,res)=>{
    res.status(200).json({user: req.decoded});
});
router.post('/img',isLoggedIn, isAuthorized, upload.single('img'),(req,res)=>{
    console.log(req.file);
    res.json({url: `/img/${req.file.filename}`});
});
const upload2 = multer();
router.post('board1/addpost', isLoggedIn, isAuthorized, upload2.none(), async (req,res,next)=>{
    try {
        const post = Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.decoded.id,
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }

} );

router.put('/board1/modify',isLoggedIn,isAuthorized, async (req,res,next)=>{

        try {
            const postId = req.body.id;
            await Post.update({
                content: req.body.content,
                img: req.body.url,
            },{
                where: { id:postId, userId: req.decoded.id }
            });
            res.redirect(303,'/board1/'+postId);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


router.get('/search',isLoggedIn,isAuthorized, async (req,res,next)=>{
    try{
        const content = req.query.content;
        const posts = Post.findAll({
            where: {
                content: { [Op.like]: '%'+content+'%' }
            }
        });
        if (posts) {
            res.status(200).json({posts: posts});
        } else {
            res.status(200).json({message:'no-content'});
        }
    } catch (err){
        console.error(err);
        next(err);
    }
});

router.route('/board1/:id')
    .get(isLoggedIn, async (req,res,next)=>{
        try{
            const post = await Post.findOne({
                where: {id:req.params.id}
            });
            res.status(200).json({post: post});
        } catch (err){
            console.error(err);
            next(err);
        }
    })
    .delete(isLoggedIn,isAuthorized, async(req,res,next)=>{
        try {
            await Post.destroy({
                where: {id: req.params.id, userId: req.decoded.id}
            });
            res.status(200).json({message: '삭제 완료'});
        } catch (err){
            console.error(err);
            next(err);

        }
    });


router.get('board1/:id/addlike',isLoggedIn,isAuthorized, async(req,res,next)=>{
    try {
        const postlike = await Post.findOne({
            attributes: ['like'],
            where: {id: req.params.id},
        });
        console.log(postlike);
        await Post.update({
            like: parseInt(postlike.dataValues.like+1,10),
            where: {id: req.params.id},
        });
        res.status(200).json({message: '좋아요 완료'});
    } catch(err){
        console.error(err);
        next(err);
    }
});
router.get('board1/:id/dellike',isLoggedIn, isAuthorized, async(req,res,next)=>{
    try {
        const postlike = await Post.findOne({
            attributes: ['like'],
            where: {id: req.params.id},
        });
        console.log(postlike);
        await Post.update({
            like: parseInt(postlike.dataValues.like-1,10),
            where: {id: req.params.id},
        });
        res.status(200).json({message: '좋아요 취소 완료'});
    } catch(err){
        console.error(err);
        next(err);
    }

});
router.delete('/board1/:id/delpost',isLoggedIn,isAuthorized, async(req,res,next)=>{
    try {
        await Post.destroy({
            where: {id: req.params.id, userId: req.decoded.id}
        });
        res.status(200).json({message: '삭제 완료'});
    } catch (err){
        console.error(err);
        next(err);

    }
});
module.exports = router;