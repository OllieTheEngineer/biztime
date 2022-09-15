/** Database setup for BizTime. */

const { client } = require("pg");

const client = new cLIENT ({
    connectString: "postgresql:///biztime"
});

client.connect();

module.exports = client;
