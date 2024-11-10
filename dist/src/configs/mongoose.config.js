"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importing Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @createdBy Kavin Nishanthan P D
 * @createdAt 2024-09-02
 * @description This function is used to handle MongoDB Connection
 */
const handleMongoDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('hai');
        mongoose_1.default.set('strictQuery', false);
        const res = yield mongoose_1.default.connect(process.env.MONGOURI || '');
        console.log(`⚡️[MongoDB] - Connected: ${new Date().toDateString()} / ${new Date().toLocaleTimeString()}`);
        return res;
    }
    catch (err) {
        console.log('MongoDB Error: ', err);
    }
});
exports.default = handleMongoDBConnection;
