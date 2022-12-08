const express = require("express");
const { connect } = require("../database/database");

const router = express.Router();

router.get("/", async (request, response) => {
  const { message } = request.session;

  try {
    const connection = await connect();

    const rows = await connection.all(
      `SELECT * FROM clients ORDER BY created_at ASC`
    );

    return response.render("clients", {
      message,
      clients: rows
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/add", async (request, response) => {
  response.render("clients_add");
});

router.post("/store", async (request, response) => {
  const { name } = request.body;
  let session = request.session;

  if (name != "") {
    try {
      const connection = await connect();

      await connection.run(`INSERT INTO clients (name) VALUES (?)`, [name]);
      session.message = "Congratulations, created with successfully";
    } catch (error) {
      console.error(error);
      session.message = "Error when trying to register the client";
    }
  } else {
    session.message = "Please enter your data to register in the system";
  }

  response.redirect("/clients");
});

router.get("/edit", async (request, response) => {
  const { id } = request.query;

  try {
    const connection = await connect();

    const row = await connection.get(
      `SELECT * FROM clients WHERE id = ? LIMIT 1`,
      [id]
    );

    return response.render("clients_edit", {
      client: row
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/update", async (request, response) => {
  const { name, id } = request.body;
  let session = request.session;

  if (id != "" && name != "") {
    try {
      const connection = await connect();

      const row = await connection.get(
        `SELECT * FROM clients WHERE id = ? LIMIT 1`,
        [id]
      );

      if (row) {
        await connection.run(`UPDATE clients SET name = ? WHERE id = ?`, [
          name,
          row.id
        ]);

        session.message = "Congratulations, updated with successfully";
      } else {
        session.message = "Client not found";
      }
    } catch (error) {
      console.error(error);
      session.message = "Error when trying saving client";
    }
  } else {
    session.message = "Please enter value to your client";
  }

  response.redirect("/clients");
});

router.get("/del", async (request, response) => {
  let session = request.session;
  const { id } = request.query;

  try {
    const connection = await connect();

    await connection.run(`DELETE FROM clients WHERE id = ?`, [id]);

    session.message = "Client deleted";

    return response.redirect("/clients");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
