export class AllError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
        this.isOperational = true;
    }
}
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};
