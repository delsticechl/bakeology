module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER
    });
  
    OrderItem.associate = models => {
      OrderItem.belongsTo(models.Order);
      OrderItem.belongsTo(models.Cake);
    };
  
    return OrderItem;
  };
