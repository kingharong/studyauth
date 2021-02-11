module.exports = {

    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn
        (
            'users', // name of Target model
            'snsId', // name of the key we're adding
            {
                type: Sequelize.STRING(30),
                allowNull: true,
            })
    }


}
