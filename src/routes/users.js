const express = require("express");
const { connect } = require("../database/database");

const router = express.Router();

router.get("/", async (request, response) => {
  const { message } = request.session;

  try {
    const connection = await connect();

    const rows = await connection.all(
      `SELECT * FROM users ORDER BY created_at ASC`
    );

    return response.render("users", {
      message,
      users: rows
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/add", async (request, response) => {
  response.render("users_add");
});

router.post("/store", async (request, response) => {
  const { name, email, password } = request.body;
  let session = request.session;

  if (name != "" && email != "" && password != "") {
    try {
      const connection = await connect();

      const row = await connection.get(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
      );

      if (!row) {
        await connection.run(
          `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
          [name, email, password]
        );
        session.message = "Congratulations, created with successfully";
      } else {
        session.message = "There is already a user with this email";
      }
    } catch (error) {
      console.error(error);
      session.message = "Error when trying to register the user";
    }
  } else {
    session.message = "Please enter your data to register in the system";
  }

  response.redirect("/users");
});

router.get("/edit", async (request, response) => {
  const { id } = request.query;

  try {
    const connection = await connect();

    const row = await connection.get(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id]
    );

    return response.render("users_edit", {
      user: row
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/update", async (request, response) => {
  const { name, email, password, id } = request.body;
  let session = request.session;

  if (id != "" && name != "" && email != "" && password != "") {
    try {
      const connection = await connect();

      const row = await connection.get(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [id]
      );

      if (row) {
        await connection.run(
          `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
          [name, email, password, row.id]
        );

        session.message = "Congratulations, updated with successfully";
      } else {
        session.message = "User not found";
      }
    } catch (error) {
      console.error(error);
      session.message = "Error when trying saving user";
    }
  } else {
    session.message = "Please enter value to your user";
  }

  response.redirect("/users");
});

router.get("/del", async (request, response) => {
  let session = request.session;
  const { id } = request.query;

  try {
    const connection = await connect();

    await connection.run(`DELETE FROM users WHERE id = ?`, [id]);

    session.message = "User deleted";

    return response.redirect("/users");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
