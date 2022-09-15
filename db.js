/** Database setup for BizTime. */

const { Client } = require("pg");

const client = new Client ({
    connectString: "postgresql:///biztime"
});

client.connect();

module.exports = client;
