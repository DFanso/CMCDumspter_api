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
exports.updateIncidentFlag = exports.updateIncidentStatus = exports.deleteIncidentByID = exports.getAllIncidents = exports.getIncidentById = exports.createIncident = void 0;
var incidentModel_1 = __importDefault(require("../models/incidentModel"));
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Set up AWS S3
var s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
var BUCKET_NAME = "cmcdumspter";
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var dir = "./images";
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, "".concat(Date.now(), "_").concat(file.originalname));
    },
});
var upload = (0, multer_1.default)({ storage: storage });
var uploadFileToS3 = function (filePath, key) {
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(filePath, function (err, data) {
            if (err) {
                return reject(err);
            }
            var params = {
                Bucket: BUCKET_NAME,
                Key: key,
                Body: data,
                ContentType: "image/jpeg", // Update the content type based on your image format
            };
            s3.upload(params, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data.Location);
            });
        });
    });
};
exports.createIncident = [
    upload.single("image"),
    function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, name_1, address, description, incident, savedIncident, newImagePath, s3URL, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, 5, 6]);
                    _a = req.body, name_1 = _a.name, address = _a.address, description = _a.description;
                    if (!req.file) {
                        return [2 /*return*/, res.status(400).json({ error: "No image file provided." })];
                    }
                    incident = new incidentModel_1.default({
                        name: name_1,
                        address: address,
                        description: description,
                        imagePath: req.file.path,
                    });
                    return [4 /*yield*/, incident.save()];
                case 1:
                    savedIncident = _b.sent();
                    newImagePath = path_1.default.join(path_1.default.dirname(savedIncident.imagePath), "".concat(savedIncident._id).concat(path_1.default.extname(savedIncident.imagePath)));
                    fs_1.default.renameSync(savedIncident.imagePath, newImagePath);
                    return [4 /*yield*/, uploadFileToS3(newImagePath, path_1.default.basename(newImagePath))];
                case 2:
                    s3URL = _b.sent();
                    savedIncident.imagePath = s3URL;
                    return [4 /*yield*/, incidentModel_1.default.findByIdAndUpdate(savedIncident._id, savedIncident)];
                case 3:
                    _b.sent();
                    res.status(201).json(savedIncident);
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _b.sent();
                    if (error_1 instanceof Error) {
                        res.status(500).json({ error: error_1.message });
                    }
                    // ...
                    if (error_1 instanceof Error) {
                        res.status(500).json({ error: error_1.message });
                    }
                    else {
                        res.status(500).json({ error: "An unknown error occurred." });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    // Clean up the local image file
                    if (req.file && fs_1.default.existsSync(req.file.path)) {
                        fs_1.default.unlinkSync(req.file.path);
                    }
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); },
];
// ... (the rest of your controller code)
var getIncidentById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var incident, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, incidentModel_1.default.findById(req.params.id)];
            case 1:
                incident = _a.sent();
                if (!incident) {
                    return [2 /*return*/, res.status(404).json({ error: "Incident not found." })];
                }
                res.status(200).json(incident);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                if (error_2 instanceof Error) {
                    res.status(500).json({ error: error_2.message });
                }
                else {
                    res.status(500).json({ error: "An unknown error occurred." });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getIncidentById = getIncidentById;
var getAllIncidents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, incidents, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                user = req.body.user;
                incidents = void 0;
                if (!(user === "admin" || user === "green_captain" || user === "GTF_Member")) return [3 /*break*/, 5];
                if (!(user === "GTF_Member")) return [3 /*break*/, 2];
                return [4 /*yield*/, incidentModel_1.default.find({ status: true })];
            case 1:
                incidents = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, incidentModel_1.default.find({})];
            case 3:
                incidents = _a.sent();
                _a.label = 4;
            case 4:
                res.status(200).json({ incidents: incidents });
                return [3 /*break*/, 6];
            case 5:
                res.status(401).json({ message: "Unauthorized access" });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                res.status(500).json({ message: "Error fetching incidents", error: error_3 });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getAllIncidents = getAllIncidents;
var deleteIncidentByID = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, incident, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.body.incidentID;
                if (!id) {
                    res.status(400).json({ message: "No document ID provided." });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, incidentModel_1.default.findByIdAndDelete(id)];
            case 1:
                incident = _a.sent();
                if (!incident) {
                    res.status(404).json({ message: "Incident not found." });
                    return [2 /*return*/];
                }
                res
                    .status(200)
                    .json({ message: "Incident deleted successfully.", data: incident });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({
                    message: "An error occurred while deleting the incident.",
                    error: error_4,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteIncidentByID = deleteIncidentByID;
var updateIncidentStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var incidentID, incident, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                incidentID = req.body.incidentID;
                if (!incidentID) {
                    return [2 /*return*/, res.status(400).json({ message: "incidentID is required" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, incidentModel_1.default.findByIdAndUpdate(incidentID, { status: true }, { new: true, runValidators: true })];
            case 2:
                incident = _a.sent();
                if (!incident) {
                    return [2 /*return*/, res.status(404).json({ message: "Incident not found" })];
                }
                res
                    .status(200)
                    .json({ message: "Incident status updated successfully", incident: incident });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).json({ message: "Error updating incident status", error: error_5 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateIncidentStatus = updateIncidentStatus;
var updateIncidentFlag = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, incidentID, flag, updateData, incident, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, incidentID = _a.incidentID, flag = _a.flag;
                if (!incidentID) {
                    return [2 /*return*/, res.status(400).json({ message: "incidentID is required" })];
                }
                if (!flag || !["green", "red"].includes(flag)) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Valid flag value ('green' or 'red') is required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                updateData = { flag: flag };
                return [4 /*yield*/, incidentModel_1.default.findByIdAndUpdate(incidentID, updateData, {
                        new: true,
                        runValidators: true,
                    })];
            case 2:
                incident = _b.sent();
                if (!incident) {
                    return [2 /*return*/, res.status(404).json({ message: "Incident not found" })];
                }
                res
                    .status(200)
                    .json({ message: "Incident updated successfully", incident: incident });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                res.status(500).json({ message: "Error updating incident", error: error_6 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateIncidentFlag = updateIncidentFlag;
