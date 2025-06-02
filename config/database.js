const mongoose = require('mongoose');

class Database {
    static async connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('✅ MongoDB connected successfully');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('📴 MongoDB disconnected');
        } catch (error) {
            console.error('❌ MongoDB disconnect error:', error);
        }
    }

    static getConnectionStatus() {
        return mongoose.connection.readyState;
    }
}

module.exports = Database; 