const Sequelize = require('sequelize');
const User = require('../../models/user');
const config = require('../../config/config.json')['test'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

describe('User', ()=>{
    test('static init',()=>{
        expect(User.init(sequelize)).toBe(User);
    });
    test('static associate',()=>{
        const db = {
            User: {
                hasMany: jest.fn()
            },
            Post: {},
        };
        User.associate(db);
        expect(db.User.hasMany).toBeCalledWith(db.Post);
    });
});