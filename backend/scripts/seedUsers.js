require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sports_platform');

        const hashedPassword = await bcrypt.hash('password123', 10);

        const admin = await User.findOneAndUpdate(
            { email: 'admin@pdeu.ac.in' },
            { 
               name: 'System Admin', 
               email: 'admin@pdeu.ac.in',
               password: hashedPassword,
               phone: '1234567890',
               role: 'admin',
               gender: 'Other',
               status: 'approved',
               university_name: 'PDEU',
               roll_no: 'SYSADMIN01'
            },
            { upsert: true, returnDocument: 'after' }
        );

        const manager = await User.findOneAndUpdate(
            { email: 'manager@pdeu.ac.in' },
            { 
               name: 'Sports Manager', 
               email: 'manager@pdeu.ac.in',
               password: hashedPassword,
               phone: '0987654321',
               role: 'manager',
               gender: 'Other',
               status: 'approved',
               university_name: 'PDEU',
               roll_no: 'SYSMGR01'
            },
            { upsert: true, returnDocument: 'after' }
        );

        console.log("✅ Admin & Manager created successfully.");
        console.log("Admin Email:", admin.email);
        console.log("Manager Email:", manager.email);
        console.log("Password for both: password123");
        
        process.exit();
    } catch (error) {
        console.error("Error creating superusers:", error);
        process.exit(1);
    }
};

seedAdmins();
