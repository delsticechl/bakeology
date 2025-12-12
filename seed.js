const { Cake } = require('./models');

module.exports = async function seed() {

  // ✅ Regular cakes
  const cakes = [
    {
      title: 'Cheesecake',
      description: 'Creamy & rich cheesecake.',
      price: 80000,
      imageUrl: 'https://www.recipetineats.com/tachyon/2024/09/No-bake-cheesecake_8.jpg',
      recipe: `Base recipe (simple no-bake):
- 200g digestive biscuits, crushed
- 100g melted butter
- 500g cream cheese
- 150g powdered sugar
- 300ml heavy cream, whipped
- 1 tsp vanilla

Directions:
1) Mix crumbs + butter, press into a tin.
2) Beat cream cheese + sugar + vanilla, fold in whipped cream.
3) Pour on base, chill 4 hrs.`
    },
    {
      title: 'Brownies',
      description: 'Fudgy chocolate brownies.',
      price: 35000,
      imageUrl: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-50773_12-39c611e.jpg',
      recipe: `Simple fudgy brownies:
- 150g dark chocolate, 100g butter
- 200g sugar, 2 eggs, 70g flour
Directions:
Melt chocolate+butter, mix with sugar+eggs, fold in flour, bake 25-30 min at 175°C.`
    },
    {
      title: 'Cookies',
      description: 'Handmade crunchy cookies.',
      price: 50000,
      imageUrl: 'https://cdn.loveandlemons.com/wp-content/uploads/2024/08/chocolate-chip-cookie-recipe.jpg',
      recipe: `Classic cookie:
- 150g butter, 150g sugar, 1 egg, 250g flour, choc chips
Cream butter+sugar, add egg, fold in flour + chips. Scoop and bake 10-12 min at 180°C.`
    },
    {
      title: 'Macaron',
      description: 'Sweet & colorful macarons.',
      price: 35000,
      imageUrl: 'https://mojo.generalmills.com/api/public/content/Z7QDsgL_S5K7cLZAfdG1-A_webp_base.webp',
      recipe: `Macaron (basic):
- 100g ground almonds, 100g icing sugar, 2 whites, 80g sugar
Sift dry, make meringue, fold, pipe rounds, rest 30 min, bake 12-14 min at 150°C.`
    },
    {
      title: 'Cupcake',
      description: 'Soft cake with sweet frosting.',
      price: 35000,
      imageUrl: 'https://product.hstatic.net/1000306601/product/vuong_1_9285033b2d0e43d5bea24471d53c7786_master.jpg',
      recipe: `Vanilla cupcake:
- 120g butter, 120g sugar, 2 eggs, 120g flour, 1 tsp baking powder
Cream butter+sugar, add eggs, fold flour, bake 18-20 min at 175°C.`
    },
    {
      title: 'Matcha Citrus Cake',
      description: 'Refreshing matcha with a hint of citrus.',
      price: 85000,
      imageUrl: 'https://picklesnhoney.com/wp-content/uploads/2017/02/matcha-cake-3.jpg',
      recipe: `Matcha cake:
- Basic sponge + 1-2 tbsp matcha powder, zest of 1 lemon. Bake as sponge, fill with matcha cream.`
    },
    {
      title: 'Croissant',
      description: 'Buttery, flaky pastry made from layered yeast-leavened dough.',
      price: 35000,
      imageUrl: 'https://assets.bonappetit.com/photos/68e6b4a316c63f9625380e02/1:1/w_2560%2Cc_limit/1025_Dominique-Ansel-RECIPE.jpg',
      recipe: `Croissant (short):
- Croissant is laminated dough — this is advanced; for quick version use puff pastry and roll with butter, shape, bake.`
    },
    {
      title: 'Mini Red Velvet',
      description: 'Classic red velvet in individual portion.',
      price: 75000,
      imageUrl: 'https://jessiebakescakes.com/wp-content/uploads/2022/09/Mini-Red-Velvet-Cakes-7-scaled.jpg',
      recipe: `Red velvet:
- 2 cups flour, 1 tsp cocoa, 1 tsp vinegar, red food coloring, cream cheese frosting.`
    },
    {
      title: 'Tiramisu',
      description: 'Italian coffee-flavored classic dessert.',
      price: 95000,
      imageUrl: 'https://xoichesaigon.com/uploads/tiramisu-duoc-lam-tu-banh-ladyfinger.png.webp',
      recipe: `Simple tiramisu:
- Ladyfingers, strong coffee, mascarpone, eggs (or whipped cream), sugar. Layer and chill.`
    },
    {
      title: 'Lemon Tart',
      description: 'Zesty lemon cream tart with crispy crust.',
      price: 55000,
      imageUrl: 'https://thumbs.dreamstime.com/b/zesty-lemon-tart-crisp-pastry-tangy-filling-australian-dessert-art-elegant-high-resolution-serving-zesty-lemon-tart-372277847.jpg',
      recipe: `Lemon tart:
- Prebake tart shell, fill with lemon curd (eggs, sugar, lemon juice, butter) and chill.`
    },
    {
      title: 'Apple Pie',
      description: 'Buttery flaky crust, spiced apples.',
      price: 40000,
      imageUrl: 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Berry-Apple-Pie_EXPS_FT22_42356_F_0511_1.jpg',
      recipe: `Apple pie:
- Sliced apples + sugar + cinnamon, place in crust, top with crust, bake 40-50 min at 190°C.`
    },
    {
      title: 'Matcha Roll Cake',
      description: 'Soft roll cake filled with matcha cream.',
      price: 65000,
      imageUrl: 'https://www.siftandsimmer.com/wp-content/uploads/2023/01/matcha-swiss-roll-cake3.jpg',
      recipe: `Swiss roll:
- Sponge with matcha in batter, bake thin sheet, spread cream, roll and chill.`
    }
  ];

  // ✅ Seasonal cakes
  const seasonal = [
    {
      title: "Gingerbread Cake",
      price: 25000,
      description: "Spicy and soft gingerbread cake, perfect for Christmas.",
      recipe: "Mix flour, ginger, cinnamon, cloves, baking soda, butter, brown sugar, and a little molasses into a soft dough. Chill it briefly, then roll it out and cut into shapes. Bake at a moderate heat until the edges are just firm. Let them cool before decorating or enjoying warm.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbRbmP3YNN5VRbpUdIj_SJl9ySVncpNFlBRg&s",
      category: "seasonal"
    },
    {
      title: "Yule Log Cake",
      price: 100000,
      description: "Traditional Christmas dessert shaped like a log.",
      recipe: "Bake a thin chocolate sponge in a sheet pan, then turn it out onto a towel dusted with cocoa and roll it up while warm. Unroll, spread with whipped cream or chocolate buttercream, and roll it back into a log. Cover the outside with more frosting and drag a fork along the surface to make “bark.” Chill briefly so it sets before slicing.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLuslnIrsQiDAcTttL7-yyoRnnh7cxMnysA&s",
      category: "seasonal"
    },
    {
      title: "Snowman Cupcakes",
      price: 50000,
      description: "Cute snowman cupcakes with buttercream frosting.",
      recipe: "Bake vanilla cupcakes, decorate with white buttercream to form the snowman shape, use mini chocolate chips for eyes and buttons, and a small carrot candy for the nose. Add a scarf made from fruit leather or fondant for extra charm.",
      imageUrl: "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/melting_snowman_cupcakes_77135_16x9.jpg",
      category: "seasonal"
    },
    {
      title: "Christmas Pudding",
      price: 80000,
      description: "Rich steamed pudding with dried fruit.",
      recipe: "Mix dried fruits, brown sugar, breadcrumbs, flour, spices, and a little grated apple with eggs and melted butter. Add a splash of brandy or orange juice for moisture, then spoon the mixture into a greased pudding bowl. Cover tightly and steam it gently for several hours until firm. Let it cool, then resteam briefly before serving with custard or brandy butter.",
      imageUrl: "https://www.christinascucina.com/wp-content/uploads/2016/12/fullsizeoutput_38f4-scaled.jpeg",
      category: "seasonal"
    }
  ];

  // ✅ Insert all cakes
  await Cake.bulkCreate([...cakes, ...seasonal]);
};