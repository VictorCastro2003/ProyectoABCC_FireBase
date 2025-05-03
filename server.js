// server.js

const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa Firebase Admin SDK
const serviceAccount = require('./firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const alumnosCollection = db.collection('alumnos');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // sirve HTML desde /public

// Rutas CRUD

// Obtener todos
app.get('/alumnos', async (req, res) => {
  const snapshot = await alumnosCollection.get();
  const alumnos = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  res.json(alumnos);
});

// Obtener uno
app.get('/alumnos/:id', async (req, res) => {
  const doc = await alumnosCollection.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Alumno no encontrado' });
  res.json({ _id: doc.id, ...doc.data() });
});

// Crear
app.post('/alumnos', async (req, res) => {
  const newDoc = await alumnosCollection.add(req.body);
  res.json({ _id: newDoc.id });
});

// Actualizar
app.put('/alumnos/:id', async (req, res) => {
  await alumnosCollection.doc(req.params.id).update(req.body);
  res.json({ success: true });
});

// Eliminar
app.delete('/alumnos/:id', async (req, res) => {
  await alumnosCollection.doc(req.params.id).delete();
  res.json({ success: true });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

