const express = require('express')
const path = require('path')
const cors = require('cors')
const sql = require('sqlite3').verbose()
const Parser = require('rss-parser')

const {
  porta,
  DB_NOME,
  TABELA_FONTES_NOME,
  TABELA_NOTICIAS_NOME
} = require('./env.js')

const app = express()
const parser = new Parser()

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
function normalizarCategoria(categoria) {

  if (!categoria) {
    return 'Geral'
  }

  const texto = categoria.toLowerCase()

  if (
    texto.includes('polít') ||
    texto.includes('polit')
  ) {
    return 'Política'
  }

  if (
    texto.includes('econ') ||
    texto.includes('mercado')
  ) {
    return 'Economia'
  }

  if (
    texto.includes('esport') ||
    texto.includes('futebol')
  ) {
    return 'Esportes'
  }

  if (
    texto.includes('tecn') ||
    texto.includes('tech') ||
    texto.includes('digital')
  ) {
    return 'Tecnologia'
  }

  if (
    texto.includes('ciên') ||
    texto.includes('cienc')
  ) {
    return 'Ciência'
  }

  if (
    texto.includes('saúd') ||
    texto.includes('saud')
  ) {
    return 'Saúde'
  }

  if (
    texto.includes('cultur') ||
    texto.includes('arte')
  ) {
    return 'Cultura'
  }

  if (
    texto.includes('mundo') ||
    texto.includes('internacional')
  ) {
    return 'Mundo'
  }

  return 'Geral'
}


async function importarNoticias(fonteId, endereco, nomeFonte) {
  try {
    console.log(`Buscando notícias de: ${nomeFonte}`)

    const feed = await parser.parseURL(endereco)

    if (!feed.items || feed.items.length === 0) {

      console.log(
        `Nenhuma notícia encontrada em ${endereco}`
      )
      return false
    }

    for (const item of feed.items) {

      const titulo = item.title || 'Sem título'

      const descricao =
        item.contentSnippet ||
        item.content ||
        'Sem descrição'

      const link = item.link || ''

      const dataPublicacao =
        item.isoDate ||
        item.pubDate ||
        ''
   const categoria = normalizarCategoria(
  item.categories && item.categories.length > 0
    ? item.categories[0]
    : 'Geral'

)

      if (!link) {
        continue
      }

      db.get(
        `SELECT id
         FROM ${TABELA_NOTICIAS_NOME}
         WHERE link = ?`,
        [link],
        (erro, noticiaExistente) => {

          if (erro) {

            console.error(
              'Erro ao verificar notícia:',
              erro.message
            )
            return
          }

          if (noticiaExistente) {
            return
          }

          db.run(
            `INSERT INTO ${TABELA_NOTICIAS_NOME}
            (
              titulo,
              descricao,
              link,
              categoria,
              dataPublicacao,
              fonte_id
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              titulo,
              descricao,
              link,
              categoria,
              dataPublicacao,
              fonteId
            ],
            (erro) => {

              if (erro) {

                console.error(
                  'Erro ao cadastrar notícia:',
                  erro.message
                )

              } else {

                console.log(
                  `Notícia adicionada: ${titulo}`
                )

              }
            }
          )

        }
      )
    }

    console.log(
      `Importação concluída: ${nomeFonte}`
    )

    return true

  } catch (erro) {

    console.error(
      `Erro ao importar notícias de ${nomeFonte}:`,
      erro.message
    )

    return false
  }
}

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

    async function (erro) {
      if (erro) {
        return res.status(500).json({
          ok: false,
          error: erro.message
        })

      }

      const fonteId = this.lastID

      const importou = await importarNoticias(
        fonteId,
        endereco,
        nome
      )

      if (!importou) {

        return res.status(400).json({
          ok: false,
          message:
            'A fonte foi cadastrada, mas o endereço informado não contém um RSS válido.'
        })
      }

      res.status(201).json({
        ok: true,
        message:
          'Fonte cadastrada e notícias importadas!',
        id: fonteId
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

app.post('/api/fontes/:id/importar', (req, res) => {

  const id = req.params.id

  db.get(
    `SELECT *
     FROM ${TABELA_FONTES_NOME}
     WHERE id = ?`,
    [id],
    async (erro, fonte) => {

      if (erro) {

        return res.status(500).json({
          ok: false,
          error: erro.message
        })

      }

      if (!fonte) {

        return res.status(404).json({
          ok: false,
          message: 'Fonte não encontrada.'
        })

      }

      await importarNoticias(
        fonte.id,
        fonte.endereco,
        fonte.nome
      )

      res.json({
        ok: true,
        message: 'Notícias importadas com sucesso!'
      })

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
