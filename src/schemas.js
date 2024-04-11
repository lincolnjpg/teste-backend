const Joi = require('joi')
const constants = require('./constants')

const eligibilityCheckInput = Joi.object({
    numeroDoDocumento: Joi.alternatives()
        .try(Joi.string().pattern(new RegExp('^\\d{11}$')), Joi.string().pattern(new RegExp('^\\d{14}$')))
        .required(),
    tipoDeConexao: Joi.string()
        .valid(constants.TIPO_DE_CONEXAO_MONOFASICO, constants.TIPO_DE_CONEXAO_BIFASICO, constants.TIPO_DE_CONEXAO_TRIFASICO)
        .required(),
    classeDeConsumo: Joi.string()
        .valid( constants.CLASSE_DE_CONSUMO_RESIDENCIAL, constants.CLASSE_DE_CONSUMO_INDUSTRIAL, constants.CLASSE_DE_CONSUMO_COMERCIAL, constants.CLASSE_DE_CONSUMO_RURAL, constants.CLASSE_DE_CONSUMO_PODER_PUBLICO)
        .required(),
    modalidadeTarifaria: Joi.string()
        .valid(constants.MODALIDADE_TARIFARIA_AZUL, constants.MODALIDADE_TARIFARIA_BRANCA, constants.MODALIDADE_TARIFARIA_VERDE, constants.MODALIDADE_TARIFARIA_CONVENCIONAL)
        .required(),
    historicoDeConsumo: Joi.array()
        .min(3)
        .max(12)
        .required()
})

module.exports = eligibilityCheckInput
