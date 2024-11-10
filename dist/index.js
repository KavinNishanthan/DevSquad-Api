"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing env variables
require("dotenv/config");
// Importing packages
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Importing configs
const index_1 = __importDefault(require("./src/routes/index"));
const mongoose_config_1 = __importDefault(require("./src/configs/mongoose.config"));
const app = (0, express_1.default)();
const port = process.env.PORT;
(0, mongoose_config_1.default)();
app.use((0, cors_1.default)({
    // origin: ['http://localhost:3000', 'http://localhost:5173'],
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', index_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port} - ${new Date().toDateString()} / ${new Date().toLocaleTimeString()}`);
});
