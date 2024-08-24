"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const dbConfig_1 = require("./config/dbConfig");
const app = (0, express_1.default)();
(0, dbConfig_1.connectDB)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', router_1.default);
app.get('/', (req, res) => {
    res.send('Backend is running');
});
exports.default = app;
