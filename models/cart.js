module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      // just an owner relation
    });
    return Cart;
  };
  
