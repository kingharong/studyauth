const Sequelize = require('sequelize');

module.exports = class Auth extends Sequelize.Model{
    static init(sequelize){
        super.init({
            token:{
                type: Sequelize.STRING(100),
                allowNull: false,
            } ,
            userId:{
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Auth',
            tableName: 'auth',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'

        });
    };
}