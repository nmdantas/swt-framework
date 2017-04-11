# SWT Framework

  O framework base para qualquer aplicação SWT

## Instalação
```bash
$ npm install git+https://{user}@bitbucket.org/fabbrika/swt-framework.git
```
	
## Features
 - log -> método para debug e erros, inclui também middleware para uso com [`Express`](https://github.com/expressjs/express)
 - segurança -> controle de acesso, roles, enable preflight
 - email -> método para envio de email, implementação do framework [`emailjs`](https://github.com/eleith/emailjs)
 - models -> modelos para uso geral de aplicações SWT
 - common -> camada de uso geral de aplicações SWT

## Estrutura
```javascript
logger: {
    debug: (salvar log de debug),
    error: (salvar log de erro),
    middleware: (middleware para ser usado com Express)
},
security: {
    signature: (todos os métodos relacionados à criptografia),
    authorize: (autorização por Roles),
    enablePreflight: (habilita CORS),
    checkAuthorization: (autorização por HTTP Authorization Header)
},
constants: {
    add: (manipulação de novas constantes)
},
email: (envio de emails),
models: (classes),
common: (métodos de uso geral)
```

## Exemplo
```javascript
var PORT = process.env.PORT || 8080;

var express   = require('express');
var framework = require('swt-framework');

var app = express();

// Habilita CORS
app.use(framework.security.enablePreflight);
// Verificacoes no Header Authorization
app.use(framework.security.checkAuthorization);

// Rotas
// app.use('/api/v0/me', myController);

// Middleware de erro
app.use(framework.logger.middleware);

// Inicia o servidor
app.listen(PORT);
```

## Testes

  Para realizar os testes, primeiramente, instale todas as dependências, então use `npm test`:

```bash
$ npm install
$ npm test
```