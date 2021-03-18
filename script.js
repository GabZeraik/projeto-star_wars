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

//ARRUMAR FUNÇÃO GERADORA!!!
function* guardaEstadoPaginacao(i = 1) {
    yield i;
    yield i + 1;
}

async function recuperarDadosSw(url) {
    try {
        const promise = await fetch(url);
        const json = await promise.json();
        console.log(json.next);
        if (json.next !== "null") {
            //ARRUMAR FUNÇÃO GERADORA!!!
            const nrProximaPagina = guardaEstadoPaginacao().next();
            console.log(nrProximaPagina);
            return {
                json: json,
                pagina: nrProximaPagina
            };
        } else {
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
    const msg = document.querySelector('.js-msgRequisicao');
    msg.textContent = "Carregando...";
    const resultado = await recuperarDadosSw(`https://swapi.dev/api/planets/?page=${paginacao}`);

    if (resultado == false) {
        msg.textContent = "Erro ao realizar carregamento";
        return;
    } else {
        //msg.remove();
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
        card.innerHTML = `      <div class="card__side card__side--back">
                                        <div class="card__cover">
                                            <button class="card__heading-button js-editar">Editar</button>
                                            <button class="card__heading-button js-excluir">Excluir</button>
                                            <h4 class="card__heading">
                                                <span class="card__heading-span">INFO</span>
                                            </h4>
                                        </div>
                                        <div class="card__details">
                                            <ul>
                                                <li>CLIMA: ${planeta.clima}</li>
                                                <li>POPULAÇÃO: ${planeta.populacao}</li>
                                                <li>DIÂMETO: ${planeta.diametro}</li>
                                                <li>TEMPO ROTAÇÃO: ${planeta.rotacao}</li>
                                                <li>TEMPO TRANSLAÇÃO: ${planeta.translacao}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="card__side card__side--front">
                                        <div class="card__theme">
                                            <div class="card__theme-box">
                                                <p class="card__subject">Planetas</p>
                                                <p class="card__title">${planeta.nome}</p>
                                            </div>
                                        </div>
                                    </div>`;
        artboard.append(card);
    });
    if (resultado.pagina !== null)
        criaCards(resultado.pagina);
}

criaCards(1);