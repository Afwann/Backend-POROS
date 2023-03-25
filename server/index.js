const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connect");
const response = require("./response");

app.use(bodyParser.json());

//melihat seluruh buku
app.get("/book", (req, res) => {
  const sql = `select * from books`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    result.forEach((i) => {
      i.status == 1
        ? (i.status = "Selesai dibaca")
        : (i.status = "Sedang dibaca");
    });
    response(200, result, "Books list", res);
  });
});

//melihat seluruh buku berdasarkan id buku
app.get("/book/:id", (req, res) => {
  const id = req.params.id;
  const sql = `select * from books where id = ${id}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    result.forEach((i) => {
      i.status == 1
        ? (i.status = "Selesai dibaca")
        : (i.status = "Sedang dibaca");
    });
    response(200, result, "Book detail", res);
  });
});

//untuk menambah buku ke dalam database bookshelf
app.post("/book", (req, res) => {
  let {
    cover_image,
    title,
    genre,
    author,
    publisher,
    publication_year,
    total_pages,
    current_page,
  } = req.body;
  if (current_page > total_pages) {
    current_page = total_pages;
  }
  let status;
  if (current_page != total_pages) {
    status = 0;
  } else {
    status = 1;
  }
  const sql = `INSERT INTO books(cover_image, title, genre, author, publisher, publication_year, total_pages, current_page, status) values ('${cover_image}','${title}','${genre}','${author}','${publisher}',${publication_year}, ${total_pages}, ${current_page}, ${status})`;
  db.query(sql, (error, fields) => {
    if (error) response(500, "invalid", "ERROR", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
        status,
      };
      response(200, data, "Data Buku berhasil ditambahkan", res);
    } else {
      console.log("data tidak masuk");
    }
  });
});

//mengubah data buku berdasarkan id buku
app.put("/book", (req, res) => {
  const {
    id,
    cover_image,
    title,
    genre,
    author,
    publisher,
    publication_year,
    total_pages,
    current_page,
  } = req.body;
  if (current_page > total_pages) {
    current_page = total_pages;
  }
  let status;
  if (current_page != total_pages) {
    status = 0;
  } else {
    status = 1;
  }
  const sql = `UPDATE books SET cover_image = '${cover_image}', title = '${title}', genre='${genre}', author='${author}', publisher='${publisher}', publication_year=${publication_year}, total_pages=${total_pages},  current_page=${current_page}, status=${status} WHERE id = ${id}`;
  db.query(sql, (error, fields) => {
    if (error) response(500, "invalid", "ERROR", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
        status,
      };
      response(200, data, "Data buku berhasil diubah", res);
    } else {
      response(500, "Data tidak valid", "mungkin anda salah input", res);
    }
  });
});

//menghapus buku berdasarkan id buku
app.delete("/book", (req, res) => {
  const { id } = req.body;
  const sql = `DELETE FROM books WHERE id = ${id}`;
  db.query(sql, (error, fields) => {
    if (error) response(500, "invalid", "ERROR", res);
    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      };
      response(200, data, "Data buku berhasil dihapus", res);
    } else {
      response(
        500,
        "Data tidak ditemukan",
        "mungkin anda salah input atau data sudah dihapus",
        res
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
