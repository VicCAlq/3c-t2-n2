const express = require("express");
const path = require("path");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const {
  porta,
  DB_NOME,
  TABELA_FONTES_NOME,
  TABELA_NOTICIAS_NOME,
} = require("./env.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "src")));

const db = new sqlite3.Database(path.join(__dirname, "..", DB_NOME));

function executar(comando, parametros = []) {
  return new Promise((resolve, reject) => {
    db.run(comando, parametros, function (erro) {
      if (erro) reject(erro);
      else resolve(this);
    });
  });
}

function buscar(comando, parametros = []) {
  return new Promise((resolve, reject) => {
    db.all(comando, parametros, (erro, linhas) => {
      if (erro) reject(erro);
      else resolve(linhas);
    });
  });
}

async function garantirColunas(tabela, colunas) {
  const existentes = await buscar(`PRAGMA table_info(${tabela})`);
  for (const [nome, tipo] of colunas) {
    if (!existentes.some((coluna) => coluna.name === nome)) {
      await executar(`ALTER TABLE ${tabela} ADD COLUMN ${nome} ${tipo}`);
    }
  }
}

const bancoPronto = (async () => {
  await executar(`CREATE TABLE IF NOT EXISTS ${TABELA_FONTES_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    descricao TEXT
  )`);
  await executar(`CREATE TABLE IF NOT EXISTS ${TABELA_NOTICIAS_NOME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    fonte TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    descricao TEXT,
    dataDePublicacao TEXT,
    categorias TEXT
  )`);
  await garantirColunas(TABELA_FONTES_NOME, [["nome", "TEXT"], ["link", "TEXT"], ["descricao", "TEXT"]]);
  await garantirColunas(TABELA_NOTICIAS_NOME, [
    ["titulo", "TEXT"],
    ["fonte", "TEXT"],
    ["link", "TEXT"],
    ["descricao", "TEXT"],
    ["dataDePublicacao", "TEXT"],
    ["categorias", "TEXT"],
  ]);
})();

function decodificarXml(valor = "") {
  return valor
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}

function valorDaTag(xml, tag) {
  const resultado = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return resultado ? decodificarXml(resultado[1]) : "";
}

function categorizarNoticia(titulo, descricao = "") {
  const texto = `${titulo} ${descricao}`.toLowerCase();
  const categorias = [
    ["Política", /polític|eleiç|president|governo|congresso|senado|deputad|lula|bolsonaro/],
    ["Esportes", /esport|futebol|jogador|campeonato|copa|olimpíad|time|atleta/],
    ["Tecnologia", /tecnolog|inteligência artificial|\bia\b|aplicativo|internet|computador|celular|digital/],
    ["Economia", /econom|mercado|dólar|inflaç|empresa|negócio|salário|juros/],
    ["Saúde", /saúde|medicina|doença|vacina|hospital|médic|sintoma|covid/],
    ["Cultura", /cultura|música|filme|cinema|livro|arte|cantor|atriz|série/],
    ["Mundo", /mundo|internacional|guerra|país|nepal|tibete|estados unidos|europa/],
  ];
  const encontradas = categorias.filter(([, padrao]) => padrao.test(texto)).map(([nome]) => nome);
  return encontradas.length ? encontradas : ["Geral"];
}

function analisarFeed(xml, linkDoFeed) {
  const canal = xml.match(/<channel(?:\s[^>]*)?>([\s\S]*?)<\/channel>/i)?.[1] || xml;
  const blocos = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].map((match) => match[2]);
  const tituloFonte = valorDaTag(canal, "title") || new URL(linkDoFeed).hostname;
  const descricaoFonte = valorDaTag(canal, "description") || valorDaTag(canal, "subtitle");
  const noticias = blocos.map((bloco) => {
    const link = valorDaTag(bloco, "link") || bloco.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || "";
    const categorias = [...bloco.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)]
      .map((item) => decodificarXml(item[1]))
      .filter(Boolean);
    return {
      titulo: valorDaTag(bloco, "title") || "Sem título",
      link,
      descricao: valorDaTag(bloco, "description") || valorDaTag(bloco, "summary"),
      dataDePublicacao: valorDaTag(bloco, "pubDate") || valorDaTag(bloco, "published") || valorDaTag(bloco, "updated"),
      categorias: categorias.length ? categorias : categorizarNoticia(valorDaTag(bloco, "title"), valorDaTag(bloco, "description") || valorDaTag(bloco, "summary")),
    };
  }).filter((noticia) => noticia.link);

  return {
    fonte: { titulo: tituloFonte, link: linkDoFeed, descricao: descricaoFonte },
    noticias,
  };
}

async function baixarFeedRSS(link) {
  const resposta = await fetch(link);
  if (!resposta.ok) throw new Error(`Não foi possível baixar o feed (${resposta.status})`);
  const feed = analisarFeed(await resposta.text(), link);
  if (!feed.noticias.length) throw new Error("O link não contém um feed RSS com notícias.");
  return feed;
}

function normalizarLinkFeed(link) {
  const url = new URL(link);
  if (url.hostname === "news.google.com" && !url.pathname.startsWith("/rss")) {
    return "https://news.google.com/rss?hl=pt-BR&gl=BR&ceid=BR:pt-419";
  }
  return link;
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "Acesso permitido", data: [], ok: true });
});

app.get("/api/noticias", async (req, res) => {
  try {
    await bancoPronto;
    const noticias = await buscar(`SELECT * FROM ${TABELA_NOTICIAS_NOME} ORDER BY id DESC`);
    for (const noticia of noticias) {
      if (!noticia.categorias) {
        const categorias = categorizarNoticia(noticia.titulo, noticia.descricao);
        await executar(`UPDATE ${TABELA_NOTICIAS_NOME} SET categorias = ? WHERE id = ?`, [categorias.join(","), noticia.id]);
        noticia.categorias = categorias.join(",");
      }
    }
    return res.status(200).json(noticias);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
});

app.get("/api/fontes/cadastrar", async (req, res) => {
  const link = req.query.link;
  if (typeof link !== "string") {
    return res.status(400).json({ error: 'Propriedade "link" não é uma string válida' });
  }
  try {
    new URL(link);
  } catch {
    return res.status(400).json({ error: "O texto enviado não se trata de um endereço Web" });
  }

  try {
    const linkFeed = normalizarLinkFeed(link);
    await bancoPronto;
    const feed = await baixarFeedRSS(linkFeed);
    await executar("BEGIN TRANSACTION");
    await executar(
      `INSERT OR IGNORE INTO ${TABELA_FONTES_NOME} (nome, link, descricao) VALUES (?, ?, ?)`,
      [feed.fonte.titulo, link, feed.fonte.descricao],
    );
    const fonte = (await buscar(`SELECT * FROM ${TABELA_FONTES_NOME} WHERE link = ?`, [link]))[0];
    for (const noticia of feed.noticias) {
      await executar(
        `INSERT OR IGNORE INTO ${TABELA_NOTICIAS_NOME} (titulo, fonte, link, descricao, dataDePublicacao, categorias) VALUES (?, ?, ?, ?, ?, ?)`,
        [noticia.titulo, fonte.nome, noticia.link, noticia.descricao, noticia.dataDePublicacao, noticia.categorias.join(",")],
      );
    }
    await executar("COMMIT");
    const noticias = await buscar(`SELECT * FROM ${TABELA_NOTICIAS_NOME} WHERE fonte = ?`, [fonte.nome]);
    return res.status(201).json({ mensagem: "Feed XML inserido com sucesso.", fontes: [fonte], noticias });
  } catch (erro) {
    try { await executar("ROLLBACK"); } catch {}
    return res.status(500).json({ erro: erro.message });
  }
});

function filtrarNoticiasPorFonte(req, res) {
  const fonte = req.params.fonte || req.query.fonte || req.query.nome;
  if (typeof fonte !== "string" || !fonte.trim()) return res.status(400).json({ error: "Informe a fonte" });
  bancoPronto.then(() => buscar(`SELECT * FROM ${TABELA_NOTICIAS_NOME} WHERE fonte = ?`, [fonte]))
    .then((noticias) => res.status(200).json(noticias))
    .catch((erro) => res.status(500).json({ error: erro.message }));
}

function filtrarNoticiasPorCategoria(req, res) {
  const categoria = req.params.categoria || req.query.categoria;
  if (typeof categoria !== "string" || !categoria.trim()) return res.status(400).json({ error: "Informe a categoria" });
  bancoPronto.then(() => buscar(`SELECT * FROM ${TABELA_NOTICIAS_NOME} WHERE ',' || categorias || ',' LIKE '%,' || ? || ',%'`, [categoria]))
    .then((noticias) => res.status(200).json(noticias))
    .catch((erro) => res.status(500).json({ error: erro.message }));
}

app.get("/api/noticias/fonte/:fonte", filtrarNoticiasPorFonte);
app.get("/api/noticias/filtrarFonte", filtrarNoticiasPorFonte);
app.get("/api/noticias/categoria/:categoria", filtrarNoticiasPorCategoria);
app.get("/api/noticias/filtrarCategoria", filtrarNoticiasPorCategoria);
app.get("/api/fontes/filtrarFontes", async (req, res) => {
  try {
    await bancoPronto;
    const fontes = await buscar(`SELECT * FROM ${TABELA_FONTES_NOME} WHERE link = ? OR nome = ?`, [req.query.link || req.query.endereco, req.query.nome]);
    return res.status(200).json({ message: "Fontes filtradas com sucesso", data: fontes });
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
});

app.delete("/api/fontes/deletar/fonte/:id", async (req, res) => {
  try {
    await bancoPronto;
    const resultado = await executar(`DELETE FROM ${TABELA_FONTES_NOME} WHERE id = ?`, [req.params.id]);
    return res.status(resultado.changes ? 200 : 404).json({ message: resultado.changes ? "Fonte deletada" : "Fonte não encontrada" });
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
});

app.delete("/api/noticias/deletar/noticia/:id", async (req, res) => {
  try {
    await bancoPronto;
    const resultado = await executar(`DELETE FROM ${TABELA_NOTICIAS_NOME} WHERE id = ?`, [req.params.id]);
    return res.status(resultado.changes ? 200 : 404).json({ message: resultado.changes ? "Notícia deletada" : "Notícia não encontrada" });
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
});

bancoPronto.then(() => app.listen(porta, () => console.log(`Servidor rodando em http://localhost:${porta}`)));

module.exports = { app, db, analisarFeed };
