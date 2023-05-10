"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserMock = {
    findOne: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
};
exports.default = UserMock;
