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
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'A user must have an email'],
        validate: [validator.isEmail, 'must have an email yh yh yh']
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'password must correlate'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'password are not the same',
        },
        select: false,
    },
    resetTokenProperty: {
        type: String,
    },
    resetTokenExpiresIn: {
        type: Date,
    },
    photo: {
        type: String,
        default: 'default.jpg',
        required: [false, 'must include a profile picture']
    },
    createdPasswordAt: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
// document middleware
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.createdPasswordAt = Date.now() - 1000;
    next();
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
        next();
    });
});
// query middleware
userSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: false });
    next();
});
userSchema.methods.correctPassword = function (loginPassword, dataBasePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(loginPassword, dataBasePassword);
    });
};
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
    const getMainTimeStamp = parseInt(this.createdPasswordAt.getTime() / 1000, 10);
    if (this.createdPasswordAt) {
        console.log(getMainTimeStamp, jwtTimeStamp, 'pena colastS');
        return jwtTimeStamp < getMainTimeStamp;
    }
    return false;
};
userSchema.methods.createNewTokenAndRetrieveToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetTokenProperty = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
    // console.log(resetToken, this.resetTokenProperty, 'jireh');
    return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
