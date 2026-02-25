const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Watchlist = sequelize.define('Watchlist', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    movieId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['userId', 'movieId']
        }
    ]
});

// Relationships
User.hasMany(Watchlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
Watchlist.belongsTo(User, { foreignKey: 'userId' });

module.exports = Watchlist;
