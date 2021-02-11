const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('./user');
const Post = require('./post');
const Board = require('./board');
const Auth = require('./auth');

const db={};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Board = Board;
db.Post = Post;
db.Auth = Auth;

User.init(sequelize);
Post.init(sequelize);
Board.init(sequelize);
Auth.init(sequelize);

User.associate(db);
Post.associate(db);
Board.associate(db);

module.exports = db;