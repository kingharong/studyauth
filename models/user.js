const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: true,
            },
            provider:{
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            webmail: {
                type: Sequelize.STRING(40),
                allowNull: true,
            },
            auth: {
                type: Sequelize.ENUM('user','before','suspend','admin'),
                allowNull: false,
                defaultValue: 'before',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'User',
            tableName: 'users',
            paranoid: 'true',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    }
    static associate(db) {
        db.User.hasMany(db.Post);
    }
}

