const { connect } = require("../../database");
const { createTableClients } = require("./create-table-clients");
const { createTableUsers } = require("./create-table-users");

const runMigrations = async () => {
  const connection = await connect();

  try {
    await connection.exec(createTableUsers);
    await connection.exec(createTableClients);
  } catch (error) {
    console.error("Error in migrations => ", error);
  }
};

module.exports = runMigrations;
