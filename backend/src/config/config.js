const env = process.env.NODE_ENV;

if (env !== 'production') {
	require('dotenv').config();
}

const config = {
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	host: process.env.DB_HOST,
	dialect: 'postgres',
	port: 5432,
	ssl: true,
};

if (env === 'production') {
	config.dialectOptions = {
		ssl: {
			rejectUnauthorized: false,
		},
	};
}

module.exports = config;
