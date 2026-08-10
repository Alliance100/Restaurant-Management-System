import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import MenuItem from '../src/models/MenuItem.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // ─── Clear existing data ─────────────────────────────────────────────────
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data.');

    // ─── Seed Users ──────────────────────────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', salt);
    const userHash  = await bcrypt.hash('user1234', salt);

    await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@tablecraft.com',
        passwordHash: adminHash,
        phone: '1234567890',
        role: 'admin',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: userHash,
        phone: '9876543210',
        role: 'customer',
      },
      {
        name: 'Ali Hassan',
        email: 'ali@example.com',
        passwordHash: userHash,
        phone: '5551234567',
        role: 'customer',
      },
    ]);
    console.log('👤 Users seeded.');

    // ─── Seed Categories ─────────────────────────────────────────────────────
    const categories = await Category.insertMany([
      {
        name: 'Burgers',
        slug: 'burgers',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Pizzas',
        slug: 'pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Pasta',
        slug: 'pasta',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Drinks',
        slug: 'drinks',
        imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Desserts',
        slug: 'desserts',
        imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Salads',
        slug: 'salads',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        sortOrder: 6,
        isActive: true,
      },
    ]);
    console.log('📂 Categories seeded.');

    const [burgers, pizzas, pasta, drinks, desserts, salads] = categories;

    // ─── Seed Menu Items ─────────────────────────────────────────────────────
    await MenuItem.insertMany([

      // ── BURGERS ──────────────────────────────────────────────────────────
      {
        categoryId: burgers._id,
        name: 'Smoky BBQ Smash Burger',
        slug: 'smoky-bbq-smash-burger',
        description: 'Double smashed patties, cheddar cheese, crispy bacon, smoky BBQ sauce, pickles, and caramelized onions on a toasted brioche bun.',
        price: 1499,
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80',
        dietaryTag: 'non-vegetarian',
        preparationMinutes: 18,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Extra Cheese', price: 150 },
          { name: 'Bacon Strip', price: 200 },
          { name: 'Avocado', price: 250 },
        ],
      },
      {
        categoryId: burgers._id,
        name: 'Classic Veggie Burger',
        slug: 'classic-veggie-burger',
        description: 'Plant-based patty with lettuce, tomato, onion, and vegan mayo on a sesame seed bun. 100% plant-powered.',
        price: 1099,
        imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80',
        dietaryTag: 'vegetarian',
        preparationMinutes: 15,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Grilled Mushroom', price: 150 },
          { name: 'Jalapeños', price: 100 },
        ],
      },
      {
        categoryId: burgers._id,
        name: 'Crispy Chicken Burger',
        slug: 'crispy-chicken-burger',
        description: 'Buttermilk-fried chicken breast, coleslaw, pickles, and spicy sriracha mayo on a toasted potato bun.',
        price: 1349,
        imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
        dietaryTag: 'non-vegetarian',
        preparationMinutes: 20,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Extra Sriracha', price: 75 },
          { name: 'Cheese Slice', price: 150 },
        ],
      },
      {
        categoryId: burgers._id,
        name: 'Mushroom Swiss Burger',
        slug: 'mushroom-swiss-burger',
        description: 'Beef patty loaded with sautéed mushrooms, Swiss cheese, garlic aioli, and fresh arugula.',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80',
        dietaryTag: 'non-vegetarian',
        preparationMinutes: 18,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Double Patty', price: 350 },
          { name: 'Truffle Sauce', price: 200 },
        ],
      },

      // ── PIZZAS ───────────────────────────────────────────────────────────
      {
        categoryId: pizzas._id,
        name: 'Margherita Classic',
        slug: 'margherita-classic',
        description: 'San Marzano tomato sauce, fresh mozzarella, hand-torn basil leaves, and a drizzle of extra-virgin olive oil.',
        price: 1199,
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
        dietaryTag: 'vegetarian',
        preparationMinutes: 20,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Extra Mozzarella', price: 200 },
          { name: 'Olives', price: 150 },
          { name: 'Jalapeños', price: 100 },
        ],
      },
      {
        categoryId: pizzas._id,
        name: 'Pepperoni Inferno',
        slug: 'pepperoni-inferno',
        description: 'Loaded with spicy pepperoni, mozzarella, red chili flakes, and a rich tomato base. Not for the faint-hearted.',
        price: 1449,
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
        dietaryTag: 'non-vegetarian',
        preparationMinutes: 22,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Extra Pepperoni', price: 250 },
          { name: 'Stuffed Crust', price: 300 },
        ],
      },
      {
        categoryId: pizzas._id,
        name: 'BBQ Chicken Pizza',
        slug: 'bbq-chicken-pizza',
        description: 'Smoky BBQ base with grilled chicken, red onion, bell peppers, corn, and mozzarella. A crowd favourite.',
        price: 1549,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        dietaryTag: 'non-vegetarian',
        preparationMinutes: 25,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Extra Chicken', price: 300 },
          { name: 'Pineapple', price: 100 },
        ],
      },
      {
        categoryId: pizzas._id,
        name: 'Garden Veggie Pizza',
        slug: 'garden-veggie-pizza',
        description: 'Fresh zucchini, sun-dried tomatoes, spinach, olives, feta cheese, and pesto on a thin crispy base.',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
        dietaryTag: 'vegan',
        preparationMinutes: 20,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Vegan Cheese', price: 200 },
          { name: 'Extra Pesto', price: 150 },
        ],
      },

      // ── PASTA ────────────────────────────────────────────────────────────
      {
        categoryId: pasta._id,
        name: 'Spaghetti Bolognese',
        slug: 'spaghetti-bolognese',
        description: 'Slow-cooked beef ragù with San Marzano tomatoes, red wine, and fresh herbs over al dente spaghetti.',
        price: 1249,
        imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80',
        dietaryTag: 'non-vegetarian',
        preparationMinutes: 20,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Parmesan Top', price: 150 },
          { name: 'Garlic Bread', price: 199 },
        ],
      },
      {
        categoryId: pasta._id,
        name: 'Penne Arrabbiata',
        slug: 'penne-arrabbiata',
        description: 'Spicy tomato sauce with garlic, red chili, and fresh parsley tossed with penne. Simply delicious.',
        price: 1099,
        imageUrl: 'https://images.unsplash.com/photo-1603729362753-f8162ac6c3df?w=800&q=80',
        dietaryTag: 'vegan',
        preparationMinutes: 15,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Vegan Parmesan', price: 150 },
        ],
      },
      {
        categoryId: pasta._id,
        name: 'Creamy Mushroom Fettuccine',
        slug: 'creamy-mushroom-fettuccine',
        description: 'Wild mushrooms, cream, garlic, white wine, and Parmesan over silky fettuccine. Indulgence on a plate.',
        price: 1349,
        imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
        dietaryTag: 'vegetarian',
        preparationMinutes: 18,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Truffle Oil', price: 250 },
          { name: 'Grilled Chicken', price: 300 },
        ],
      },

      // ── DRINKS ───────────────────────────────────────────────────────────
      {
        categoryId: drinks._id,
        name: 'Mango Passion Smoothie',
        slug: 'mango-passion-smoothie',
        description: 'Fresh mango, passion fruit, and coconut water blended to perfection. Tropical bliss in a glass.',
        price: 599,
        imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80',
        dietaryTag: 'vegan',
        preparationMinutes: 5,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Chia Seeds', price: 75 },
          { name: 'Protein Boost', price: 150 },
        ],
      },
      {
        categoryId: drinks._id,
        name: 'Classic Lemonade',
        slug: 'classic-lemonade',
        description: 'Freshly squeezed lemons with a hint of mint and sparkling water. Perfectly refreshing.',
        price: 449,
        imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80',
        dietaryTag: 'vegan',
        preparationMinutes: 5,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Extra Mint', price: 50 },
          { name: 'Sparkling Water', price: 100 },
        ],
      },
      {
        categoryId: drinks._id,
        name: 'Iced Caramel Latte',
        slug: 'iced-caramel-latte',
        description: 'Double-shot espresso, caramel syrup, whole milk, and ice. The perfect pick-me-up any time of day.',
        price: 549,
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
        dietaryTag: 'none',
        preparationMinutes: 5,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Extra Shot', price: 100 },
          { name: 'Oat Milk', price: 75 },
          { name: 'Whipped Cream', price: 75 },
        ],
      },

      // ── DESSERTS ─────────────────────────────────────────────────────────
      {
        categoryId: desserts._id,
        name: 'Warm Chocolate Lava Cake',
        slug: 'warm-chocolate-lava-cake',
        description: 'Decadent dark chocolate cake with a molten centre, served with vanilla bean ice cream and fresh berries.',
        price: 799,
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
        dietaryTag: 'vegetarian',
        preparationMinutes: 15,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Extra Ice Cream', price: 200 },
          { name: 'Berry Compote', price: 150 },
        ],
      },
      {
        categoryId: desserts._id,
        name: 'New York Cheesecake',
        slug: 'new-york-cheesecake',
        description: 'Classic baked cheesecake on a buttery graham cracker crust, topped with fresh strawberry coulis.',
        price: 699,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
        dietaryTag: 'vegetarian',
        preparationMinutes: 5,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Blueberry Topping', price: 150 },
          { name: 'Whipped Cream', price: 100 },
        ],
      },

      // ── SALADS ───────────────────────────────────────────────────────────
      {
        categoryId: salads._id,
        name: 'Caesar Salad',
        slug: 'caesar-salad',
        description: 'Crisp romaine lettuce, shaved Parmesan, house-made Caesar dressing, croutons, and a squeeze of lemon.',
        price: 899,
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80',
        dietaryTag: 'vegetarian',
        preparationMinutes: 10,
        isFeatured: false,
        isAvailable: true,
        addOns: [
          { name: 'Grilled Chicken', price: 300 },
          { name: 'Anchovies', price: 150 },
          { name: 'Extra Croutons', price: 75 },
        ],
      },
      {
        categoryId: salads._id,
        name: 'Greek Garden Salad',
        slug: 'greek-garden-salad',
        description: 'Cucumber, tomato, Kalamata olives, red onion, and feta cheese with oregano and a lemon-olive oil dressing.',
        price: 849,
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
        dietaryTag: 'vegetarian',
        preparationMinutes: 8,
        isFeatured: true,
        isAvailable: true,
        addOns: [
          { name: 'Extra Feta', price: 150 },
          { name: 'Hummus Side', price: 200 },
        ],
      },
    ]);

    console.log('🍔 Menu items seeded.');
    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────────');
    console.log('Admin credentials:');
    console.log('  Email: admin@tablecraft.com');
    console.log('  Password: admin123');
    console.log('─────────────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
