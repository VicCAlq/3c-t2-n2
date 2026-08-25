const express = require('express')
const path = require('path')
const cors = require('cors')
const sql = require('sqlite3').verbose()

const {
  porta,
  DB_NOME,
  TABELA_FONTES_NOME,
  TABELA_NOTICIAS_NOME
} = require('./env.js')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'src')))

const db = new sql.Database(`./${DB_NOME}`)

db.run(`
  CREATE TABLE IF NOT EXISTS ${TABELA_FONTES_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    endereco TEXT
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS ${TABELA_NOTICIAS_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    categoria TEXT,
    endereco TEXT,
    fonte_id INTEGER
  )
`)

app.get('/', (req, res) => {
  res.json({
    message: "Servidor funcionando"
  })
})

app.get('/api/noticias', (req, res) => {

  db.all(`
    SELECT noticias.*, fontes.nome AS fonte
    FROM noticias
    LEFT JOIN fontes
    ON noticias.fonte_id = fontes.id
  `, (erro, noticias) => {

    if (erro) {
      res.status(500).json({
        error: "Erro ao buscar noticias"
      })
      return
    }

    res.json(noticias)
  })
})

app.get('/api/noticias/categoria/:categoria', (req, res) => {

  const categoria = req.params.categoria

  db.all(`
    SELECT noticias.*, fontes.nome AS fonte
    FROM noticias
    LEFT JOIN fontes
    ON noticias.fonte_id = fontes.id
    WHERE categoria = ?
  `, [categoria], (erro, noticias) => {

    if (erro) {
      res.status(500).json({
        error: "Erro"
      })
      return
    }

    res.json(noticias)
  })
})

app.get('/api/noticias/fonte/:id', (req, res) => {

  const id = req.params.id

  db.all(`
    SELECT noticias.*, fontes.nome AS fonte
    FROM noticias
    LEFT JOIN fontes
    ON noticias.fonte_id = fontes.id
    WHERE fonte_id = ?
  `, [id], (erro, noticias) => {

    if (erro) {
      res.status(500).json({
        error: "Erro"
      })
      return
    }

    res.json(noticias)
  })
})

app.get('/api/fontes', (req, res) => {

  db.all(`
    SELECT * FROM fontes
  `, (erro, fontes) => {

    if (erro) {
      res.status(500).json({
        error: "Erro"
      })
      return
    }

    res.json(fontes)
  })
})

app.get('/api/fontes/cadastrar', (req, res) => {

  const { nome, endereco } = req.query

  if (!nome || !endereco) {
    res.status(400).json({
      error: "Preencha os campos"
    })
    return
  }

  db.run(`
    INSERT INTO fontes (nome, endereco)
    VALUES (?, ?)
  `, [nome, endereco], function(erro) {

    if (erro) {
      res.status(500).json({
        error: "Erro ao cadastrar"
      })
      return
    }

    res.json({
      message: "Fonte cadastrada",
      id: this.lastID
    })
  })
})

app.delete('/api/noticias/:id', (req, res) => {

  const id = req.params.id

  db.run(`
    DELETE FROM noticias
    WHERE id = ?
  `, [id], (erro) => {

    if (erro) {
      res.status(500).json({
        error: "Erro ao apagar"
      })
      return
    }

    res.json({
      message: "Noticia apagada"
    })
  })
})

app.delete('/api/fontes/:id', (req, res) => {

  const id = req.params.id

  db.run(`
    DELETE FROM fontes
    WHERE id = ?
  `, [id], (erro) => {

    if (erro) {
      res.status(500).json({
        error: "Erro ao apagar"
      })
      return
    }

    res.json({
      message: "Fonte apagada"
    })
  })
})


app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`)
});