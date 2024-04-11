const assert = require('assert');
const constants = require('../src/constants')
const { validaClasseDeConsumo, validaModalidadeTarifaria, validaConsumoMinimo, calculaConsumoMedio, calculaConsumoTotal, calculaProjecaoEconomiaCO2, validaElegibilidade } = require('../src/eligibility');

describe('teste da função validaClasseDeConsumo', function () {
    it('deve retornar true quando a classe de consumo é residencial', function () {
        assert.equal(validaClasseDeConsumo(constants.CLASSE_DE_CONSUMO_RESIDENCIAL), true);
    })

    it('deve retornar true quando a classe de consumo é industrial', function () {
        assert.equal(validaClasseDeConsumo(constants.CLASSE_DE_CONSUMO_INDUSTRIAL), true);
    })

    it('deve retornar true quando a classe de consumo é comercial', function () {
        assert.equal(validaClasseDeConsumo(constants.CLASSE_DE_CONSUMO_COMERCIAL), true);
    })

    it('deve retornar false quando a classe de consumo é rural', function () {
        assert.equal(validaClasseDeConsumo(constants.CLASSE_DE_CONSUMO_RURAL), false);
    })

    it('deve retornar false quando a classe de consumo é poderPublico', function () {
        assert.equal(validaClasseDeConsumo(constants.CLASSE_DE_CONSUMO_PODER_PUBLICO), false);
    })
})

describe('teste da função validaModalidadeTarifaria', function () {
    it('deve retornar true quando a modalidade tarifaria é convencional', function () {
        assert.equal(validaModalidadeTarifaria(constants.MODALIDADE_TARIFARIA_CONVENCIONAL), true);
    })

    it('deve retornar true quando a modalidade tarifaria é branca', function () {
        assert.equal(validaModalidadeTarifaria(constants.MODALIDADE_TARIFARIA_BRANCA), true);
    })

    it('deve retornar false quando a modalidade tarifaria é azul', function () {
        assert.equal(validaModalidadeTarifaria(constants.MODALIDADE_TARIFARIA_AZUL), false);
    })

    it('deve retornar false quando a modalidade tarifaria é verde', function () {
        assert.equal(validaModalidadeTarifaria(constants.MODALIDADE_TARIFARIA_VERDE), false);
    })
})

describe('teste da função validaConsumoMinimo', function () {
    const tipoDeConexao = constants.TIPO_DE_CONEXAO_MONOFASICO;

    describe('quando o tipo de conexão for monofasico', function () {
        it('deve retornar true quando a média de consumo for maior ou igual a 400', function () {
            assert.equal(validaConsumoMinimo(tipoDeConexao, Math.random() * (9999 - constants.CONSUMO_MINIMO_MONOFASICO + 1) + constants.CONSUMO_MINIMO_MONOFASICO), true)
        })

        it('deve retornar false quando a média de consumo for menor que 400', function () {
            assert.equal(validaConsumoMinimo(tipoDeConexao, Math.random() + constants.CONSUMO_MINIMO_MONOFASICO - 1), false)
        })
    })

    describe('quando o tipo de conexão for bifasico', function () {
        const tipoDeConexao = constants.TIPO_DE_CONEXAO_BIFASICO;

        it('deve retornar true quando a média de consumo for maior ou igual a 500', function () {
            assert.equal(validaConsumoMinimo(tipoDeConexao, Math.random() * (9999 - constants.CONSUMO_MINIMO_BIFASICO + 1) + constants.CONSUMO_MINIMO_BIFASICO), true)
        })

        it('deve retornar false quando a média de consumo for menor que 500', function () {
            assert.equal(validaConsumoMinimo(tipoDeConexao, Math.random() + constants.CONSUMO_MINIMO_BIFASICO - 1), false)
        })
    })

    describe('quando o tipo de conexão for trifasico', function () {
        const tipoDeConexao = constants.TIPO_DE_CONEXAO_TRIFASICO;

        it('deve retornar true quando a média de consumo for maior ou igual a 750', function () {
            assert.equal(validaConsumoMinimo(tipoDeConexao, Math.random() * (9999 - constants.CONSUMO_MINIMO_TRIFASICO + 1) + constants.CONSUMO_MINIMO_TRIFASICO), true)
        })

        it('deve retornar false quando a média de consumo for menor que 750', function () {
            assert.equal(validaConsumoMinimo(tipoDeConexao, Math.random() + constants.CONSUMO_MINIMO_TRIFASICO - 1), false)
        })
    })
})


describe('teste da função calculaConsumoMedio', function () {
    it('deve lançar uma exceção quando o histórico de consumo for um array vazio', function () {
        assert.throws(
            () => {
                calculaConsumoMedio([]);
            },
            Error
        );
    })

    it('retorna a média de consumo quando o histórico de consumo não for um array vazio', function () {
        const historicoDeConsumo = [
            1395,
            854,
            968,
            968,
            1000,
            1108,
            850,
            1280,
            947,
            912,
            900,
            639,
        ];

        assert.equal(calculaConsumoMedio(historicoDeConsumo), historicoDeConsumo.reduce((consumoAcumulado, valorAtual) => consumoAcumulado + valorAtual, 0) / historicoDeConsumo.length);
    })

})

describe('teste da função calculaConsumoTotal', function () {
    it('deve retornar o consumo total de energia no período do histórico de consumo', function () {
        const historicoDeConsumo = [
            1395,
            854,
            968,
            968,
            1000,
            1108,
            850,
            1280,
            947,
            912,
            900,
            639,
        ];

        assert.equal(calculaConsumoTotal(historicoDeConsumo), 11821);
    })
})

describe('teste da função calculaProjecaoEconomiaCO2', function () {
    it('deve lançar uma exceção quando o histórico de consumo for um array vazio', function () {
        assert.throws(
            () => {
                calculaProjecaoEconomiaCO2(0);
            },
            Error
        );
    })
})

describe('teste da função validaElegibilidade', function () {
    describe('quando a classe de consumo é residencial, a modalidade tarifária é convencional, o tipo de conexão é monofasico e a média de consumo é maior ou igual a 400', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(400)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 403.20
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é industrial, a modalidade tarifária é convencional, o tipo de conexão é monofasico e a média de consumo é maior ou igual a 400', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(400)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 403.20
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é comercial, a modalidade tarifária é convencional, o tipo de conexão é monofasico e a média de consumo é maior ou igual a 400', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_COMERCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(400)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 403.20
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é residencial, a modalidade tarifária é convencional, o tipo de conexão é bifasico e a média de consumo é maior ou igual a 500', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 504.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é industrial, a modalidade tarifária é convencional, o tipo de conexão é bifasico e a média de consumo é maior ou igual a 500', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 504.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é comercial, a modalidade tarifária é convencional, o tipo de conexão é bifasico e a média de consumo é maior ou igual a 500', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_COMERCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 504.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é residencial, a modalidade tarifária é convencional, o tipo de conexão é trifasico e a média de consumo é maior ou igual a 750', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(750)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 756.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é industrial, a modalidade tarifária é convencional, o tipo de conexão é trifasico e a média de consumo é maior ou igual a 750', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(750)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 756.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é comercial, a modalidade tarifária é convencional, o tipo de conexão é trifasico e a média de consumo é maior ou igual a 750', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_COMERCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(750)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 756.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é residencial, a modalidade tarifária é branca, o tipo de conexão é monofasico e a média de consumo é maior ou igual a 400', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(400)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 403.20
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é industrial, a modalidade tarifária é branca, o tipo de conexão é monofasico e a média de consumo é maior ou igual a 400', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(400)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 403.20
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é comercial, a modalidade tarifária é branca, o tipo de conexão é monofasico e a média de consumo é maior ou igual a 400', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_COMERCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(400)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 403.20
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é residencial, a modalidade tarifária é branca, o tipo de conexão é bifasico e a média de consumo é maior ou igual a 500', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 504.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é industrial, a modalidade tarifária é branca, o tipo de conexão é bifasico e a média de consumo é maior ou igual a 500', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 504.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é comercial, a modalidade tarifária é branca, o tipo de conexão é bifasico e a média de consumo é maior ou igual a 500', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_COMERCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 504.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é residencial, a modalidade tarifária é branca, o tipo de conexão é trifasico e a média de consumo é maior ou igual a 750', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(750)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 756.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é industrial, a modalidade tarifária é branca, o tipo de conexão é trifasico e a média de consumo é maior ou igual a 750', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(750)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 756.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é comercial, a modalidade tarifária é branca, o tipo de conexão é trifasico e a média de consumo é maior ou igual a 750', function () {
        it('deve informar a elegibilidade e a economia anual de CO2', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_COMERCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(750)
            };
            const resultadoEsperado = {
                elegivel: true,
                economiaAnualDeCO2: 756.00
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_CONVENCIONAL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é azul', function () {
        it('deve informar a não inelegibilidade pela não aceitação desta modalidade tarifária', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é verde', function () {
        it('deve informar a não inelegibilidade pela não aceitação desta modalidade tarifária', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RESIDENCIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural e a modalidade tarifária é azul', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da modalidade tarifária', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural e a modalidade tarifária é verde', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da modalidade tarifária', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico e a modalidade tarifária é azul', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da modalidade tarifária', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico e a modalidade tarifária é verde', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da modalidade tarifária', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(500)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_BRANCA,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é azul, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é azul, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é azul, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é verde, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é verde, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a modalidade tarifária é verde, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_INDUSTRIAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, a modalidade tarifária é azul, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, a modalidade tarifária é verde, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, a modalidade tarifária é azul, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, a modalidade tarifária é verde, o tipo de conexão é monofasico e a média de consumo é inferior a 400', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_MONOFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(399)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, a modalidade tarifária é azul, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, a modalidade tarifária é verde, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, a modalidade tarifária é azul, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, a modalidade tarifária é verde, o tipo de conexão é bifasico e a média de consumo é inferior a 500', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_BIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(499)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, a modalidade tarifária é azul, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é rural, a modalidade tarifária é verde, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_RURAL,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, a modalidade tarifária é azul, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_AZUL,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })

    describe('quando a classe de consumo é poderPublico, a modalidade tarifária é verde, o tipo de conexão é trifasico e a média de consumo é inferior a 750', function () {
        it('deve informar a não inelegibilidade pela não aceitação da classe de consumo, da modalidade tarifária e também da média de consumo', function () {
            const input = {
                tipoDeConexao: constants.TIPO_DE_CONEXAO_TRIFASICO,
                classeDeConsumo: constants.CLASSE_DE_CONSUMO_PODER_PUBLICO,
                modalidadeTarifaria: constants.MODALIDADE_TARIFARIA_VERDE,
                historicoDeConsumo: Array(12).fill(749)
            };
            const resultadoEsperado = {
                elegivel: false,
                razoesDeInelegibilidade: [
                    constants.CLASSE_DE_CONSUMO_NAO_ACEITA,
                    constants.MODALIDADE_TARIFARIA_NAO_ACEITA,
                    constants.CONSUMO_MINIMO_NAO_ACEITO
                ]
            };
    
            assert.deepEqual(validaElegibilidade(input), resultadoEsperado);
        })
    })
})