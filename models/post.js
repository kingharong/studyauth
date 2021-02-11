const Sequelize = require('sequelize');
module.exports = class Post extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            title: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            like: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Post.belongsTo(db.User);
        db.Post.belongsTo(db.Board);
    }
}