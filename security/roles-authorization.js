/*
 * Authorization based in Roles.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Global dependencies.
 * CacheManager: LRU-Cache
 */

module.exports = authorize;

/**
 * Expose 'authorize(message: string... | string[]): Express Middleware'.
 */
function authorize(roles) {
    var authorizedRoles = Array.isArray(roles) ? roles : Array.prototype.slice.call(arguments);

    // Deve retornar este middleware para tratamento do framework Express
    return function middleware(req, res, next) {
        // Valida se ha o token da autorizacao
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') == -1) {
            res.status(401).json({
                errorCode: 401,
                errorMessage: 'Unauthorized'
            });

            return;
        }

        // Obtem o token baseado no padrao 'Basic xptoLoremIpsum321'
        var key = req.headers.authorization.split(' ')[1];

        // Verifica se o usuario esta no cache
        if (global.CacheManager.has(key)) {
            var userRoles = global.CacheManager.get(key).roles;
            var isAuthorized = false;

            // Percorre todas as Roles do usuario 
            // Se o usuario possuir ao menos uma das Roles do parametro de entrada permite prosseguir
            for (var i = 0; i < userRoles.length; i++) {
                isAuthorized |= authorizedRoles.indexOf(userRoles[i]) > -1;
            }

            // Chama o proximo middleware da cadeia de chamadas e usa o 'return' para prevenir qualquer propagacao
            if (isAuthorized) {
                next();
                return;
            }
        }
        
        // Caso o codigo chegue a este ponto significa que falhou em todas 
        // as tentativas de autorizar o usuario e deve devolver que nao ha autorizacao
        res.status(401).json({
            errorCode: 401,
            errorMessage: 'Unauthorized'
        });
    }
}