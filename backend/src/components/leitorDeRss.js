const { DOMParser } = require("xmldom");

async function fetchComProxy(endereco) {
  let erroMaisRecente = null;

  try {
    const resposta = await fetch(endereco, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}`);
    }

    const texto = await resposta.text();

    if (!texto.trim()) {
      throw new Error("O feed retornou uma resposta vazia.");
    }

    return texto;
  } catch (err) {
    erroMaisRecente = err;
  }

  throw erroMaisRecente || new Error("Não foi possível carregar o feed.");
}

function lerRSS(textoXML) {
  const parser = new DOMParser();

  const doc = parser.parseFromString(textoXML, "text/xml");

  if (!doc || !doc.documentElement) {
    throw new Error("A resposta recebida não é um XML válido.");
  }

  const formatoAtom = doc.documentElement.nodeName === "feed";

  let titulo = "";
  let descricao = "";
  let link = "";
  let noticias = [];

  if (formatoAtom) {
    titulo = doc.getElementsByTagName("title")[0]?.textContent || "";

    descricao = doc.getElementsByTagName("subtitle")[0]?.textContent || "";

    const links = doc.getElementsByTagName("link");

    for (let i = 0; i < links.length; i++) {
      if (
        links[i].getAttribute("rel") === "alternate" ||
        !links[i].getAttribute("rel")
      ) {
        link = links[i].getAttribute("href") || "";
        break;
      }
    }

    const valores = doc.getElementsByTagName("entry");

    noticias = Array.from(valores).map((valor) => {
      let valorLink = "";

      const linksNoticia = valor.getElementsByTagName("link");

      for (let i = 0; i < linksNoticia.length; i++) {
        if (
          linksNoticia[i].getAttribute("rel") === "alternate" ||
          !linksNoticia[i].getAttribute("rel")
        ) {
          valorLink = linksNoticia[i].getAttribute("href") || "";
          break;
        }
      }

      const content =
        valor.getElementsByTagName("content")[0]?.textContent || "";

      const summary =
        valor.getElementsByTagName("summary")[0]?.textContent || "";

      return {
        titulo:
          valor.getElementsByTagName("title")[0]?.textContent || "Sem título",

        link: valorLink,

        descricao: summary || content,

        dataPublicacao:
          valor.getElementsByTagName("updated")[0]?.textContent ||
          valor.getElementsByTagName("published")[0]?.textContent ||
          new Date().toISOString(),

        categorias: Array.from(valor.getElementsByTagName("category"))
          .map((c) => c.getAttribute("term") || c.textContent)
          .filter(Boolean),
      };
    });
  } else {
    const canal = doc.getElementsByTagName("channel")[0] || doc.documentElement;

    titulo = canal.getElementsByTagName("title")[0]?.textContent || "";

    descricao = canal.getElementsByTagName("description")[0]?.textContent || "";

    link = canal.getElementsByTagName("link")[0]?.textContent || "";

    const elementosNoticias = doc.getElementsByTagName("item");

    noticias = Array.from(elementosNoticias).map((item) => {
      const itemDesc =
        item.getElementsByTagName("description")[0]?.textContent || "";

      const conteudoArmazenado =
        item.getElementsByTagName("content:encoded")[0]?.textContent || "";

      const descricaoFormatada = (conteudoArmazenado || itemDesc)
        .replace(/<[^>]*>/g, "")
        .trim();

      return {
        titulo:
          item.getElementsByTagName("title")[0]?.textContent || "Sem título",

        link: item.getElementsByTagName("link")[0]?.textContent || "",

        descricao: descricaoFormatada.substring(0, 500),

        dataPublicacao:
          item.getElementsByTagName("pubDate")[0]?.textContent ||
          item.getElementsByTagName("dc:date")[0]?.textContent ||
          item.getElementsByTagName("date")[0]?.textContent ||
          new Date().toISOString(),

        categorias: Array.from(item.getElementsByTagName("category"))
          .map((c) => c.textContent)
          .filter(Boolean),
      };
    });
  }

  return {
    fonte: {
      titulo: titulo || "Sem título",
      descricao: descricao || "",
      link: link || "",
    },

    noticias: noticias.slice(0, 50),
  };
}

async function baixarFeedRSS(url) {
  const textoXML = await fetchComProxy(url);

  return lerRSS(textoXML);
}

module.exports = { baixarFeedRSS };
