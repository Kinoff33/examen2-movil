const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examen_productos'
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Base de datos conectada');
  }
});
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});
app.post('/productos', (req, res) => {
  const {
    nombre,
    descripcion,
    precio,
    estado,
    categoria,
    foto
  } = req.body;
  db.query(
    'INSERT INTO productos (nombre, descripcion, precio, estado, categoria, foto) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, descripcion, precio, estado, categoria, foto],
    (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send('Producto creado');
      }
    }
  );
});
app.delete('/items/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Producto eliminado');
    }
  });
});
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
