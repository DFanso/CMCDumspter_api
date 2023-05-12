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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getUserProfile = exports.signIn = exports.signUp = void 0;
var User_1 = __importDefault(require("../models/User"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var crypto_1 = __importDefault(require("crypto"));
var mailer_1 = require("../utils/mailer");
var generateToken = function (user) {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};
var signUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, contactNumber, email, role, username, password, address, existingUser, newUser, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, contactNumber = _a.contactNumber, email = _a.email, role = _a.role, username = _a.username, password = _a.password, address = _a.address;
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ message: 'Email is already in use.' })];
                }
                newUser = new User_1.default({ name: name_1, contactNumber: contactNumber, email: email, role: role, username: username, password: password, address: address });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _b.sent();
                res.status(201).json({
                    message: 'User created successfully',
                    token: generateToken(newUser),
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                next({ status: 400, message: 'Error during signup.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
var signIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, role, user, isMatch, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, password = _a.password, role = _a.role;
                return [4 /*yield*/, User_1.default.findOne({ username: username })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid username or password.' })];
                }
                if (role !== (user === null || user === void 0 ? void 0 : user.role)) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid role SignIn' })];
                }
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid username or password.' })];
                }
                res.json({
                    message: 'Logged in successfully',
                    token: generateToken(user),
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                next({ status: 400, message: 'Error during signin.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signIn = signIn;
var getUserProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById(req.body.id).select('-password -passwordResetToken -passwordResetExpires')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found.' })];
                }
                res.status(200).json(user);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).json({ message: 'Error fetching user profile.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserProfile = getUserProfile;
var forgotPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetCode, message, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next({ status: 404, message: 'User not found.' })];
                }
                resetCode = crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
                user.passwordResetToken = resetCode;
                user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                message = "\n    <h1>Password Reset</h1>\n    <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>\n    <p>Please use the following code to reset your password within one hour of receiving it:</p>\n    <h2>".concat(resetCode, "</h2>\n    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>\n    ");
                return [4 /*yield*/, (0, mailer_1.sendEmail)(user.email, 'Password Reset', message)];
            case 4:
                _a.sent();
                res.status(200).json({ message: 'Password reset email sent.' });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.error('Error sending the password reset email:', error_2);
                next({ status: 500, message: 'Error sending the password reset email.' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, resetCode, newPassword, user, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, resetCode = _a.resetCode, newPassword = _a.newPassword;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({
                        passwordResetToken: resetCode,
                        passwordResetExpires: { $gt: Date.now() },
                    })];
            case 2:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next({ status: 400, message: 'Password reset code is invalid or has expired.' })];
                }
                user.password = newPassword;
                user.passwordResetToken = "";
                user.passwordResetExpires = new Date();
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                res.status(200).json({ message: 'Password has been reset.' });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                next({ status: 500, message: 'Error resetting the password.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
