import { mongo } from 'mongoose';

exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/blog-db-app';

const {DATABASE_URL} = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);