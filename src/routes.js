const { StatusCodes } = require('http-status-codes')
const express = require("express");
const router = express.Router();
const { validaElegibilidade } = require('./eligibility');
const eligibilitySchema = require('./schemas');
const HTTPError = require('./errors');

router.post(
    '/eligibility-validation',
    async (req, res) => {
        const { body } = req;

        try {
            await eligibilitySchema.validateAsync(body);
            const resultado = validaElegibilidade(body);
            return res.json(resultado);
        } catch (error) {
            if (error.isJoi) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                    error: "Erro na validação do input",
                    details: error.details,
                });
            }

            if (error instanceof HTTPError) {
                return res.status(error.getStatusCode()).json({
                    errorMessage: error.message,
                    statusCode: error.getStatusCode(),
                });
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        }
    }
);

module.exports = router;