const { Pool } = require('pg');
const path = require("path");

require('dotenv').config({ path: path.join(__dirname, '../../', '.env')});

const pool = new Pool({ connectionString: process.env.PG_CONNECTION });

const fetch = async (SQL, ...params) => {
	const client = await pool.connect()
	try {
		const { rows: [row] } = await client.query(SQL, params.length ? params : null)
		return row
	}
	finally {
		client.release()
	}
}

const fetchAll = async (SQL, ...params) => {
	const client = await pool.connect()
	try {
		const { rows } = await client.query(SQL, params.length ? params : null)
		return rows
	}
	finally {
		client.release()
	}
}

module.exports = {
    fetch,
    fetchAll
}