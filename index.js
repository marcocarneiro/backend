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

//READ
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

//CREATE
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

//DELETE
app.delete("/delbook/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//UPDATE
app.put("/updatebook/:id", (req, res) => {
  const bookId = req.params.id;
  const fieldsToUpdate = {};
  const values = [];

  // Definir os campos que podem ser atualizados
  const allowedFields = ['title', 'desc', 'price', 'cover'];

  // Percorrer as chaves do objeto req.body e verificar se elas estão presentes nos campos permitidos
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      fieldsToUpdate[key] = req.body[key];
      values.push(req.body[key]);
    }
  });

  // Construir a consulta SQL dinamicamente
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

  // Executar a consulta SQL
  db.query(query, values, (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});


app.listen(8800, () => {
  console.log("Connected to backend.");
});