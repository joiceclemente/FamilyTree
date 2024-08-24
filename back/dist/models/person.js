"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const counterSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
});
const Counter = mongoose_1.default.model('Counter', counterSchema);
const personSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    id: {
        type: Number,
        unique: true,
    },
    partnerId: {
        type: Number,
        default: null,
    },
    fatherId: {
        type: Number,
        default: null,
    },
    motherId: {
        type: Number,
        default: null,
    }
});
personSchema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate({ name: 'personId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
            if (!counter) {
                console.error('Counter not found or not updated');
                throw new Error('Counter not found or not updated');
            }
            doc.id = counter.value;
            console.log('Generated ID:', doc.id);
        }
        catch (error) {
            console.error('Error in pre-save middleware:', error);
            return next(error);
        }
    }
    next();
});
personSchema.methods.toJSON = function () {
    const obj = this.toObject();
    if (obj.partnerId && obj.partnerId instanceof mongoose_1.default.Types.ObjectId) {
        obj.partnerId = obj.partnerId.toHexString();
    }
    if (obj.fatherId && obj.fatherId instanceof mongoose_1.default.Types.ObjectId) {
        obj.fatherId = obj.fatherId.toHexString();
    }
    if (obj.motherId && obj.motherId instanceof mongoose_1.default.Types.ObjectId) {
        obj.motherId = obj.motherId.toHexString();
    }
    return obj;
};
const Person = mongoose_1.default.model('Person', personSchema);
exports.Person = Person;
