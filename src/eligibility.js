const { StatusCodes } = require('http-status-codes')
const constants = require('./constants')
const HTTPError = require('./errors')

function validaClasseDeConsumo(classeDeConsumo) {
    const classesDeConsumoAceitas = [
        constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
        constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
        constants.CLASSE_DE_CONSUMO_COMERCIAL,
    ];
    return classesDeConsumoAceitas.includes(classeDeConsumo);
}

function validaModalidadeTarifaria(modalidadeTarifaria) {
    const modalidadesTarifariasAceitas = [
        constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
        constants.MODALIDADE_TARIFARIA_BRANCA,
    ];
    return modalidadesTarifariasAceitas.includes(modalidadeTarifaria);
}

function validaConsumoMinimo(tipoDeConexao, mediaDeConsumo) {
    switch (tipoDeConexao) {
        case constants.TIPO_DE_CONEXAO_MONOFASICO:
            return mediaDeConsumo >= constants.CONSUMO_MINIMO_MONOFASICO;
        case constants.TIPO_DE_CONEXAO_BIFASICO:
            return mediaDeConsumo >= constants.CONSUMO_MINIMO_BIFASICO;
        case constants.TIPO_DE_CONEXAO_TRIFASICO:
            return mediaDeConsumo >= constants.CONSUMO_MINIMO_TRIFASICO;
        default:
            return false;
    }
}

function calculaConsumoMedio(historicoDeConsumo) {
    if (!historicoDeConsumo.length) {
        throw new HTTPError(constants.HISTORICO_DE_CONSUMO_VAZIO, StatusCodes.BAD_REQUEST);
    }

    const consumoTotalDoHistorico = calculaConsumoTotal(historicoDeConsumo);

    return consumoTotalDoHistorico / historicoDeConsumo.length;
}

function calculaConsumoTotal(historicoDeConsumo) {
    return historicoDeConsumo.reduce(
        (consumoAcumulado, valorAtual) => consumoAcumulado + valorAtual,
        0
    );
}

function calculaProjecaoEconomiaCO2(consumoTotal) {
    if (!consumoTotal) {
        throw new HTTPError(constants.CONSUMO_TOTAL_INVALIDO, StatusCodes.BAD_REQUEST)
    }

    const taxaCO2PorKWh = 84 / 1000;

    return Number((consumoTotal * taxaCO2PorKWh).toFixed(2));
}

function validaElegibilidade({ tipoDeConexao, classeDeConsumo, modalidadeTarifaria, historicoDeConsumo}) {
    const razoesDeInelegibilidade = [];

    if (!validaClasseDeConsumo(classeDeConsumo)) {
        razoesDeInelegibilidade.push(constants.CLASSE_DE_CONSUMO_NAO_ACEITA);
    }

    if (!validaModalidadeTarifaria(modalidadeTarifaria)) {
        razoesDeInelegibilidade.push(constants.MODALIDADE_TARIFARIA_NAO_ACEITA);
    }

    const mediaDeConsumo = calculaConsumoMedio(historicoDeConsumo);

    if (!validaConsumoMinimo(tipoDeConexao, mediaDeConsumo)) {
        razoesDeInelegibilidade.push(constants.CONSUMO_MINIMO_NAO_ACEITO);
    }
    if (razoesDeInelegibilidade.length) {
        return {
            elegivel: false,
            razoesDeInelegibilidade
        }
    }
    return {
        elegivel: true,
        economiaAnualDeCO2: calculaProjecaoEconomiaCO2(calculaConsumoTotal(historicoDeConsumo))
    }
}

module.exports = {
    validaClasseDeConsumo,
    validaModalidadeTarifaria,
    validaConsumoMinimo,
    calculaConsumoMedio,
    calculaConsumoTotal,
    calculaProjecaoEconomiaCO2,
    validaElegibilidade
}
