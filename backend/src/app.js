const express = require('express')
const path = require('path')
const cors = require('cors')
const sql = require('sqlite3').verbose()
const { baixarFeedRSS } = require('./leitorRss.js')
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

// Inicialização do Banco de Dados
const db = new sql.Database(
  `./${DB_NOME}`,
  (erro) => {
    if (erro) {
      console.error(`Erro ao abrir o banco de dados "${DB_NOME}":`, erro.message)
    } else {
      console.log(`Conectado ao banco de dados SQLite3 "${DB_NOME}"`)
    }
  }
)

// Criação das Tabelas
db.run(
  `CREATE TABLE IF NOT EXISTS ${TABELA_FONTES_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    link TEXT UNIQUE,
    descricao TEXT
  )`,
  (erro) => {
    if (erro) {
      console.error(`Erro ao criar a tabela "${TABELA_FONTES_NOME}"`, erro.message)
    } else {
      console.log(`Tabela "${TABELA_FONTES_NOME}" pronta!`)
    }
  }
)

db.run(
  `CREATE TABLE IF NOT EXISTS ${TABELA_NOTICIAS_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    fonte TEXT,
    link TEXT UNIQUE,
    descricao TEXT,
    dataDePublicacao TEXT,
    categorias TEXT
  )`,
  (erro) => {
    if (erro) {
      console.error(`Erro ao criar a tabela "${TABELA_NOTICIAS_NOME}"`, erro.message)
    } else {
      console.log(`Tabela "${TABELA_NOTICIAS_NOME}" pronta!`)
    }
  }
)

// Funções Auxiliares para Promessas
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

async function inserirOuBuscarPorLink(tabela, colunas, valores) {
  const indiceLink = colunas.indexOf('link')
  const link = valores[indiceLink]

  await executar(
    `INSERT OR IGNORE INTO ${tabela} (${colunas.join(', ')}) VALUES (${colunas.map(() => '?').join(', ')})`,
    valores
  )

  const [linha] = await buscar(`SELECT * FROM ${tabela} WHERE link = ?`, [link])
  return linha
}

// Rotas da Aplicação

app.get('/', (req, res) => {
  res.status(200).json({
    message: "Acesso permitido",
    data: [],
    ok: true,
  })
})

// Cadastrar nova fonte via parâmetro 'link'
app.get('/api/fontes/cadastrar', async (req, res) => {
  if (typeof(req.query.link) !== 'string') {
    return res.status(400).json({ error: 'Propriedade "link" não é uma string válida' })
  }

  try {
    new URL(req.query.link)
  } catch {
    return res.status(400).json({ error: 'O texto enviado não se trata de um endereço Web' })
  }

  try {
    await executar('BEGIN TRANSACTION')

    const feed = await baixarFeedRSS(req.query.link)

    const fonte = await inserirOuBuscarPorLink(
      TABELA_FONTES_NOME,
      ['titulo', 'link', 'descricao'],
      [feed.fonte.titulo, feed.fonte.link, feed.fonte.descricao]
    )

    const noticiasInseridas = []
    for (const noticia of feed.noticias) {
      const linha = await inserirOuBuscarPorLink(
        TABELA_NOTICIAS_NOME,
        ['titulo', 'fonte', 'link', 'descricao', 'dataDePublicacao', 'categorias'],
        [
          noticia.titulo,
          feed.fonte.titulo,
          noticia.link,
          noticia.descricao,
          noticia.dataPublicacao,
          noticia.categorias?.toString() || ''
        ]
      )
      if (linha) { noticiasInseridas.push(linha) }
    }

    await executar('COMMIT')

    res.json({
      mensagem: 'Feed XML inserido com sucesso.',
      fontes: fonte ? [fonte] : [],
      noticias: noticiasInseridas,
    })

  } catch (erro) {
    await executar('ROLLBACK')
    res.status(500).json({ erro: erro.message })
  }
})

// Listar todas as fontes
app.get('/api/fontes/', async (req, res) => {
  try {
    const fontes = await buscar(`SELECT * FROM ${TABELA_FONTES_NOME}`)
    res.json({ fontes })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// Apagar fonte por ID
app.delete('/api/fontes/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ erro: 'Id inválido' })
  }
  try {
    const resultado = await executar(
      `DELETE FROM ${TABELA_FONTES_NOME} WHERE id = ?`,
      [id]
    )
    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Fonte não encontrada' })
    }
    res.json({ mensagem: 'Fonte apagada com sucesso', apagado: resultado.changes })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// Filtrar notícias por categoria
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

// Filtrar notícias por fonte
app.get('/api/noticias/fonte/:fonte', async (req, res) => {
  const fonte = req.params.fonte
  try {
    const linhas = await buscar(
      `SELECT * FROM ${TABELA_NOTICIAS_NOME} WHERE fonte = ?`,
      [fonte]
    )
    res.json({ noticias: linhas })
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
})

// Listar categorias distintas
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

// Apagar notícia por ID
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

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`)
})                
