const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title: {
                type: Sequelize.STRING(20),
                allowNull: true,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'Board',
            tableName: 'board',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'

        });

        }
        static associate(db) {
        db.Board.hasMany(db.Post);
        }
}