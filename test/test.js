require('./../common/linq');
require('./../common/constants');

var common      = require('./../common');
var email       = require('./../common/email');
var security    = require('./../security/signature');
var assert      = require('assert');

describe('Array-LINQ', function() {
    describe('#any()', function() {
        it('Deve retornar (true) quando o predicado passado encontrar alguma correspondência', function() {
            // Teste #1
            assert.equal(true, [1,2,3].any(3));
            // Teste #2
            assert.equal(true, [
                { index: 1 },
                { index: 2 },
                { index: 3 }
            ].any({
                index: 3
            }));
        });

        it('Deve retornar (false) quando o predicado passado não encontrar alguma correspondência', function() {
            // Teste #1
            assert.equal(false, [1,2,3].any(0));
            // Teste #2
            assert.equal(false, [
                { index: 1 },
                { index: 2 },
                { index: 3 }
            ].any({
                index: 0
            }));
        });
    });

    describe('#select()', function() {
        it('Deve retornar um (array) do novo objeto mapeado com os valores correspondentes', function() {
            assert.deepEqual([{
                numberProperty: 1,
                stringProperty: '$tr!ng',
                birthDProperty: [24, 3, 1991]
            }], [{
                UPPER_NUMBER_PROPERTY: 1,
                UPPER_STRING_PROPERTY: '$tr!ng',
                ARRAY_COMPLEX_PROPERTY: [24, 3, 1991]
            }].select({
                "numberProperty": "UPPER_NUMBER_PROPERTY",
                "stringProperty": "UPPER_STRING_PROPERTY",
                "birthDProperty": "ARRAY_COMPLEX_PROPERTY"
            }));
        });

        it('Deve retornar um (array) do novo objeto mapeado com os valores (undefined)', function() {
            assert.deepEqual([{
                numberProperty: undefined,
                stringProperty: undefined
            }], [{
                __UPPER_NUMBER_PROPERTY__: 1,
                __UPPER_STRING_PROPERTY__: '$tr!ng'
            }].select({
                "numberProperty": "UPPER_NUMBER_PROPERTY",
                "stringProperty": "UPPER_STRING_PROPERTY"
            }));
        });

        it('Deve retornar um (array) simples com os valores correspondentes da propriedade passada', function() {
            assert.deepEqual([1, 2], [{
                __UPPER_NUMBER_PROPERTY__: 1,
                __UPPER_STRING_PROPERTY__: '$tr!ng'
            }, {
                __UPPER_NUMBER_PROPERTY__: 2,
                __UPPER_STRING_PROPERTY__: '$tr!ng'
            }].select("__UPPER_NUMBER_PROPERTY__"));
        });
    });

    describe('#where()', function() {
        var array = [{
            id: 1,
            name: 'a',
            gender: 'f'
        }, {
            id: 2,
            name: 'b',
            gender: 'f'
        }, {
            id: 3,
            name: 'c',
            gender: 'm'
        }];

        it('Deve retornar um (array) do objeto atual quando o filtro passado encontrar alguma correspondência', function() {
            // Teste #1
            assert.deepEqual([{
                id: 2,
                name: 'b',
                gender: 'f'
            }], array.where({ id: 2 }));
            // Teste #2
            assert.deepEqual([{
                id: 3,
                name: 'c',
                gender: 'm'
            }], array.where({ name: 'c' }));
            // Teste #3
            assert.deepEqual([{
                id: 1,
                name: 'a',
                gender: 'f'
            }, {
                id: 2,
                name: 'b',
                gender: 'f'
            }], array.where({ gender: 'f' }));
        });

        it('Deve retornar um (array) vazio quando o filtro passado não encontrar alguma correspondência', function() {
            // Teste #1
            assert.deepEqual([], array.where({ id: 4 }));
            // Teste #2
            assert.deepEqual([], array.where({ name: 'd' }));
            // Teste #3
            assert.deepEqual([], array.where({ name: '1', gender: 'm' }));
        });
    });
});

describe('Common', function() {
    describe('#parseAuthHeader()', function() {
        it('Deve retornar o objeto ({type: authType, token: key}) de acordo com o (Authorization Header) passado', function() {
            // Teste #1
            assert.deepEqual({
                type: 'bearer',
                token: 'xpt0cd321'
            }, common.parseAuthHeader('Bearer xpt0cd321'));
            // Teste #2
            assert.deepEqual({
                type: 'basic',
                token: 'xpt0cd321'
            }, common.parseAuthHeader('Basic   xpt0cd321'));
            // Teste #3
            assert.deepEqual({
                type: 'sometype',
                token: 'xpt0cd321'
            }, common.parseAuthHeader('SomeType xpt0cd321'));
            // Teste #4
            assert.deepEqual({
                type: '',
                token: ''
            }, common.parseAuthHeader(''));
            // Teste #5
            assert.deepEqual({
                type: '',
                token: ''
            }, common.parseAuthHeader(null));
        });
    });

    describe('#validation.requiredFor', function() {
        it('Deve retornar o objeto ({field[i]: { presence: true }}) de acordo com os campos passados', function() {
            var fields = [
                'name',
                'username',
                'password'
            ];
            var constraints = {
                name: {
                    presence: true
                },
                username: {
                    presence: true
                },
                password: {
                    presence: true
                }
            };

            // Teste #1
            assert.deepEqual({}, common.validation.requiredFor());
            // Teste #2
            assert.notDeepEqual(constraints, common.validation.requiredFor('name', 'username', 'password_'));
            // Teste #3
            assert.deepEqual(constraints, common.validation.requiredFor(fields));
            // Teste #4
            assert.deepEqual(constraints, common.validation.requiredFor('name', 'username', 'password'));
        });
    });

    describe('#dateTime.now()', function() {
        it('Deve retornar o horário oficial brasileiro independente da localização do servidor', function() {
            var now = new Date();
            now.setMinutes(now.getMinutes() - 180);

            assert.equal(now.toISOString().substring(0, 19), common.dateTime.now().format().substring(0, 19));
        });
    });
});

describe('Security', function() {
    describe('#signature.password()', function() {
        it('Deve criptografar a senha e compará-la adequadamente para validação', function() {            
            var salt = security.salt();
            var rawPassword = 'P@$$w0rd';
            var invalidPassword = 'P@$$w0rD';
            var hashPassword = security.password(salt, rawPassword);
            
            assert.equal(hashPassword, security.password(salt, rawPassword));
            assert.notEqual(hashPassword, security.password(salt, invalidPassword))
        });
    });

    describe('#signature.token()', function() {
        it('Deve gerar tokens diferentes para a mesma chave', function() {            
            var tokenKey = 'T0K&n';
            var tokenA = security.token(tokenKey);
            var tokenB = security.token(tokenKey);
            
            assert.notEqual(tokenA, tokenB)
        });
    });
});

describe('Email', function() {
    describe('#send()', function() {
        it('Não deve jogar uma exceção ao enviar um email com configurações válidas', function(done) {
            // Timeout for operation
            this.timeout(5000);

            var config = {
                user:    'nicholas@fabbrika.com.br', 
                password:'fabbrika01', 
                host:    'smtpout.secureserver.net', 
                port:    465,
                ssl:     true
            };
            var message = {
                text:    'I hope this works', 
                from:    'Nick <nicholas@fabbrika.com.br>', 
                to:      'Ni <n.moraes.dantas@gmail.com>',
                cc:      'Nicholas <nmdantas@brq.com>',
                subject: '>> [Testing emailjs]'
            };

            email.send(message, function(err, msg) {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            }, config);
        });

        it('Deve jogar uma exceção ao enviar um email com configurações inválidas', function(done) {
            // Timeout for operation
            this.timeout(5000);
            
            var config = {
                user:    'invalido@fabbrika.com.br', 
                password:'invalido', 
                host:    'smtpout.secureserver.net', 
                port:    465,
                ssl:     true
            };
            var message = {
                text:    'I hope this works', 
                from:    'Nick <nicholas@fabbrika.com.br>', 
                to:      'Ni <n.moraes.dantas@gmail.com>',
                cc:      'Nicholas <nmdantas@brq.com>',
                subject: '>> [Testing emailjs]'
            };

            email.send(message, function(err, msg) {
                if (err) {
                    done();
                } else {
                    done(new Error());
                }
            }, config);
        });
    });
});