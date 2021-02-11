const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/user');

module.exports = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true,
    }, async (request, accessToken, refreshToken, profile, done)=>{
        console.log('profile: ',profile);
        try {
            const user = await User.findOrCreate({
                where: { snsId: profile.id,
                    provider: 'google',
                    nick: profile.displayName,  }
            });
            return done(null,user);
        } catch (err){
            console.error(err);
            return done(err);
        }
    }));
}
