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

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'src')))

const db = new sql.Database(`./${DB_NOME}`, (erro) => {
  if (erro) {
    console.error(
      `Erro ao abrir o banco de dados "${DB_NOME}":`,
      erro.message
    )
  } else {
    console.log(`Conectado ao banco de dados SQLite3 "${DB_NOME}"`)
  }
})


db.run(
  `CREATE TABLE IF NOT EXISTS ${TABELA_FONTES_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL
  )`,
  (erro) => {
    if (erro) {
      console.error(
        `Erro ao criar a tabela "${TABELA_FONTES_NOME}"`,
        erro.message
      )
    } else {
      console.log(`Tabela "${TABELA_FONTES_NOME}" pronta!`)
    }
  }
)


db.run(
  `CREATE TABLE IF NOT EXISTS ${TABELA_NOTICIAS_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    link TEXT,
    categoria TEXT,
    dataPublicacao TEXT,
    fonte_id INTEGER,
    FOREIGN KEY(fonte_id)
      REFERENCES ${TABELA_FONTES_NOME}(id)
  )`,
  (erro) => {
    if (erro) {
      console.error(
        `Erro ao criar a tabela "${TABELA_NOTICIAS_NOME}"`,
        erro.message
      )
    } else {
      console.log(`Tabela "${TABELA_NOTICIAS_NOME}" pronta!`)
    }
  }
)


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Acesso permitido',
    data: [],
    ok: true
  })
})



app.post('/api/fontes', (req, res) => {

  const { nome, endereco } = req.body

  if (!nome || !endereco) {
    return res.status(400).json({
      ok: false,
      message: 'Informe o nome e o endereço da fonte.'
    })
  }

  db.run(
    `INSERT INTO ${TABELA_FONTES_NOME}
    (nome, endereco)
    VALUES (?, ?)`,
    [nome, endereco],
    function (erro) {

      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })
      }

      res.status(201).json({
        ok: true,
        message: 'Fonte cadastrada com sucesso!',
        id: this.lastID
      })
    }
  )
})


app.get('/api/fontes', (req, res) => {

  db.all(
    `SELECT *
     FROM ${TABELA_FONTES_NOME}
     ORDER BY nome`,
    [],
    (erro, fontes) => {

      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })
      }

      res.json(fontes)
    }
  )
})



app.get('/api/noticias', (req, res) => {

  db.all(
    `SELECT
      noticias.id,
      noticias.titulo,
      noticias.descricao,
      noticias.link,
      noticias.categoria,
      noticias.dataPublicacao,
      noticias.fonte_id,
      fontes.nome AS fonte_nome
    FROM ${TABELA_NOTICIAS_NOME} AS noticias
    LEFT JOIN ${TABELA_FONTES_NOME} AS fontes
      ON noticias.fonte_id = fontes.id
    ORDER BY noticias.id DESC`,
    [],
    (erro, noticias) => {

      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })
      }

      res.json(noticias)
    }
  )
})



app.get('/api/noticias/categoria/:categoria', (req, res) => {

  const categoria = req.params.categoria

  db.all(
    `SELECT
      noticias.id,
      noticias.titulo,
      noticias.descricao,
      noticias.link,
      noticias.categoria,
      noticias.dataPublicacao,
      noticias.fonte_id,
      fontes.nome AS fonte_nome
    FROM ${TABELA_NOTICIAS_NOME} AS noticias
    LEFT JOIN ${TABELA_FONTES_NOME} AS fontes
      ON noticias.fonte_id = fontes.id
    WHERE noticias.categoria = ?
    ORDER BY noticias.id DESC`,
    [categoria],
    (erro, noticias) => {

      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })
      }

      res.json(noticias)
    }
  )
})



app.get('/api/noticias/fonte/:id', (req, res) => {

  const fonteId = req.params.id

  db.all(
    `SELECT
      noticias.id,
      noticias.titulo,
      noticias.descricao,
      noticias.link,
      noticias.categoria,
      noticias.dataPublicacao,
      noticias.fonte_id,
      fontes.nome AS fonte_nome
    FROM ${TABELA_NOTICIAS_NOME} AS noticias
    LEFT JOIN ${TABELA_FONTES_NOME} AS fontes
      ON noticias.fonte_id = fontes.id
    WHERE noticias.fonte_id = ?
    ORDER BY noticias.id DESC`,
    [fonteId],
    (erro, noticias) => {

      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })
      }

      res.json(noticias)
    }
  )
})


app.delete('/api/fontes/:id', (req, res) => {

  const id = req.params.id

  db.run(
    `DELETE FROM ${TABELA_FONTES_NOME}
     WHERE id = ?`,
    [id],
    function (erro) {

      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })
      }

      if (this.changes === 0) {
        return res.status(404).json({
          ok: false,
          message: 'Fonte não encontrada.'
        })
      }

      res.json({
        ok: true,
        message: 'Fonte apagada com sucesso!'
      })
    }
  )
})


app.delete('/api/noticias/:id', (req, res) => {

  const id = req.params.id

  db.run(
    `DELETE FROM ${TABELA_NOTICIAS_NOME}
     WHERE id = ?`,
    [id],
    function (erro) {

      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })
      }

      if (this.changes === 0) {
        return res.status(404).json({
          ok: false,
          message: 'Notícia não encontrada.'
        })
      }

      res.json({
        ok: true,
        message: 'Notícia apagada com sucesso!'
      })
    }
  )
})



app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`)
})