"use strict";

/* =====================================================
   JOGO DA FORCA - script.js
   ===================================================== */

/* ---------- Configurações ---------- */
const MAX_ERROS = 6;
const PASTA_IMAGENS = "../img/";
const CHAVE_PLACAR = "forca:placar:v2";
const CHAVE_SOM = "forca:som:v2";
const TEMPO_AVISO = 2600;

const DESCRICOES_FORCA = [
    "Forca vazia, nenhum erro ainda",
    "Forca com a cabeça do boneco",
    "Forca com cabeça e tronco",
    "Forca com cabeça, tronco e um braço",
    "Forca com cabeça, tronco e os dois braços",
    "Forca com cabeça, tronco, braços e uma perna",
    "Boneco completo, fim de jogo"
];

/* ---------- Banco de palavras ----------
   Formato: ["PALAVRA", "dica"]
   Use MAIÚSCULAS e pode usar acentos, espaços e hífen.
   Para adicionar palavras, basta incluir novos itens. */
const CATEGORIAS = {
    "Frutas": { emoji: "🍓", palavras: [
        ["ABACAXI", "Fruta tropical com uma coroa de folhas"],
        ["MELANCIA", "Verde por fora, vermelha e suculenta por dentro"],
        ["MORANGO", "Pequena, vermelha e cheia de sementes por fora"],
        ["MARACUJÁ", "Muito usada em sucos, mousses e sobremesas"],
        ["JABUTICABA", "Nasce direto no tronco da árvore"],
        ["GOIABA", "Polpa rosada com muitas sementes pequenas"],
        ["MAMÃO", "Alaranjado, comum no café da manhã"],
        ["ABACATE", "Cremoso, é a base do guacamole"],
        ["LARANJA", "Cítrica, dela se faz um suco famoso"],
        ["ACEROLA", "Pequena, vermelha e rica em vitamina C"]
    ]},
    "Animais": { emoji: "🐾", palavras: [
        ["ELEFANTE", "O maior animal terrestre do mundo"],
        ["GIRAFA", "Tem o pescoço mais longo entre os animais"],
        ["TARTARUGA", "Carrega a própria casa nas costas"],
        ["JACARÉ", "Réptil de boca grande que vive em rios e pântanos"],
        ["GOLFINHO", "Mamífero marinho muito inteligente e brincalhão"],
        ["PAPAGAIO", "Ave colorida que imita a voz humana"],
        ["CAMALEÃO", "Muda de cor para se camuflar"],
        ["MORCEGO", "O único mamífero que voa de verdade"],
        ["ONÇA-PINTADA", "Maior felino das Américas"],
        ["BORBOLETA", "Antes de ter asas, foi uma lagarta"]
    ]},
    "Países": { emoji: "🌍", palavras: [
        ["BRASIL", "Maior país da América do Sul"],
        ["PORTUGAL", "País europeu onde também se fala português"],
        ["ARGENTINA", "Terra do tango, vizinha do Brasil"],
        ["JAPÃO", "Conhecido como a terra do sol nascente"],
        ["CANADÁ", "Famoso pela folha de bordo e pelo frio"],
        ["MÉXICO", "País dos tacos, dos mariachis e das pirâmides astecas"],
        ["EGITO", "Lar das pirâmides e do rio Nilo"],
        ["AUSTRÁLIA", "País-continente dos cangurus"],
        ["ESPANHA", "País da paella e do flamenco"],
        ["ÁFRICA DO SUL", "País na ponta mais ao sul do continente africano"]
    ]},
    "Tecnologia": { emoji: "💻", palavras: [
        ["COMPUTADOR", "Máquina que processa informações"],
        ["TECLADO", "Usamos para digitar textos"],
        ["NAVEGADOR", "Programa usado para acessar sites"],
        ["JAVASCRIPT", "Linguagem que dá vida às páginas da web"],
        ["PROGRAMAÇÃO", "A arte de escrever instruções para o computador"],
        ["ALGORITMO", "Passo a passo para resolver um problema"],
        ["SERVIDOR", "Computador que responde aos pedidos de outros pela rede"],
        ["APLICATIVO", "Programa instalado no celular"],
        ["BANCO DE DADOS", "Local organizado para guardar informações"],
        ["INTERNET", "Rede mundial de computadores"]
    ]},
    "Esportes": { emoji: "⚽", palavras: [
        ["FUTEBOL", "O esporte mais popular do Brasil"],
        ["BASQUETE", "Vence quem acerta mais cestas"],
        ["NATAÇÃO", "Praticado dentro da piscina"],
        ["VÔLEI", "Jogado com rede, sem deixar a bola cair"],
        ["ATLETISMO", "Reúne corridas, saltos e arremessos"],
        ["GINÁSTICA", "Esporte de acrobacias, equilíbrio e flexibilidade"],
        ["CICLISMO", "Esporte praticado sobre duas rodas"],
        ["XADREZ", "Jogo de estratégia com rei, rainha e peões"],
        ["JUDÔ", "Arte marcial de origem japonesa"],
        ["ESCALADA", "Subir paredes e montanhas com cordas"]
    ]},
    "Comidas": { emoji: "🍕", palavras: [
        ["FEIJOADA", "Prato com feijão preto e carnes variadas"],
        ["PÃO DE QUEIJO", "Salgadinho típico de Minas Gerais"],
        ["BRIGADEIRO", "Docinho de chocolate das festas de aniversário"],
        ["COXINHA", "Salgado em formato de gota recheado com frango"],
        ["PASTEL", "Massa fina frita e recheada, famoso nas feiras"],
        ["TAPIOCA", "Feita com goma de mandioca"],
        ["ACARAJÉ", "Bolinho baiano frito no azeite de dendê"],
        ["CHURRASCO", "Carne assada na brasa"],
        ["LASANHA", "Massa em camadas com molho e queijo"],
        ["AÇAÍ", "Fruta roxa servida gelada em tigela"]
    ]},
    "Natureza": { emoji: "🌳", palavras: [
        ["MONTANHA", "Grande elevação natural do terreno"],
        ["OCEANO", "Enorme extensão de água salgada"],
        ["FLORESTA", "Área coberta por muitas árvores"],
        ["CACHOEIRA", "Queda de água de um rio"],
        ["VULCÃO", "Montanha que pode expelir lava"],
        ["DESERTO", "Região muito seca, com pouca chuva"],
        ["ARCO-ÍRIS", "Surge quando o sol aparece depois da chuva"],
        ["TROVÃO", "Barulho forte que vem depois do raio"],
        ["PANTANAL", "Maior planície alagável do planeta"],
        ["AMAZÔNIA", "A maior floresta tropical do mundo"]
    ]},
    "Profissões": { emoji: "👷", palavras: [
        ["MÉDICO", "Cuida da saúde dos pacientes"],
        ["PROFESSOR", "Ensina os alunos na escola"],
        ["ENGENHEIRO", "Projeta pontes, prédios e máquinas"],
        ["BOMBEIRO", "Combate incêndios e faz resgates"],
        ["ARQUITETO", "Desenha casas e edifícios"],
        ["JORNALISTA", "Conta as notícias ao público"],
        ["ADVOGADO", "Defende pessoas na Justiça"],
        ["ELETRICISTA", "Cuida da instalação elétrica"],
        ["ASTRONAUTA", "Viaja para o espaço"],
        ["PADEIRO", "Acorda cedo para assar o pão"]
    ]},
    "Objetos": { emoji: "🔑", palavras: [
        ["GUARDA-CHUVA", "Protege você da chuva"],
        ["RELÓGIO", "Marca as horas"],
        ["ÓCULOS", "Ajuda a enxergar melhor"],
        ["GELADEIRA", "Mantém os alimentos frios"],
        ["TRAVESSEIRO", "Apoia a cabeça na hora de dormir"],
        ["LANTERNA", "Ilumina lugares escuros"],
        ["ESPELHO", "Mostra o seu reflexo"],
        ["CADEADO", "Tranca com chave ou senha"],
        ["MOCHILA", "Carregada nas costas com o material da escola"],
        ["VENTILADOR", "Refresca o ambiente nos dias quentes"]
    ]}
};

const BANCO = Object.entries(CATEGORIAS).flatMap(([categoria, info]) =>
    info.palavras.map(([palavra, dica]) => ({
        palavra,
        dica,
        categoria,
        emoji: info.emoji
    }))
);

const LINHAS_TECLADO = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

/* Sons: [frequência, atraso (s), duração (s), tipo de onda] */
const SONS = {
    acerto:  [[660, 0, 0.12, "sine"], [880, 0.08, 0.16, "sine"]],
    erro:    [[220, 0, 0.18, "sawtooth"], [160, 0.1, 0.24, "sawtooth"]],
    dica:    [[520, 0, 0.1, "triangle"], [520, 0.14, 0.12, "triangle"]],
    vitoria: [[523, 0, 0.16, "sine"], [659, 0.16, 0.16, "sine"], [784, 0.32, 0.16, "sine"], [1047, 0.48, 0.4, "sine"]],
    derrota: [[392, 0, 0.26, "triangle"], [330, 0.26, 0.26, "triangle"], [262, 0.52, 0.26, "triangle"], [196, 0.78, 0.5, "triangle"]]
};

/* ---------- Elementos da página ---------- */
function obter(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        console.error(`[Forca] Elemento #${id} não foi encontrado no jogo.html.`);
    }
    return elemento;
}

const el = {
    imagem: obter("forca"),
    avisoImagem: obter("aviso-imagem"),
    caixa: obter("caixa-forca"),
    vidas: document.querySelectorAll("#vidas .vida"),
    erros: obter("erros"),
    categoriaChip: obter("categoria-chip"),
    categoria: obter("categoria"),
    dica: obter("dica"),
    palavra: obter("palavra"),
    chute: obter("chute"),
    btnChutar: obter("btn-chutar"),
    btnDica: obter("btn-dica"),
    erradas: obter("letras-erradas"),
    mensagem: obter("mensagem"),
    teclado: obter("teclado"),
    reiniciar: obter("reiniciar"),
    btnSom: obter("btn-som"),
    btnZerar: obter("btn-zerar"),
    placarVitorias: obter("placar-vitorias"),
    placarDerrotas: obter("placar-derrotas"),
    placarSequencia: obter("placar-sequencia"),
    placarRecorde: obter("placar-recorde"),
    modal: obter("modal-fim"),
    modalEmoji: obter("modal-emoji"),
    modalTitulo: obter("modal-titulo"),
    modalTexto: obter("modal-texto"),
    modalPalavra: obter("modal-palavra"),
    modalErros: obter("modal-erros"),
    modalTempo: obter("modal-tempo"),
    modalSequencia: obter("modal-sequencia"),
    modalJogar: obter("modal-jogar"),
    modalFechar: obter("modal-fechar")
};

/* ---------- Estado do jogo ---------- */
const estado = {
    item: null,              // palavra sorteada {palavra, dica, categoria, emoji}
    letras: [],              // caracteres originais (com acento)
    base: [],                // caracteres sem acento (para comparar)
    reveladas: [],           // true/false para cada posição
    casas: [],               // elementos da tela de cada posição
    teclas: {},              // botões do teclado por letra
    usadas: new Set(),       // letras já tentadas
    erradas: [],             // letras erradas
    palavrasErradas: new Set(),
    erros: 0,
    dicasUsadas: 0,
    acabou: false,
    inicio: 0,
    fila: [],
    categoria: "todas",
    ultimaPalavra: ""
};

let placar = lerPlacar();
let somLigado = lerSom();
let audioCtx = null;
let timerAviso = null;
let timerModal = null;

/* =====================================================
   UTILITÁRIOS
   ===================================================== */

// Remove acentos e deixa em maiúsculas: "ç" -> "C", "ã" -> "A"
function normalizar(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// Reinicia uma animação CSS adicionando a classe de novo
function animar(elemento, classe, duracao) {
    elemento.classList.remove(classe);
    void elemento.offsetWidth;
    elemento.classList.add(classe);
    setTimeout(() => elemento.classList.remove(classe), duracao);
}

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;
    return minutos > 0 ? `${minutos}min ${resto}s` : `${resto}s`;
}

/* =====================================================
   PLACAR E SOM (salvos no navegador)
   ===================================================== */
function lerPlacar() {
    const padrao = { vitorias: 0, derrotas: 0, sequencia: 0, recorde: 0 };
    try {
        const bruto = localStorage.getItem(CHAVE_PLACAR);
        if (!bruto) return padrao;
        const dados = JSON.parse(bruto);
        return {
            vitorias: Number(dados.vitorias) || 0,
            derrotas: Number(dados.derrotas) || 0,
            sequencia: Number(dados.sequencia) || 0,
            recorde: Number(dados.recorde) || 0
        };
    } catch (erro) {
        return padrao;
    }
}

function salvarPlacar() {
    try {
        localStorage.setItem(CHAVE_PLACAR, JSON.stringify(placar));
    } catch (erro) {
        /* sem armazenamento disponível: o jogo continua normalmente */
    }
}

function renderizarPlacar() {
    el.placarVitorias.textContent = placar.vitorias;
    el.placarDerrotas.textContent = placar.derrotas;
    el.placarSequencia.textContent = placar.sequencia;
    el.placarRecorde.textContent = placar.recorde;
}

function lerSom() {
    try {
        return localStorage.getItem(CHAVE_SOM) !== "off";
    } catch (erro) {
        return true;
    }
}

function salvarSom() {
    try {
        localStorage.setItem(CHAVE_SOM, somLigado ? "on" : "off");
    } catch (erro) {
        /* ignora */
    }
}

function renderizarSom() {
    el.btnSom.textContent = somLigado ? "🔊" : "🔇";
    el.btnSom.setAttribute("aria-pressed", String(somLigado));
}

function tocarTom(frequencia, atraso, duracao, tipo) {
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();

        const oscilador = audioCtx.createOscillator();
        const ganho = audioCtx.createGain();
        const inicio = audioCtx.currentTime + atraso;

        oscilador.type = tipo;
        oscilador.frequency.value = frequencia;
        ganho.gain.setValueAtTime(0.06, inicio);
        ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);

        oscilador.connect(ganho);
        ganho.connect(audioCtx.destination);
        oscilador.start(inicio);
        oscilador.stop(inicio + duracao);
    } catch (erro) {
        /* navegador sem suporte a áudio: ignora */
    }
}

function som(nome) {
    if (!somLigado) return;
    (SONS[nome] || []).forEach(([frequencia, atraso, duracao, tipo]) => {
        tocarTom(frequencia, atraso, duracao, tipo);
    });
}

/* =====================================================
   MONTAGEM DA TELA
   ===================================================== */
function montarTeclado() {
    el.teclado.textContent = "";
    estado.teclas = {};

    LINHAS_TECLADO.forEach((linha) => {
        const divLinha = document.createElement("div");
        divLinha.className = "teclado__linha";

        for (const letra of linha) {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "tecla";
            botao.dataset.letra = letra;
            botao.textContent = letra;
            botao.setAttribute("aria-label", `Letra ${letra}`);
            divLinha.appendChild(botao);
            estado.teclas[letra] = botao;
        }

        el.teclado.appendChild(divLinha);
    });
}

function popularCategorias() {
    Object.entries(CATEGORIAS).forEach(([nome, info]) => {
        const opcao = document.createElement("option");
        opcao.value = nome;
        opcao.textContent = `${info.emoji} ${nome}`;
        el.categoria.appendChild(opcao);
    });
}

function precarregarImagens() {
    for (let i = 0; i <= MAX_ERROS; i++) {
        const imagem = new Image();
        imagem.src = `${PASTA_IMAGENS}${i === MAX_ERROS ? "forca-final.svg" : `forca-${i}.svg`}`;
    }
}

function criarGrupo() {
    const grupo = document.createElement("div");
    grupo.className = "palavra__grupo";
    return grupo;
}

// Cria as casinhas da palavra (uma vez por rodada)
function montarPalavra() {
    el.palavra.textContent = "";
    estado.casas = [];

    let grupo = criarGrupo();

    estado.letras.forEach((caractere, i) => {
        if (caractere === " ") {
            el.palavra.appendChild(grupo);
            grupo = criarGrupo();
            estado.casas[i] = null;
            return;
        }

        const casa = document.createElement("span");
        casa.className = "casa";

        if (caractere === "-") {
            casa.classList.add("casa--hifen");
            casa.textContent = "-";
        }

        grupo.appendChild(casa);
        estado.casas[i] = casa;
    });

    el.palavra.appendChild(grupo);
}

/* =====================================================
   ATUALIZAÇÃO DA TELA
   ===================================================== */

// revelarTudo = true mostra as letras que faltavam (usado na derrota)
function atualizarPalavra(revelarTudo = false) {
    const leitura = [];

    estado.letras.forEach((caractere, i) => {
        if (caractere === " ") {
            leitura.push("espaço");
            return;
        }
        if (caractere === "-") {
            leitura.push("hífen");
            return;
        }

        const casa = estado.casas[i];

        if (estado.reveladas[i]) {
            if (!casa.classList.contains("casa--revelada")) {
                casa.textContent = caractere;
                casa.classList.add("casa--revelada");
            }
            leitura.push(caractere);
        } else if (revelarTudo) {
            casa.textContent = caractere;
            casa.classList.add("casa--perdida");
            leitura.push(caractere);
        } else {
            leitura.push("lacuna");
        }
    });

    el.palavra.setAttribute("aria-label", `Palavra: ${leitura.join(", ")}`);
}

function atualizarForca() {
    const nivel = Math.min(estado.erros, MAX_ERROS);

    el.imagem.src = `${PASTA_IMAGENS}${nivel === MAX_ERROS ? "forca-final.svg" : `forca-${nivel}.svg`}`;
    el.imagem.alt = DESCRICOES_FORCA[nivel];
    el.caixa.dataset.nivel = String(nivel);
    el.erros.textContent = String(nivel);

    el.vidas.forEach((vida, indice) => {
        vida.classList.toggle("perdida", indice < nivel);
    });
}

function atualizarErradas() {
    el.erradas.textContent = "";

    const itens = [...estado.erradas, ...estado.palavrasErradas];

    if (itens.length === 0) {
        const vazio = document.createElement("span");
        vazio.className = "erradas__vazio";
        vazio.textContent = "nenhum até agora";
        el.erradas.appendChild(vazio);
        return;
    }

    itens.forEach((texto) => {
        const chip = document.createElement("span");
        chip.className = "chip-erro";
        chip.textContent = texto;
        el.erradas.appendChild(chip);
    });
}

function atualizarTela() {
    atualizarPalavra();
    atualizarForca();
    atualizarErradas();
    el.btnDica.disabled = estado.acabou || estado.erros >= MAX_ERROS - 1;
}

/* ---------- Mensagens ---------- */
function limparMensagem() {
    el.mensagem.className = "jogo__mensagem";
    el.mensagem.textContent = "";
}

function avisar(texto, tipo = "aviso", fixo = false) {
    clearTimeout(timerAviso);
    el.mensagem.className = `jogo__mensagem jogo__mensagem--${tipo}`;
    el.mensagem.textContent = texto;

    if (!fixo) {
        timerAviso = setTimeout(() => {
            if (!estado.acabou) limparMensagem();
        }, TEMPO_AVISO);
    }
}

function sinalizarInvalido() {
    animar(el.chute, "invalido", 400);
}

function tremerForca() {
    animar(el.caixa, "tremer", 450);
}

/* =====================================================
   SORTEIO DAS PALAVRAS (sem repetir até acabar a lista)
   ===================================================== */
function proximoItem() {
    if (estado.fila.length === 0) {
        const base = estado.categoria === "todas"
            ? BANCO
            : BANCO.filter((item) => item.categoria === estado.categoria);

        estado.fila = embaralhar(base);

        // evita repetir a mesma palavra logo depois de reembaralhar
        const ultimo = estado.fila[estado.fila.length - 1];
        if (estado.fila.length > 1 && ultimo.palavra === estado.ultimaPalavra) {
            estado.fila.unshift(estado.fila.pop());
        }
    }

    return estado.fila.pop();
}

/* =====================================================
   REGRAS DO JOGO
   ===================================================== */

// Revela todas as posições da letra e devolve quantas foram reveladas
function revelarLetra(letra) {
    let total = 0;
    estado.base.forEach((caractere, i) => {
        if (caractere === letra && !estado.reveladas[i]) {
            estado.reveladas[i] = true;
            total++;
        }
    });
    return total;
}

function tentarLetra(entrada) {
    if (estado.acabou) return false;

    const letra = normalizar(String(entrada).trim());

    if (!/^[A-Z]$/.test(letra)) {
        sinalizarInvalido();
        avisar("Digite uma letra de A a Z.", "aviso");
        return false;
    }

    if (estado.usadas.has(letra)) {
        sinalizarInvalido();
        avisar(`Você já tentou a letra ${letra}.`, "aviso");
        return false;
    }

    estado.usadas.add(letra);

    const tecla = estado.teclas[letra];
    const acertos = revelarLetra(letra);

    tecla.disabled = true;

    if (acertos > 0) {
        tecla.classList.add("acerto");
        som("acerto");
        avisar(
            acertos === 1
                ? `Boa! Existe 1 letra ${letra}.`
                : `Boa! Existem ${acertos} letras ${letra}.`,
            "ok"
        );
    } else {
        estado.erradas.push(letra);
        estado.erros++;
        tecla.classList.add("erro");
        tremerForca();
        som("erro");
        avisar(`Não existe a letra ${letra}.`, "erro");
    }

    atualizarTela();
    verificarFim();
    return true;
}

function arriscarPalavra(entrada) {
    if (estado.acabou) return false;

    const tentativa = normalizar(entrada).replace(/[^A-Z]/g, "");
    const alvo = estado.base.join("").replace(/[^A-Z]/g, "");

    // Tamanho diferente: avisa sem tirar vida (provável erro de digitação)
    if (tentativa.length !== alvo.length) {
        sinalizarInvalido();
        avisar(`A palavra tem ${alvo.length} letras. Confira o que digitou.`, "aviso");
        return false;
    }

    if (estado.palavrasErradas.has(tentativa)) {
        sinalizarInvalido();
        avisar("Você já tentou essa palavra.", "aviso");
        return false;
    }

    if (tentativa === alvo) {
        estado.reveladas.fill(true);
        atualizarTela();
        finalizar(true);
        return true;
    }

    estado.palavrasErradas.add(tentativa);
    estado.erros++;
    tremerForca();
    som("erro");
    avisar(`"${tentativa}" não é a palavra. Você perdeu 1 vida.`, "erro");
    atualizarTela();
    verificarFim();
    return true;
}

function revelarDica() {
    if (estado.acabou) return;

    if (estado.erros >= MAX_ERROS - 1) {
        avisar("Você não tem vidas suficientes para usar a dica.", "aviso");
        return;
    }

    const pendentes = [...new Set(estado.base.filter((c, i) => !estado.reveladas[i]))];
    if (pendentes.length === 0) return;

    const letra = pendentes[Math.floor(Math.random() * pendentes.length)];
    const tecla = estado.teclas[letra];

    estado.usadas.add(letra);
    revelarLetra(letra);
    estado.erros++;
    estado.dicasUsadas++;

    tecla.disabled = true;
    tecla.classList.add("acerto", "tecla--dica");

    som("dica");
    avisar(`Dica: a letra ${letra} foi revelada (−1 vida).`, "dica");

    atualizarTela();
    verificarFim();
}

function verificarFim() {
    if (estado.reveladas.every(Boolean)) {
        finalizar(true);
    } else if (estado.erros >= MAX_ERROS) {
        finalizar(false);
    }
}

function travarControles() {
    Object.values(estado.teclas).forEach((tecla) => {
        tecla.disabled = true;
    });
    el.chute.disabled = true;
    el.btnChutar.disabled = true;
    el.btnDica.disabled = true;
}

function liberarControles() {
    Object.values(estado.teclas).forEach((tecla) => {
        tecla.className = "tecla";
        tecla.disabled = false;
    });
    el.chute.disabled = false;
    el.btnChutar.disabled = false;
}

function finalizar(venceu) {
    estado.acabou = true;
    clearTimeout(timerAviso);

    const segundos = Math.max(1, Math.round((Date.now() - estado.inicio) / 1000));

    if (venceu) {
        placar.vitorias++;
        placar.sequencia++;
        placar.recorde = Math.max(placar.recorde, placar.sequencia);

        avisar("🎉 Parabéns! Você descobriu a palavra!", "vitoria", true);
        som("vitoria");
        lancarConfete();
    } else {
        placar.derrotas++;
        placar.sequencia = 0;

        atualizarPalavra(true);
        avisar(`💀 Você perdeu! A palavra era ${estado.item.palavra}.`, "derrota", true);
        som("derrota");
    }

    salvarPlacar();
    renderizarPlacar();
    travarControles();

    timerModal = setTimeout(() => abrirModal(venceu, segundos), venceu ? 1300 : 900);
}

/* =====================================================
   JANELA DE FIM DE JOGO
   ===================================================== */
function abrirModal(venceu, segundos) {
    el.modal.dataset.resultado = venceu ? "vitoria" : "derrota";
    el.modalEmoji.textContent = venceu ? "🎉" : "💀";
    el.modalTitulo.textContent = venceu ? "Você venceu!" : "Fim de jogo";

    if (venceu) {
        el.modalTexto.textContent = estado.erros === 0
            ? "Perfeito! Você descobriu a palavra sem errar:"
            : `Mandou bem! Você descobriu a palavra com ${estado.erros} ${estado.erros === 1 ? "erro" : "erros"}:`;
    } else {
        el.modalTexto.textContent = "Não foi dessa vez. A palavra era:";
    }

    el.modalPalavra.textContent = estado.item.palavra;
    el.modalErros.textContent = `${Math.min(estado.erros, MAX_ERROS)}/${MAX_ERROS}`;
    el.modalTempo.textContent = formatarTempo(segundos);
    el.modalSequencia.textContent = placar.sequencia;

    if (typeof el.modal.showModal === "function") {
        if (!el.modal.open) el.modal.showModal();
    } else {
        el.modal.setAttribute("open", "");
    }
}

function fecharModal() {
    if (!el.modal.open) return;

    if (typeof el.modal.close === "function") {
        el.modal.close();
    } else {
        el.modal.removeAttribute("open");
    }
}

/* =====================================================
   CONFETE
   ===================================================== */
function lancarConfete() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cores = ["#38bdf8", "#818cf8", "#22c55e", "#facc15", "#f472b6", "#fb923c"];
    const camada = document.createElement("div");
    camada.className = "confete";
    camada.setAttribute("aria-hidden", "true");

    for (let i = 0; i < 80; i++) {
        const pedaco = document.createElement("span");
        pedaco.className = "confete__pedaco";
        pedaco.style.left = `${Math.random() * 100}%`;
        pedaco.style.background = cores[i % cores.length];
        pedaco.style.animationDelay = `${Math.random() * 0.8}s`;
        pedaco.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
        pedaco.style.setProperty("--giro", `${Math.random() * 720 - 360}deg`);
        pedaco.style.setProperty("--deriva", `${Math.random() * 160 - 80}px`);
        camada.appendChild(pedaco);
    }

    document.body.appendChild(camada);
    setTimeout(() => camada.remove(), 5200);
}

/* =====================================================
   NOVA RODADA
   ===================================================== */
function iniciarJogo() {
    clearTimeout(timerAviso);
    clearTimeout(timerModal);
    fecharModal();

    const item = proximoItem();

    estado.item = item;
    estado.ultimaPalavra = item.palavra;
    estado.letras = Array.from(item.palavra);
    estado.base = estado.letras.map((caractere) => normalizar(caractere));
    estado.reveladas = estado.base.map((caractere) => !/[A-Z]/.test(caractere));
    estado.usadas = new Set();
    estado.erradas = [];
    estado.palavrasErradas = new Set();
    estado.erros = 0;
    estado.dicasUsadas = 0;
    estado.acabou = false;
    estado.inicio = Date.now();

    el.categoriaChip.textContent = `${item.emoji} ${item.categoria}`;
    el.dica.textContent = item.dica;
    el.chute.value = "";

    limparMensagem();
    liberarControles();
    montarPalavra();
    atualizarTela();
}

/* =====================================================
   ENTRADAS DO JOGADOR
   ===================================================== */
function chutarDoCampo() {
    const valor = el.chute.value.trim();
    el.chute.value = "";

    const soLetras = normalizar(valor).replace(/[^A-Z]/g, "");

    if (soLetras.length === 0) {
        sinalizarInvalido();
        avisar("Digite uma letra ou a palavra inteira.", "aviso");
    } else if (soLetras.length === 1) {
        tentarLetra(soLetras);
    } else {
        arriscarPalavra(valor);
    }

    if (!estado.acabou) el.chute.focus();
}

function registrarEventos() {
    // Teclado na tela
    el.teclado.addEventListener("click", (evento) => {
        const botao = evento.target.closest(".tecla");
        if (botao && !botao.disabled) tentarLetra(botao.dataset.letra);
    });

    // Campo de chute
    el.btnChutar.addEventListener("click", chutarDoCampo);
    el.chute.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" && !evento.isComposing) {
            evento.preventDefault();
            chutarDoCampo();
        }
    });

    // Botões
    el.btnDica.addEventListener("click", revelarDica);
    el.reiniciar.addEventListener("click", iniciarJogo);

    el.categoria.addEventListener("change", () => {
        estado.categoria = el.categoria.value;
        estado.fila = [];
        el.categoria.blur();
        iniciarJogo();
    });

    el.btnSom.addEventListener("click", () => {
        somLigado = !somLigado;
        salvarSom();
        renderizarSom();
        som("acerto");
    });

    el.btnZerar.addEventListener("click", () => {
        if (window.confirm("Deseja zerar o placar?")) {
            placar = { vitorias: 0, derrotas: 0, sequencia: 0, recorde: 0 };
            salvarPlacar();
            renderizarPlacar();
        }
    });

    // Janela de fim de jogo
    el.modalJogar.addEventListener("click", iniciarJogo);
    el.modalFechar.addEventListener("click", fecharModal);
    el.modal.addEventListener("click", (evento) => {
        if (evento.target === el.modal) fecharModal();
    });

    // Teclado físico (aceita maiúsculas, minúsculas e acentos)
    document.addEventListener("keydown", (evento) => {
        if (evento.ctrlKey || evento.metaKey || evento.altKey || evento.isComposing) return;
        if (el.modal.open) return;

        const alvo = evento.target;
        if (alvo instanceof HTMLElement && alvo.matches("input, textarea, select")) return;

        if (/^[A-Za-zÀ-ÖØ-öø-ÿ]$/.test(evento.key)) {
            tentarLetra(evento.key);
        }
    });

    // Aviso se alguma imagem da forca não for encontrada
    el.imagem.addEventListener("error", () => {
        el.avisoImagem.hidden = false;
        el.avisoImagem.textContent = `Imagem não encontrada: ${el.imagem.getAttribute("src")}`;
    });
    el.imagem.addEventListener("load", () => {
        el.avisoImagem.hidden = true;
    });
}

/* =====================================================
   INÍCIO
   ===================================================== */
function iniciar() {
    montarTeclado();
    popularCategorias();
    precarregarImagens();
    renderizarPlacar();
    renderizarSom();
    registrarEventos();
    iniciarJogo();
}

iniciar();