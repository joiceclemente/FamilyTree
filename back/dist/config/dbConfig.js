"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/familyTree';
        await mongoose_1.default.connect(mongoURI);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
