const msgPai = document.querySelector('.js-requisicao');

class Button {
    constructor(classe, textContent, funcao) {
        this.tag = "button";
        this.classe = classe;
        this.textContent = textContent;
        this.funcao = funcao;
    }
    createElButton() {
        return `<${this.tag} class="${this.classe}" onclick="${this.funcao}">${this.textContent}</${this.tag}>`;
    }
}

class Card {
    constructor(planeta) {
        this.planeta = planeta;
        this.buttonEditar = new Button('card__heading-button js-editar', 'Editar', 'addEditar(this)');
        this.buttonExcluir = new Button('card__heading-button js-excluir', 'Excluir', 'addRemover(this)');
    }
    createElCard() {
        return `<div class="card__side card__side--back js-card-back">
        <div class="card__cover">
            ${this.buttonExcluir.createElButton()}
            ${this.buttonEditar.createElButton()}
            <h4 class="card__heading">
                <span class="card__heading-span">${this.planeta.nome}</span>
            </h4>
        </div>
        <div class="card__details">
            <ul>
                <li>CLIMA: ${this.planeta.clima}</li>
                <li>POPULAÇÃO: ${this.planeta.populacao}</li>
                <li>DIÂMETO: ${this.planeta.diametro}</li>
                <li>TEMPO ROTAÇÃO: ${this.planeta.rotacao}</li>
                <li>TEMPO TRANSLAÇÃO: ${this.planeta.translacao}</li>
            </ul>
        </div>
    </div>
    <div class="card__side card__side--front js-card-front">
        <div class="card__theme">
            <div class="card__theme-box">
                <p class="card__subject">Planetas</p>
                <p class="card__title">${this.planeta.nome}</p>
            </div>
        </div>
    </div>`
    }
}
class Planeta {
    constructor(nome, clima, populacao, diametro, rotacao, translacao) {
        this.nome = nome;
        this.clima = clima;
        this.populacao = populacao;
        this.diametro = diametro;
        this.rotacao = rotacao;
        this.translacao = translacao;
    }
}

class Mensagem {
    constructor(classe, textContent) {
        this.tag = 'span'
        this.classe = classe;
        this.textContent = textContent;
    }
    createElMensagem() {
        return `<${this.tag} class="${this.classe}">${this.textContent}</${this.tag}>`
    }
}

class Input {
    constructor(classe, type, value, funcao) {
        this.tag = 'input'
        this.classe = classe;
        this.type = type;
        this.value = value;
        this.funcao = funcao;
    }
    createElInput() {
        return `<${this.tag} type="${this.type}" class="${this.classe}" value="${this.value}" onfocusout="${this.funcao}"></${this.tag}>`
    }
}

const addRemover = (element) => {
    const card = element.parentNode.parentNode.parentNode;
    card.remove();
}

const editLine = (element) => {
    const li = element.parentNode;
    li.textContent += element.value;
    element.remove();
}

const addEditar = (element) => {
    const card = element.parentNode.parentNode.parentNode;
    const backInfo = card.querySelector('.js-card-back');
    backInfo.querySelectorAll('li').forEach(element => {
        const input = new Input('card-input', 'text', element.textContent.split(': ')[1], "editLine(this)");
        element.innerHTML = `${element.textContent.split(': ')[0]}: ${input.createElInput()}`;
    });
    card.addEventListener('mouseleave', (ev) => {
        card.querySelectorAll('input').forEach(input => {
            editLine(input);
        });
    })
}

//FUNÇÃO GERADORA!!!
function* guardaEstadoPaginacao() {
    let index = 2;
    while (true) yield index++;
}

const geradora = guardaEstadoPaginacao();


const createLinkPaginacao = (numero) => {
    const buttton = new Button('js-pagina-button', numero, 'mostrarMais(this, ' + numero * 10 + ')');
    const pages = document.querySelector('.js-pages');
    pages.innerHTML += buttton.createElButton();
}

async function recuperarDadosSw(url) {
    try {
        const promise = await fetch(url);
        const json = await promise.json();
        if (json.next !== null) {
            const nrProximaPagina = geradora.next().value;
            return {
                json: json,
                pagina: nrProximaPagina
            };
        } else {
            geradora.return(false);
            return {
                json: json,
                pagina: null
            };
        }
    } catch (error) {
        const erro = false;
        return erro;
    }
}

async function criaCards(paginacao) {
    const resultado = await recuperarDadosSw(`https://swapi.dev/api/planets/?page=${paginacao}`);

    if (resultado != false) {
        const mensagem = new Mensagem("mensagem_requisicao js-msgRequisicao", "Carregando...");
        msgPai.innerHTML = mensagem.createElMensagem();
    } else {
        const mensagem = new Mensagem("mensagem_requisicao js-msgRequisicao", "Erro ao realizar carregamento");
        msgPai.innerHTML = mensagem.createElMensagem();
        return;
    }

    const planetas = resultado.json.results;
    const artboard = document.querySelector('.artboard');

    planetas.forEach(element => {
        let planeta = new Planeta(
            element.name,
            element.climate,
            element.population,
            element.diameter,
            element.rotation_period,
            element.orbital_period
        );
        let card = document.createElement('div');
        card.setAttribute('class', 'card js-card');

        const cardElement = new Card(planeta);
        card.innerHTML = `${cardElement.createElCard()}`;
        artboard.append(card);
    });

    createLinkPaginacao(paginacao);

    if (resultado.pagina !== null) criaCards(resultado.pagina);
    if (msgPai.hasChildNodes()) msgPai.firstChild.remove();
}

criaCards(1);