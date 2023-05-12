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
var index_1 = __importDefault(require("../index")); // Import your Express app instance
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var incidentModel_1 = __importDefault(require("../models/incidentModel"));
var User_1 = __importDefault(require("../models/User")); // Import your User model
var path_1 = __importDefault(require("path"));
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
test('Should create an incident', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .post('/api/incident/createIncident')
                        .set('Authorization', "Bearer ".concat(token))
                        .field('name', 'Test Incident')
                        .field('address', '123 Test Street')
                        .field('description', 'This is a test incident.')
                        .field('lat', 40.25345)
                        .field('long', 45.345345)
                        .attach('image', path_1.default.resolve(__dirname, 'test-image.jpg'))
                    // Check the response status and incident properties
                ]; // Replace with the path to a test image file
            case 2:
                response = _a.sent() // Replace with the path to a test image file
                ;
                // Check the response status and incident properties
                expect(response.status).toBe(201);
                expect(response.body.name).toBe('Test Incident');
                expect(response.body.address).toBe('123 Test Street');
                expect(response.body.description).toBe('This is a test incident.');
                expect(response.body.imagePath).toBeTruthy();
                // Clean up the test incident
                return [4 /*yield*/, incidentModel_1.default.findByIdAndDelete(response.body._id)];
            case 3:
                // Clean up the test incident
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Should get an incident by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
    var testIncident, existingUser, token, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                testIncident = new incidentModel_1.default({
                    name: 'Test Incident',
                    address: '123 Test Street',
                    description: 'This is a test incident.',
                    imagePath: 'https://example.com/test-image.jpg',
                    lat: 40.25345,
                    long: 45.345345,
                });
                return [4 /*yield*/, testIncident.save()];
            case 1:
                _a.sent();
                existingUser = new User_1.default({
                    name: 'Existing User',
                    contactNumber: '0987654321',
                    email: 'test@example.com',
                    role: 'admin',
                    username: 'existinguser',
                    password: 'existingpassword',
                });
                return [4 /*yield*/, existingUser.save()];
            case 2:
                _a.sent();
                token = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });
                return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .get("/api/incident/".concat(testIncident._id))
                        .set('Authorization', "Bearer ".concat(token))];
            case 3:
                response = _a.sent();
                // Check the response status and incident properties
                expect(response.status).toBe(200);
                expect(response.body._id).toBe(testIncident._id.toString());
                expect(response.body.name).toBe('Test Incident');
                expect(response.body.address).toBe('123 Test Street');
                expect(response.body.description).toBe('This is a test incident.');
                expect(response.body.imagePath).toBe('https://example.com/test-image.jpg');
                expect(response.body.lat).toBe(40.25345);
                expect(response.body.long).toBe(45.345345);
                // Clean up the test incident and user
                return [4 /*yield*/, incidentModel_1.default.findByIdAndDelete(testIncident._id)];
            case 4:
                // Clean up the test incident and user
                _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndDelete(existingUser._id)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Should get all incidents based on user role', function () { return __awaiter(void 0, void 0, void 0, function () {
    var testIncident1, testIncident2, existingUser, token, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                testIncident1 = new incidentModel_1.default({
                    name: 'Test Incident 1',
                    address: '123 Test Street',
                    description: 'This is a test incident 1.',
                    imagePath: 'https://example.com/test-image1.jpg',
                    lat: 40.25345,
                    long: 45.345345,
                    status: true
                });
                return [4 /*yield*/, testIncident1.save()];
            case 1:
                _a.sent();
                testIncident2 = new incidentModel_1.default({
                    name: 'Test Incident 2',
                    address: '456 Test Street',
                    description: 'This is a test incident 2.',
                    imagePath: 'https://example.com/test-image2.jpg',
                    lat: 41.25345,
                    long: 46.345345,
                    status: false
                });
                return [4 /*yield*/, testIncident2.save()];
            case 2:
                _a.sent();
                existingUser = new User_1.default({
                    name: 'Existing User',
                    contactNumber: '0987654321',
                    email: 'test@example.com',
                    role: 'admin',
                    username: 'existinguser',
                    password: 'existingpassword',
                });
                return [4 /*yield*/, existingUser.save()];
            case 3:
                _a.sent();
                token = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });
                return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .get('/api/incident/getAllIncidents')
                        .set('Authorization', "Bearer ".concat(token))
                        .send({ user: existingUser.role })];
            case 4:
                response = _a.sent();
                // Check the response status and incidents array
                expect(response.status).toBe(200);
                expect(response.body.incidents).toHaveLength(2);
                expect(response.body.incidents[0]._id).toBe(testIncident1._id.toString());
                expect(response.body.incidents[0].name).toBe('Test Incident 1');
                expect(response.body.incidents[1]._id).toBe(testIncident2._id.toString());
                expect(response.body.incidents[1].name).toBe('Test Incident 2');
                // Clean up the test incidents and user
                return [4 /*yield*/, incidentModel_1.default.findByIdAndDelete(testIncident1._id)];
            case 5:
                // Clean up the test incidents and user
                _a.sent();
                return [4 /*yield*/, incidentModel_1.default.findByIdAndDelete(testIncident2._id)];
            case 6:
                _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndDelete(existingUser._id)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Should delete an incident by its ID', function () { return __awaiter(void 0, void 0, void 0, function () {
    var testIncident, existingUser, token, response, deletedIncident;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                testIncident = new incidentModel_1.default({
                    name: 'Test Incident',
                    address: '123 Test Street',
                    description: 'This is a test incident.',
                    imagePath: 'https://example.com/test-image.jpg',
                    lat: 40.25345,
                    long: 45.345345,
                    status: true
                });
                return [4 /*yield*/, testIncident.save()];
            case 1:
                _a.sent();
                existingUser = new User_1.default({
                    name: 'Existing User',
                    contactNumber: '0987654321',
                    email: 'test@example.com',
                    role: 'admin',
                    username: 'existinguser',
                    password: 'existingpassword',
                });
                return [4 /*yield*/, existingUser.save()];
            case 2:
                _a.sent();
                token = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });
                return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .delete('/api/incident/deleteIncidentByID')
                        .set('Authorization', "Bearer ".concat(token))
                        .send({ incidentID: testIncident._id })];
            case 3:
                response = _a.sent();
                // Check the response status and message
                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Incident deleted successfully.');
                return [4 /*yield*/, incidentModel_1.default.findById(testIncident._id)];
            case 4:
                deletedIncident = _a.sent();
                expect(deletedIncident).toBeNull();
                // Clean up the existing user
                return [4 /*yield*/, User_1.default.findByIdAndDelete(existingUser._id)];
            case 5:
                // Clean up the existing user
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Should update incident status', function () { return __awaiter(void 0, void 0, void 0, function () {
    var testIncident, existingUser, token, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                testIncident = new incidentModel_1.default({
                    // ...incident properties
                    name: 'Test Incident',
                    address: '123 Test Street',
                    description: 'This is a test incident.',
                    imagePath: 'https://example.com/test-image.jpg',
                    lat: 40.25345,
                    long: 45.345345,
                    status: true
                });
                return [4 /*yield*/, testIncident.save()];
            case 1:
                _a.sent();
                existingUser = new User_1.default({
                    // ...user properties
                    name: 'Existing User',
                    contactNumber: '0987654321',
                    email: 'test@example.com',
                    role: 'admin',
                    username: 'existinguser',
                    password: 'existingpassword',
                });
                return [4 /*yield*/, existingUser.save()];
            case 2:
                _a.sent();
                token = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });
                return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .patch('/api/incident/updateIncidentStatus')
                        .set('Authorization', "Bearer ".concat(token))
                        .send({ incidentID: testIncident._id })];
            case 3:
                response = _a.sent();
                // Check the response status and message
                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Incident status updated successfully');
                // Verify the incident status has been updated
                // const updatedIncident = await Incident.findById(testIncident._id);
                // expect(updatedIncident.status).toBe(true);
                // Clean up the test incident and existing user
                return [4 /*yield*/, incidentModel_1.default.findByIdAndDelete(testIncident._id)];
            case 4:
                // Verify the incident status has been updated
                // const updatedIncident = await Incident.findById(testIncident._id);
                // expect(updatedIncident.status).toBe(true);
                // Clean up the test incident and existing user
                _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndDelete(existingUser._id)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('Should update incident flag', function () { return __awaiter(void 0, void 0, void 0, function () {
    var testIncident, existingUser, token, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                testIncident = new incidentModel_1.default({
                    // ...incident properties
                    name: 'Test Incident',
                    address: '123 Test Street',
                    description: 'This is a test incident.',
                    imagePath: 'https://example.com/test-image.jpg',
                    lat: 40.25345,
                    long: 45.345345,
                    status: true
                });
                return [4 /*yield*/, testIncident.save()];
            case 1:
                _a.sent();
                existingUser = new User_1.default({
                    // ...user properties
                    name: 'Existing User',
                    contactNumber: '0987654321',
                    email: 'test@example.com',
                    role: 'admin',
                    username: 'existinguser',
                    password: 'existingpassword',
                });
                return [4 /*yield*/, existingUser.save()];
            case 2:
                _a.sent();
                token = jsonwebtoken_1.default.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });
                return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .patch('/api/incident/updateIncidentFlag')
                        .set('Authorization', "Bearer ".concat(token))
                        .send({ incidentID: testIncident._id, flag: 'green' })];
            case 3:
                response = _a.sent();
                // Check the response status and message
                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Incident updated successfully');
                // Verify the incident flag has been updated
                // const updatedIncident = await Incident.findById(testIncident._id);
                // expect(updatedIncident.flag).toBe('green');
                // Clean up the test incident and existing user
                return [4 /*yield*/, incidentModel_1.default.findByIdAndDelete(testIncident._id)];
            case 4:
                // Verify the incident flag has been updated
                // const updatedIncident = await Incident.findById(testIncident._id);
                // expect(updatedIncident.flag).toBe('green');
                // Clean up the test incident and existing user
                _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndDelete(existingUser._id)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
