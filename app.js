const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const bcrypt = require('bcrypt');
const expressLayouts = require('express-ejs-layouts');
const { sequelize, User, Cake, Cart, CartItem, Order, OrderItem } = require('./models');
const app = express();

// Express setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session & flash
app.use(session({
  secret: 'bakeology-secret-123',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// make user + flash available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ---------- ROUTES ----------
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.req = req;   // ✅ add this
  next();
});
app.use(async (req, res, next) => {
  if (req.session.user) {
    const cart = await Cart.findOne({
      where: { UserId: req.session.user.id },
      include: [CartItem]
    });

    res.locals.cartCount = cart
      ? cart.CartItems.reduce((sum, item) => sum + item.quantity, 0)
      : 0;
  } else {
    res.locals.cartCount = 0;
  }

  next();
});
// Home / list cakes
app.get('/', async (req, res) => {
  const cakes = await Cake.findAll();
  res.render('index', { cakes });
});

// Cake detail
app.get('/cakes/:id', async (req, res) => {
  const cake = await Cake.findByPk(req.params.id);
  if (!cake) {
    req.flash('error', 'Cake not found');
    return res.redirect('/');
  }
  res.render('detail', { cake });
});

// Seasonal cakes
app.get('/seasonal', async (req, res) => {
  const seasonalCakes = await Cake.findAll({
    where: { category: 'seasonal' }
  });

  res.render('seasonal', { seasonalCakes });
});
// Registration
app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
  const { name, username, password } = req.body;

  if (!username || !password) {
    req.flash('error', 'Provide username and password');
    return res.redirect('/register');
  }

  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      req.flash('error', 'Username already in use');
      return res.redirect('/register');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, password: hash });

    req.session.user = { id: user.id, username: user.username, name: user.name };
    req.flash('success', 'Registered successfully');
    res.redirect('/');
  } catch (e) {
    console.error(e);
    req.flash('error', 'Registration error');
    res.redirect('/register');
  }
});

// Login
app.get('/login', (req, res) => res.render('login'));

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  }

  req.session.user = { id: user.id, username: user.username, name: user.name };
  req.flash('success', 'Logged in');
  res.redirect('/');
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Cart routes
app.get('/cart', async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in to view cart');
    return res.redirect('/login');
  }

  let cart = await Cart.findOne({
    where: { UserId: req.session.user.id },
    include: [{ model: CartItem, include: [Cake] }]
  });

  if (!cart) cart = await Cart.create({ UserId: req.session.user.id });

  res.render('cart', { cart });
});

// API to add item to cart
app.post('/api/cart/add', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

  const { cakeId, qty = 1 } = req.body;
  const cake = await Cake.findByPk(cakeId);

  if (!cake) return res.status(404).json({ error: 'Cake not found' });

  let cart = await Cart.findOne({ where: { UserId: req.session.user.id } });
  if (!cart) cart = await Cart.create({ UserId: req.session.user.id });

  let item = await CartItem.findOne({ where: { CartId: cart.id, CakeId: cake.id } });

  if (item) {
    item.quantity += parseInt(qty);
    await item.save();
  } else {
    item = await CartItem.create({ CartId: cart.id, CakeId: cake.id, quantity: qty });
  }

  res.json({ success: true });
});

// Update quantity
app.post('/api/cart/update', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

  const { itemId, quantity } = req.body;
  const item = await CartItem.findByPk(itemId, { include: [Cake] });

  if (!item) return res.status(404).json({ error: 'Item not found' });

  item.quantity = Math.max(0, parseInt(quantity));

  if (item.quantity === 0) await item.destroy();
  else await item.save();

  res.json({ success: true });
});

// Remove item
app.post('/api/cart/remove', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });

  const { itemId } = req.body;
  const item = await CartItem.findByPk(itemId);

  if (!item) return res.status(404).json({ error: 'Item not found' });

  await item.destroy();
  res.json({ success: true });
});

// ---------- START & SEED ----------
const PORT = process.env.PORT || 3000;

async function start() {
  await sequelize.sync({ force: false });

  const count = await Cake.count();
  if (count === 0) {
    console.log('Seeding sample cakes...');
    await require('./seed')();
    console.log('Seeded.');
  }

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start();

// ✅ Checkout page
app.get('/checkout', async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in to checkout');
    return res.redirect('/login');
  }

  const cart = await Cart.findOne({
    where: { UserId: req.session.user.id },
    include: [{ model: CartItem, include: [Cake] }]
  });

  if (!cart || cart.CartItems.length === 0) {
    req.flash('error', 'Your cart is empty');
    return res.redirect('/cart');
  }

  res.render('checkout', { cart });
});

// ✅ Handle checkout form submission (FINAL VERSION)
app.post('/checkout', async (req, res) => {
  const { name, address, phone } = req.body;

  if (!name || !address || !phone) {
    req.flash('error', 'Please fill in all fields');
    return res.redirect('/checkout');
  }

  const cart = await Cart.findOne({
    where: { UserId: req.session.user.id },
    include: [{ model: CartItem, include: [Cake] }]
  });

  if (!cart) return res.redirect('/cart');

  // ✅ Create order
  const order = await Order.create({
    UserId: req.session.user.id,
    name,
    address,
    phone,
    totalPrice: cart.CartItems.reduce(
      (sum, item) => sum + item.Cake.price * item.quantity,
      0
    )
  });

  // ✅ Create order items
  for (const item of cart.CartItems) {
    await OrderItem.create({
      OrderId: order.id,
      CakeId: item.Cake.id,
      quantity: item.quantity,
      price: item.Cake.price
    });
  }

  // ✅ Clear cart
  await CartItem.destroy({ where: { CartId: cart.id } });

  res.redirect('/checkout/success');
});

// ✅ Checkout success page
app.get('/checkout/success', (req, res) => {
  res.render('checkout-success');
});

// ✅ My Orders page
app.get('/my-orders', async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in to view your orders');
    return res.redirect('/login');
  }

  const orders = await Order.findAll({
    where: { UserId: req.session.user.id },
    include: [{ model: OrderItem, include: [Cake] }],
    order: [['createdAt', 'DESC']]
  });

  res.render('my-orders', { orders });
});

// ADMIN MIDDLEWARE
function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    req.flash('error', 'Admin access only');
    return res.redirect('/');
  }
  next();
}
// ADMIN DASHBOARD ROUTE
app.get('/admin', requireAdmin, (req, res) => {
  res.render('admin/dashboard');
});
// ADMIN - MANAGE CAKES
app.get('/admin/cakes', requireAdmin, async (req, res) => {
  const cakes = await Cake.findAll();
  res.render('admin/cakes', { cakes });
});
// ADMIN - MANAGE ORDERS
app.get('/admin/orders', requireAdmin, async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: OrderItem, include: [Cake] }],
    order: [['createdAt', 'DESC']]
  });

  res.render('admin/orders', { orders });
});
// ADMIN - LOG IN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  }

  req.session.user = { 
    id: user.id, 
    username: user.username, 
    name: user.name,
    isAdmin: user.isAdmin   // ✅ IMPORTANT
  };

  req.flash('success', 'Logged in');
  res.redirect('/');
});
// PROMOTE USER TO ADMIN (FOR TESTING PURPOSES)
app.post('/admin/promote/:id', requireAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/admin/users');
  }

  user.isAdmin = true;
  await user.save();

  req.flash('success', `${user.username} is now an admin`);
  res.redirect('/admin/users');
});
// ADMIN - MANAGE USERS
app.get('/admin/users', requireAdmin, async (req, res) => {
  const users = await User.findAll();
  res.render('admin/users', { users });
});