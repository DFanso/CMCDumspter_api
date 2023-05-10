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
var supertest_1 = __importDefault(require("supertest"));
var index_1 = require("../index"); // You should export your app instance from your main application file
var User_1 = __importDefault(require("../models/User"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mailer_1 = require("../utils/mailer");
var crypto_1 = __importDefault(require("crypto"));
jest.mock('../utils/mailer', function () { return ({
    sendEmail: jest.fn(),
}); });
// Make sure to clear the database before each test
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User_1.default.deleteMany({})];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe('User Controller', function () {
    test('Should sign up a new user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/signup').send({
                        name: 'Test User',
                        contactNumber: '1234567890',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'testuser',
                        password: 'testpassword',
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(201);
                    expect(response.body.message).toBe('User created successfully');
                    expect(response.body.token).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    test('Should not sign up a user with an existing email', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = new User_1.default({
                        name: 'Existing User',
                        contactNumber: '0987654321',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'existinguser',
                        password: 'existingpassword',
                    });
                    return [4 /*yield*/, existingUser.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/signup').send({
                            name: 'Test User',
                            contactNumber: '1234567890',
                            email: 'test@example.com',
                            role: 'admin',
                            username: 'testuser',
                            password: 'testpassword',
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body.message).toBe('Email is already in use.');
                    return [2 /*return*/];
            }
        });
    }); });
    //tests for sign in 
    test('Should sign in an existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = new User_1.default({
                        name: 'Existing User',
                        contactNumber: '0987654321',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'existinguser',
                        password: 'existingpassword',
                    });
                    return [4 /*yield*/, existingUser.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/signin').send({
                            username: 'existinguser',
                            password: 'existingpassword',
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe('Logged in successfully');
                    expect(response.body.token).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    test('Should not sign in a user with an invalid username', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/signin').send({
                        username: 'nonexistentuser',
                        password: 'wrongpassword',
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body.message).toBe('Invalid username or password.');
                    return [2 /*return*/];
            }
        });
    }); });
    test('Should not sign in a user with an invalid password', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = new User_1.default({
                        name: 'Existing User',
                        contactNumber: '0987654321',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'existinguser',
                        password: 'existingpassword',
                    });
                    return [4 /*yield*/, existingUser.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/signin').send({
                            username: 'existinguser',
                            password: 'wrongpassword',
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body.message).toBe('Invalid username or password.');
                    return [2 /*return*/];
            }
        });
    }); });
    //getuserProfile
    test('Should get user profile for an existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, token, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = new User_1.default({
                        name: 'Existing User',
                        contactNumber: '0987654321',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'existinguser',
                        password: 'existingpassword',
                    });
                    return [4 /*yield*/, existingUser.save()];
                case 1:
                    _a.sent();
                    token = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, {
                        expiresIn: '1d',
                    });
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app)
                            .get('/api/auth/profile')
                            .set('Authorization', "Bearer ".concat(token))];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.name).toBe(existingUser.name);
                    expect(response.body.email).toBe(existingUser.email);
                    expect(response.body.username).toBe(existingUser.username);
                    return [2 /*return*/];
            }
        });
    }); });
    test('Should not get user profile for a non-existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nonExistingUserId, token, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nonExistingUserId = '60c7f3efb47d2d2f4ca4f3a9';
                    token = jsonwebtoken_1.default.sign({ id: nonExistingUserId, email: 'nonexistent@example.com' }, process.env.JWT_SECRET, {
                        expiresIn: '1d',
                    });
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app)
                            .get('/api/auth/profile')
                            .set('Authorization', "Bearer ".concat(token))];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(404);
                    expect(response.body.message).toBe('User not found.');
                    return [2 /*return*/];
            }
        });
    }); });
    //forgot password test
    test('Should send a password reset email for an existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = new User_1.default({
                        name: 'Existing User',
                        contactNumber: '0987654321',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'existinguser',
                        password: 'existingpassword',
                    });
                    return [4 /*yield*/, existingUser.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/forgot-password').send({
                            email: 'test@example.com',
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe('Password reset email sent.');
                    // Check if sendEmail was called
                    expect(mailer_1.sendEmail).toHaveBeenCalledWith('test@example.com', 'Password Reset', expect.stringContaining('<h1>Password Reset</h1>'));
                    return [2 /*return*/];
            }
        });
    }); });
    test('Should not send a password reset email for a non-existing user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/forgot-password').send({
                        email: 'nonexistent@example.com',
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(404);
                    expect(response.body.error.message).toBe('User not found.');
                    return [2 /*return*/];
            }
        });
    }); });
    //password reset tests
    test('Should reset the password for an existing user with a valid reset code', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, resetCode, newPassword, response, updatedUser, isMatch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = new User_1.default({
                        name: 'Existing User',
                        contactNumber: '0987654321',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'existinguser',
                        password: 'existingpassword',
                    });
                    resetCode = crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
                    existingUser.passwordResetToken = resetCode;
                    existingUser.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
                    return [4 /*yield*/, existingUser.save()];
                case 1:
                    _a.sent();
                    newPassword = 'newpassword';
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/reset-password').send({
                            resetCode: resetCode,
                            newPassword: newPassword,
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, User_1.default.findById(existingUser._id)];
                case 3:
                    updatedUser = _a.sent();
                    return [4 /*yield*/, updatedUser.comparePassword(newPassword)];
                case 4:
                    isMatch = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body.message).toBe('Password has been reset.');
                    expect(isMatch).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    test('Should not reset the password for an existing user with an invalid or expired reset code', function () { return __awaiter(void 0, void 0, void 0, function () {
        var existingUser, invalidResetCode, newPassword, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingUser = new User_1.default({
                        name: 'Existing User',
                        contactNumber: '0987654321',
                        email: 'test@example.com',
                        role: 'admin',
                        username: 'existinguser',
                        password: 'existingpassword',
                    });
                    return [4 /*yield*/, existingUser.save()];
                case 1:
                    _a.sent();
                    invalidResetCode = 'INVALID';
                    newPassword = 'newpassword';
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.app).post('/api/auth/reset-password').send({
                            resetCode: invalidResetCode,
                            newPassword: newPassword,
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(400);
                    expect(response.body.error.message).toBe('Password reset code is invalid or has expired.');
                    return [2 /*return*/];
            }
        });
    }); });
    // You can write additional tests for other controller functions like signIn, getUserProfile, forgotPassword, and resetPassword
    // ...
});
