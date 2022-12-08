const express = require("express");
const { connect } = require("../database/database");

const router = express.Router();

router.get("/", (request, response) => {
  const { message } = request.session;

  response.render("index", { layout: false, message });
});

router.get("/dashboard", async (request, response) => {
  try {
    const connection = await connect();

    const countClients = await connection.get(
      `SELECT count(id) as total FROM clients LIMIT 1`,
      [request.session.userid]
    );

    const countUsers = await connection.get(
      `SELECT count(id) as total FROM users LIMIT 1`,
      [request.session.userid]
    );

    return response.render("dashboard", {
      countClients: countClients?.total || 0,
      countUsers: countUsers?.total || 0
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
