const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URL;

if (!uri) {
    console.error('MONGO_URL is not defined in .env');
    process.exit(1);
}

const dbName = 'shopmate';

const products = [
    {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Premium wireless headphones with active noise cancellation and high-quality sound.',
        price: 7999,
        category: 'Electronics',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
    },
    {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable ergonomic office chair designed for long working hours.',
        price: 12999,
        category: 'Furniture',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80'
    },
    {
        name: 'Smart Fitness Watch',
        description: 'Smart fitness watch with health tracking, notifications and activity monitoring.',
        price: 4999,
        category: 'Electronics',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    },
    {
        name: 'Minimalist Backpack',
        description: 'Stylish and durable backpack suitable for college, office and travel.',
        price: 2499,
        category: 'Accessories',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
    },
    {
        name: 'Mechanical Keyboard',
        description: 'High-performance mechanical keyboard with responsive keys and RGB lighting.',
        price: 5999,
        category: 'Electronics',
        stock: 20,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
    },
    {
        name: 'Ceramic Coffee Mug Set',
        description: 'Elegant ceramic coffee mugs perfect for home and office use.',
        price: 999,
        category: 'Home',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight and comfortable running shoes designed for everyday workouts.',
        price: 3499,
        category: 'Footwear',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    },
    {
        name: 'Bamboo Cutting Board',
        description: 'Eco-friendly bamboo cutting board with a durable and smooth surface.',
        price: 799,
        category: 'Home',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80'
    },
    {
        name: 'Polarized Sunglasses',
        description: 'Stylish polarized sunglasses offering UV protection and comfortable vision.',
        price: 1999,
        category: 'Accessories',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'
    },
    {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with powerful sound and long battery life.',
        price: 2999,
        category: 'Electronics',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'
    }
];

async function seedDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();

        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('products');

        for (const product of products) {
            await collection.updateOne(
                { name: product.name },
                {
                    $set: {
                        ...product,
                        updatedAt: new Date()
                    },
                    $setOnInsert: {
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );

            console.log(`Processed: ${product.name}`);
        }

        const count = await collection.countDocuments();

        console.log('\n================================');
        console.log('Products seeded successfully!');
        console.log(`Products currently in database: ${count}`);
        console.log('Existing products were preserved.');
        console.log('================================');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

seedDatabase();