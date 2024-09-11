"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkillTrackSignature = void 0;
// Importing constants
const common_constant_1 = __importDefault(require("../constants/common.constant"));
const getSkillTrackSignature = (cookies) => {
    const skillTrackSignature = cookies
        .split(';')
        .find((cookie) => cookie.trim().startsWith(common_constant_1.default.signatureCookieName));
    return skillTrackSignature ? skillTrackSignature.split('=')[1] : null;
};
exports.getSkillTrackSignature = getSkillTrackSignature;
exports.default = {
    getSkillTrackSignature: exports.getSkillTrackSignature
};
