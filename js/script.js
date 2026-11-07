// =====================================================
// JOGO DA FORCA - lógica do jogo
// =====================================================

// ---------- Configurações ----------
const MAX_ERROS = 6;

// Para adicionar palavras, basta incluir novos itens (sem acento, em maiúsculas)
const PALAVRAS = [
    { palavra: "ABACAXI", dica: "Fruta" },
    { palavra: "BANANA", dica: "Fruta" },
    { palavra: "MORANGO", dica: "Fruta" },
    { palavra: "CACHORRO", dica: "Animal" },
    { palavra: "ELEFANTE", dica: "Animal" },
    { palavra: "GIRAFA", dica: "Animal" },
    { palavra: "TARTARUGA", dica: "Animal" },
    { palavra: "COMPUTADOR", dica: "Tecnologia" },
    { palavra: "TECLADO", dica: "Tecnologia" },
    { palavra: "INTERNET", dica: "Tecnologia" },
    { palavra: "JAVASCRIPT", dica: "Linguagem de programação" },
    { palavra: "PROGRAMACAO", dica: "Profissão da área de TI" },
    { palavra: "BRASIL", dica: "País" },
    { palavra: "PORTUGAL", dica: "País" },
    { palavra: "ARGENTINA", dica: "País" },
    { palavra: "FUTEBOL", dica: "Esporte" },
    { palavra: "BASQUETE", dica: "Esporte" },
    { palavra: "NATACAO", dica: "Esporte" },
    { palavra: "GUITARRA", dica: "Instrumento musical" },
    { palavra: "VIOLINO", dica: "Instrumento musical" },
    { palavra: "BICICLETA", dica: "Meio de transporte" },
    { palavra: "HELICOPTERO", dica: "Meio de transporte" },
    { palavra: "CHOCOLATE", dica: "Doce" },
    { palavra: "PIZZA", dica: "Comida" },
    { palavra: "ESCOLA", dica: "Lugar" },
    { palavra: "BIBLIOTECA", dica: "Lugar" },
    { palavra: "MONTANHA", dica: "Natureza" },
    { palavra: "OCEANO", dica: "Natureza" }
];

// ---------- Elementos da página ----------
const elImagem = document.getElementById("forca");
const elCaixaForca = document.getElementById("caixa-forca");
const elVidas = document.querySelectorAll("#vidas .vida");
const elErros = document.getElementById("erros");
const elDica = document.getElementById("dica");
const elPalavra = document.getElementById("palavra");
const elLetrasErradas = document.getElementById("letras-erradas");
const elMensagem = document.getElementById("mensagem");
const elTeclado = document.getElementById("teclado");
const elChute = document.getElementById("chute");
const elBtnChutar = document.getElementById("btn-chutar");
const elReiniciar = document.getElementById("reiniciar");

// ---------- Estado do jogo ----------
let palavraSecreta = "";
let letrasCorretas = [];
let letrasErradas = [];
let jogoAcabou = false;
let ultimoIndice = -1;
let timerAviso = null;

// =====================================================
// Funções auxiliares
// =====================================================

// Remove acentos e deixa em maiúsculo (ex.: "ç" vira "C")
function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

// Sorteia uma palavra, evitando repetir a anterior
function sortearPalavra() {
    let indice;
    do {
        indice = Math.floor(Math.random() * PALAVRAS.length);
    } while (indice === ultimoIndice && PALAVRAS.length > 1);

    ultimoIndice = indice;
    return PALAVRAS[indice];
}

// Reinicia uma animação CSS adicionando a classe de novo
function animar(elemento, classe, duracao) {
    elemento.classList.remove(classe);
    void elemento.offsetWidth; // força o navegador a recalcular
    elemento.classList.add(classe);
    setTimeout(() => elemento.classList.remove(classe), duracao);
}

// =====================================================
// Atualização da tela
// =====================================================

// revelar = true mostra a palavra inteira (usado na derrota)
function atualizarPalavra(revelar = false) {
    const letras = palavraSecreta.split("").map((letra) => {
        if (revelar || letrasCorretas.includes(letra)) {
            return letra;
        }
        return "_";
    });
    elPalavra.textContent = letras.join(" ");
}

function atualizarImagem() {
    elImagem.src = `../img/forca-${letrasErradas.length}.svg`;
}

function atualizarVidas() {
    elVidas.forEach((vida, indice) => {
        vida.classList.toggle("perdida", indice < letrasErradas.length);
    });
}

function atualizarTela() {
    atualizarPalavra();
    atualizarImagem();
    atualizarVidas();
    elErros.textContent = letrasErradas.length;
    elLetrasErradas.textContent =
        letrasErradas.length > 0 ? letrasErradas.join(", ") : "nenhuma";
}

// Aviso rápido (letra repetida, campo vazio, etc.)
function mostrarAviso(texto) {
    clearTimeout(timerAviso);
    elMensagem.className = "jogo__mensagem";
    elMensagem.textContent = texto;

    timerAviso = setTimeout(() => {
        if (!jogoAcabou) {
            elMensagem.textContent = "";
        }
    }, 2000);
}

function sinalizarInvalido() {
    animar(elChute, "invalido", 400);
}

function tremerForca() {
    animar(elCaixaForca, "tremer", 450);
}

// =====================================================
// Controles (teclado na tela + campo de chute)
// =====================================================

function definirControles(habilitado) {
    elTeclado.querySelectorAll(".tecla").forEach((tecla) => {
        tecla.disabled = !habilitado;
    });
    elChute.disabled = !habilitado;
    elBtnChutar.disabled = !habilitado;
}

function limparTeclado() {
    elTeclado.querySelectorAll(".tecla").forEach((tecla) => {
        tecla.classList.remove("acerto", "erro");
        tecla.disabled = false;
    });
}

// =====================================================
// Lógica principal
// =====================================================

function tentarLetra(entrada) {
    if (jogoAcabou) return;

    const letra = normalizar(entrada);

    // Precisa ser exatamente uma letra de A a Z
    if (!/^[A-Z]$/.test(letra)) {
        sinalizarInvalido();
        mostrarAviso("Digite apenas uma letra de A a Z.");
        return;
    }

    // Letra repetida
    if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) {
        sinalizarInvalido();
        mostrarAviso(`Você já tentou a letra ${letra}.`);
        return;
    }

    const botao = elTeclado.querySelector(`[data-letra="${letra}"]`);

    if (palavraSecreta.includes(letra)) {
        letrasCorretas.push(letra);
        botao.classList.add("acerto");
    } else {
        letrasErradas.push(letra);
        botao.classList.add("erro");
        tremerForca();
    }

    botao.disabled = true;
    atualizarTela();
    verificarFim();
}

function verificarFim() {
    const venceu = palavraSecreta
        .split("")
        .every((letra) => letrasCorretas.includes(letra));

    if (venceu) {
        finalizar(true);
    } else if (letrasErradas.length >= MAX_ERROS) {
        finalizar(false);
    }
}

function finalizar(venceu) {
    jogoAcabou = true;
    clearTimeout(timerAviso);
    definirControles(false);

    if (venceu) {
        elMensagem.className = "jogo__mensagem vitoria";
        elMensagem.textContent = "🎉 Parabéns! Você acertou a palavra!";
    } else {
        atualizarPalavra(true);
        elMensagem.className = "jogo__mensagem derrota";
        elMensagem.textContent = `💀 Você perdeu! A palavra era ${palavraSecreta}.`;
    }
}

function iniciarJogo() {
    const sorteio = sortearPalavra();

    palavraSecreta = sorteio.palavra;
    letrasCorretas = [];
    letrasErradas = [];
    jogoAcabou = false;

    clearTimeout(timerAviso);
    elDica.textContent = sorteio.dica;
    elMensagem.className = "jogo__mensagem";
    elMensagem.textContent = "";
    elChute.value = "";

    limparTeclado();
    definirControles(true);
    atualizarTela();
    elChute.focus();
}

// =====================================================
// Eventos
// =====================================================

// Clique nas teclas da tela
elTeclado.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".tecla");
    if (botao) {
        tentarLetra(botao.dataset.letra);
    }
});

// Chutar pelo campo de texto
function chutarDoCampo() {
    const valor = elChute.value.trim();
    elChute.value = "";

    if (valor === "") {
        sinalizarInvalido();
        mostrarAviso("Digite uma letra antes de chutar.");
        return;
    }

    tentarLetra(valor);

    if (!jogoAcabou) {
        elChute.focus();
    }
}

elBtnChutar.addEventListener("click", chutarDoCampo);

elChute.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        chutarDoCampo();
    }
});

// Teclado físico: digitar uma letra fora do campo também chuta
document.addEventListener("keydown", (evento) => {
    if (evento.target === elChute) return;
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;

    if (/^[a-zA-ZÀ-ÿ]$/.test(evento.key)) {
        tentarLetra(evento.key);
    }
});

elReiniciar.addEventListener("click", iniciarJogo);

// =====================================================
// Começa o jogo ao carregar a página
// =====================================================
iniciarJogo();