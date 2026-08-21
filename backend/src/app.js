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


const db = new sql.Database(
  `./${DB_NOME}`,
  (erro) => {
    if (erro) {
      console.error(
        `Erro ao abrir o banco de dados "${DB_NOME}":`,
        erro.message
      )
    } else {
      console.log(
        `Conectado ao banco de dados SQLite3 "${DB_NOME}"`
      )
    }
  }
)


db.run(
  `CREATE TABLE IF NOT EXISTS ${TABELA_FONTES_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    endereco TEXT
  )`,
  (erro) => {
    if (erro) {
      console.error(
        `Erro ao criar a tabela "${TABELA_FONTES_NOME}"`,
        erro.message
      )
    } else {
      console.log(
        `Tabela "${TABELA_FONTES_NOME}" pronta!`
      )
    }
  }
)


db.run(
  `CREATE TABLE IF NOT EXISTS ${TABELA_NOTICIAS_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    fonte_id INTEGER,
    link TEXT UNIQUE,
    descricao TEXT,
    dataDePublicacao TEXT,
    categorias TEXT,
    FOREIGN KEY (fonte_id) REFERENCES ${TABELA_FONTES_NOME}(id)
  )`,
  (erro) => {
    if (erro) {
      console.error(`Erro ao criar a tabela "${TABELA_NOTICIAS_NOME}"`, erro.message);
    } else {
      console.log(`Tabela "${TABELA_NOTICIAS_NOME}" pronta!`);
    }
  }
)


function executar(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (erro) {
      if (erro) { reject(erro) }
      else { resolve(this) }
    })
  })
}


function buscar(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (erro, linhas) => {
      if (erro) { reject(erro) }
      else { resolve(linhas) }
    })
  })
}

app.get('/api/fontes/cadastrar', async (req, res) => {

  // Verifica se o link foi enviado
  if (typeof req.query.link !== 'string') {
    return res.status(400).json({
      error: 'Propriedade "link" não é uma string válida'
    })
  }

  // Verifica se o link é uma URL válida
  try {
    new URL(req.query.link)
  } catch {
    return res.status(400).json({
      error: 'O texto enviado não se trata de um endereço Web'
    })
  }

  try {

    await executar('BEGIN TRANSACTION')

    // Baixa o feed RSS
    const feed = await baixarFeedRSS(req.query.link)

    // Verifica se a fonte já existe
    const fontes = await buscar(
      `SELECT * FROM ${TABELA_FONTES_NOME} WHERE endereco = ?`,
      [feed.fonte.link]
    )

    let fonte

    if (fontes.length > 0) {
      // Se já existe, usa a fonte existente
      fonte = fontes[0]

    } else {
      // Se não existe, cadastra uma nova fonte
      const resultado = await executar(
        `INSERT INTO ${TABELA_FONTES_NOME}
        (nome, endereco)
        VALUES (?, ?)`,
        [
          feed.fonte.titulo,
          feed.fonte.link
        ]
      )

      // Busca a fonte que acabou de ser cadastrada
      const fontesInseridas = await buscar(
        `SELECT * FROM ${TABELA_FONTES_NOME} WHERE id = ?`,
        [resultado.lastID]
      )

      fonte = fontesInseridas[0]
    }


    const noticiasInseridas = []

    // Insere as notícias
    for (const noticia of feed.noticias) {

      const resultado = await executar(
        `INSERT OR IGNORE INTO ${TABELA_NOTICIAS_NOME}
        (
          titulo,
          fonte_id,
          link,
          descricao,
          dataDePublicacao,
          categorias
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          noticia.titulo,
          fonte.id,
          noticia.link,
          noticia.descricao,
          noticia.dataPublicacao,
          noticia.categorias?.toString() || ''
        ]
      )

      // Se a notícia foi realmente inserida
      if (resultado.changes > 0) {

        const noticias = await buscar(
          `SELECT * FROM ${TABELA_NOTICIAS_NOME} WHERE id = ?`,
          [resultado.lastID]
        )

        if (noticias.length > 0) {
          noticiasInseridas.push(noticias[0])
        }
      }
    }


    await executar('COMMIT')


    res.status(200).json({
      mensagem: 'Feed XML inserido com sucesso.',
      fontes: [fonte],
      noticias: noticiasInseridas
    })

  } catch (erro) {

    await executar('ROLLBACK')

    console.log(`Erro na inserção: ${erro.message}`)

    res.status(500).json({
      erro: erro.message
    })
  }
})



// Filtra a tabela de notícias pela categoria
app.get('/api/noticias/categoria/:categoria', async (req, res) => {
  const categoria = req.params.categoria
  try {
    const linhas = await buscar(
      `SELECT * FROM ${TABELA_NOTICIAS_NOME} WHERE ',' || categorias || ',' LIKE '%,' || ? || ',%'`,
      [categoria]
    )
    res.json({ noticias: linhas })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// Envia lista de fontes de notícias
app.get('/api/fontes/', async (req, res) => {
  try {
    const fontes = await buscar(`SELECT * FROM ${TABELA_FONTES_NOME}`)
    res.json({ fontes })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// Envia lista de categorias de notícias
app.get('/api/categorias/', async (req, res) => {
  try {
    const linhas = await buscar(
      `SELECT DISTINCT categorias FROM ${TABELA_NOTICIAS_NOME} WHERE categorias IS NOT NULL AND categorias != ''`
    )
    const categorias = [...new Set(
      linhas
        .flatMap(l => String(l.categorias).split(','))
        .map(c => c.trim())
        .filter(Boolean)
    )]
    res.json({ categorias })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})


app.get('/api/noticias/fonteNoticia/:fonteNoticia', (req, res) => {


  const fonteNoticia = req.params.fonteNoticia


  db.all(
    `SELECT ${TABELA_NOTICIAS_NOME}.*
     FROM ${TABELA_NOTICIAS_NOME}
     INNER JOIN ${TABELA_FONTES_NOME}
     ON ${TABELA_NOTICIAS_NOME}.fonte_id =
        ${TABELA_FONTES_NOME}.id
     WHERE ${TABELA_FONTES_NOME}.nome = ?`,
    [fonteNoticia],
    (erro, resultados) => {


      if (erro) {
        res.status(400).json({
          error: erro.message
        })
        return
      }


      if (resultados.length === 0) {
        res.status(404).json({
          error: 'Fonte não indisponível'
        })
        return
      }


      res.status(200).json({
        data: resultados,
        ok: true
      })
    }
  )
})


app.delete('/api/noticias/eliminarFonte/:id', (req, res) => {


  if (!req.params) {
    res.status(400).json({
      error: 'Parâmetros não informados'
    })
    return
  }


  const { id } = req.params


  db.run(
    `DELETE FROM ${TABELA_NOTICIAS_NOME}
     WHERE fonte_id = ?`,
    [id],
    (erro) => {


      if (erro) {
        res.status(400).json({
          error: erro.message
        })
        return
      }


      db.run(
        `DELETE FROM ${TABELA_FONTES_NOME}
         WHERE id = ?`,
        [id],
        function (erro) {


          if (erro) {
            res.status(400).json({
              error: erro.message
            })
            return
          }


          if (this.changes === 0) {
            res.status(404).json({
              error: 'Fonte não encontrada'
            })
            return
          }


          res.status(200).json({
            message: 'Fonte e notícias relacionadas excluídas com sucesso',
            ok: true
          })
        }
      )
    }
  )
})


// Apaga uma notícia pelo id
app.delete('/api/noticias/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'Id inválido' })
  }
  try {
    const resultado = await executar(
      `DELETE FROM ${TABELA_NOTICIAS_NOME} WHERE id = ?`,
      [id]
    )
    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Notícia não encontrada' })
    }
    res.json({ mensagem: 'Notícia apagada com sucesso', apagado: resultado.changes })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})




function executar(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (erro) {
      if (erro) { reject(erro) }
      else { resolve(this) } // { ultimoID, mudanças }
    })
  })
}


function buscar(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (erro, linhas) => {
      if (erro) { reject(erro) }
      else { resolve(linhas) }
    })
  })
}




app.listen(porta, () => {
  console.log(
    `Servidor rodando em http://localhost:${porta}`
  )
})

