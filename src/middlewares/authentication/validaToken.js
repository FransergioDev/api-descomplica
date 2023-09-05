const {ApplicationError} = require('../error/ApplicationError');
const {verify} = require('jsonwebtoken');

function validaToken(request, response, next) {
    const autorizationHeader = resquest.headers.authorization;

    if(!autorizationHeader) {
        throw new ApplicationError('Nenhum token enviado', 403);
    }

    //pula o primeiro valor do array de retorno do split
    const [, token] = autorizationHeader.split(' ');

    try {
        const tokenDecodificado = verify(token, 'minha-chave-secreta');
        const {sub} = tokenDecodificado;

        request.user = sub;
        console.log(tokenDecodificado);

        return next();
    } catch {
        throw new ApplicationError('Erro ao verificar token!', 401);
    }
}

module.exports = {
    validaToken
}