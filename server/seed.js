const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');
require('dotenv').config();

const APCities = [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur",
    "Vizianagaram", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur",
    "Bhimavaram", "Madanapalle", "Guntakal", "Dharmavaram", "Gudivada", "Srikakulam", "Narasaraopet", "Tadipatri", "Tadepalligudem",
    "Amaravati", "Chilakaluripet", "Agraharam", "Kavali", "Jaggaiahpet", "Tuni", "Bapatla", "Amalapuram", "Srikalahasti", "Bobbili",
    "Sattenapalle", "Pithapuram", "Palasa Kasibugga", "Nuzvid", "Macherla", "Mandapeta", "Kandukur", "Samalkot", "Rayachoti", "Ponnur"
];

const titles = ["Spacious Family Home", "Cozy Apartment", "Luxury Villa", "Modern Flat", "Budget Friendly Room", "Premium Condo"];
const types = ["apartment", "house", "room"];
const images = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1628592102751-ba83b0314276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/househunt', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await Property.deleteMany({});
        await Booking.deleteMany({});
        console.log('Cleared existing data');

        // Create Users
        const owner = new User({
            name: 'Bob the Builder',
            email: 'owner@test.com',
            password: 'password123',
            role: 'owner',
            isApproved: true
        });
        await owner.save();

        const renter = new User({
            name: 'Alice Wonderland',
            email: 'renter@test.com',
            password: 'password123',
            role: 'renter'
        });
        await renter.save();

        await new User({
            name: 'Super Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        }).save();
        console.log('User Accounts Created');

        // Generate Properties for each city + extras
        let properties = [];

        // Generate Properties for general AP cities
        APCities.forEach(city => {
            const count = Math.floor(Math.random() * 2) + 1;
            generateProps(city, count);
        });

        // Boost Anantapur District
        const anantapurTowns = ["Anantapur", "Dharmavaram", "Hindupur", "Guntakal", "Tadipatri", "Kadiri", "Penukonda", "Puttaparthi", "Kalyandurg", "Rayadurg"];
        anantapurTowns.forEach(town => {
            generateProps(town, 3); // 3 properties per town
        });

        // Boost Tirupati District
        const tirupatiTowns = ["Tirupati", "Srikalahasti", "Gudur", "Sullurpeta", "Naidupeta", "Venkatagiri", "Chandragiri", "Renigunta", "Pileru", "Pakala"];
        tirupatiTowns.forEach(town => {
            generateProps(town, 3); // 3 properties per town
        });

        function generateProps(city, count) {
            for (let i = 0; i < count; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                const title = titles[Math.floor(Math.random() * titles.length)] + ' in ' + city;
                const rent = (Math.floor(Math.random() * 40) + 5) * 1000;
                const beds = Math.floor(Math.random() * 3) + 1;
                const img = images[Math.floor(Math.random() * images.length)];

                properties.push({
                    title: title,
                    description: `A lovely ${type} located in the heart of ${city}. Proximity to local landmarks.`,
                    location: city,
                    rent: rent,
                    bedrooms: beds,
                    type: type,
                    photos: [img],
                    owner: owner._id
                });
            }
        }

        const createdProperties = await Property.insertMany(properties);
        console.log(`Seeded ${createdProperties.length} properties across ${APCities.length} AP cities.`);

        // Create Bookings
        const bookings = [
            {
                property: createdProperties[0]._id,
                renter: renter._id,
                status: 'pending',
                message: 'Is this available?'
            },
            {
                property: createdProperties[5]._id,
                renter: renter._id,
                status: 'confirmed',
                message: 'Confirmed booking.'
            }
        ];
        await Booking.insertMany(bookings);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
