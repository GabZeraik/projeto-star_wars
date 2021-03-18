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

async function recuperarDadosSw(url) {
    try {
        const promise = await fetch(url);
        const json = await promise.json();
        return json;
    } catch (error) {
        const erro = "Ocorreu um erro ao tentar a requisição: " + error;
        return erro;
    }
}

async function criaCards() {
    const resultado = await recuperarDadosSw('https://swapi.dev/api/planets/?page=1');
    const planetas = resultado.results;
    planetas.forEach(element => {
        let planeta = new Planeta(
            element.name,
            element.climate,
            element.population,
            element.diameter,
            element.rotation_period,
            element.orbital_period
        )




    });
}

criaCards();