"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var errorMiddleware = function (err, req, res, next) {
    var status = err.status || 500;
    var message = err.message || 'Something went wrong';
    res.status(status).send({
        error: {
            status: status,
            message: message,
        },
    });
};
exports.errorMiddleware = errorMiddleware;
