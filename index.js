import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/insertbook", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/delbook/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

/* app.put("/updatebook/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values,bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
}); */
app.put("/updatebook/:id", (req, res) => {
  const bookId = req.params.id;
  const fieldsToUpdate = {};
  const values = [];

  // Verifica quais campos foram enviados na requisição e adiciona ao objeto fieldsToUpdate
  if (req.body.title) {
    fieldsToUpdate.title = req.body.title;
    values.push(req.body.title);
  }
  if (req.body.desc) {
    fieldsToUpdate.desc = req.body.desc;
    values.push(req.body.desc);
  }
  if (req.body.price) {
    fieldsToUpdate.price = req.body.price;
    values.push(req.body.price);
  }
  if (req.body.cover) {
    fieldsToUpdate.cover = req.body.cover;
    values.push(req.body.cover);
  }

  // Constrói a consulta SQL dinamicamente
  let query = "UPDATE books SET ";
  const fields = Object.keys(fieldsToUpdate);
  fields.forEach((field, index) => {
    query += `\`${field}\` = ?`;
    if (index < fields.length - 1) {
      query += ", ";
    }
  });
  query += " WHERE id = ?";

  values.push(bookId);

  // Executa a consulta SQL
  db.query(query, values, (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});