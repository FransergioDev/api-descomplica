const express = require('express');
const multer = require('multer');
const { validaToken } = require('./src/middlewares/authentication/validaToken');
const { ApplicationError } = require('./src/middlewares/error/ApplicationError');
const uploadconfig = require('./src/middlewares/upload/uploadconfig');

const app = express();
const uploadMiddleware = multer(uploadconfig);//Criar e seta as configurações do middleware conforme lib
app.use(express.json()); // Para que o express entenda que você vai trabalhar com json no corpo da requisição.
app.use('/images', express.static(uploadconfig.directory));//Configurar acesso as imagens conforme pasta de acesso, exemplo: http://localhost:3000/images/1327819371298372931-pos-descomplica.png

/** 
 * HTTP         GET PUT PATCH DELETE POST
 * 
 * CREATE   POST
 * RETRIEVE GET
 * UPDATE   PUT/PATCH
 * DELETE   DELETE
*/

//Exemplo de Middleware de log
function monitorarRequisicoes(request, response, next) {
    const {method, url, params, body, query} = request;
    const texto = `[${method}] - ${url} - params: ${JSON.stringify(params)}
    - body: ${JSON.stringify(body)} - query: ${JSON.stringify(query)}`

    console.log(texto);

    return next();
}

// app.use(monitorarRequisicoes); //Usando o middleware na aplicação toda

app.get('/', monitorarRequisicoes, (request, response) => {
    return response.json({
        message: 'Seja bem vindo a API da aula do descomplica pós-graduação'
    });
});

app.use('/teste-middleware', monitorarRequisicoes);// Aplicar o middleware para todos do grupo dessa rota

app.get('/disciplinas', (request, response) => {
    const query = request.query;
    return response.json({
        message: 'Nessa rota devo consultar as disciplinas',
        query: query
    });
});

app.get('/disciplinas/:id', validaToken, (request, response) => {
    const {id} = request.params;
    const params = request.params;
    

    if(id === 'tecnologias') {
        /*return response.status(400).json({
            message: 'Disciplina não encontrada.',
        });*/
        //Força criação de um erro com valores da classe nossa ApplicationError
        throw new ApplicationError('Disciplina não encontrada', 404);
    }

    return response.json({
        message: 'Nessa rota devo consultar uma disciplina com o id:' + params.id,
        params
    });
});

app.post('/disciplinas', validaToken,(request, response) => {
    return response.json({
        message: 'Nessa rota devo adicionar uma disciplina!'
    });
});

app.put('/disciplinas', validaToken, (request, response) => {
    return response.json({
        message: 'Nessa rota devo modificar uma disciplina!'
    });
});

app.delete('/disciplinas', validaToken, (request, response) => {
    return response.json({
        message: 'Olá, mundo!'
    });
});

//Criar token/autenticação
app.post('/autenticacao', (request, response) => {
    const { email, senha } = request.body;
    // ... Validações quando ao e-mail e senha 

    const idUsuario = "XPTO";
    const token = sign({
        //Não incluir informações sensíveis (nada de senha ou e-mail, etc)
        //Permissões, etc..
    }, 'minha-chave-secreta', {
        subject: idUsuario,
        expiresIn: '1d'// 1 dia
    });
});

//Exemplos de rotas usando o upload de arquivos
    //Envio de um único arquivo
    app.post('/perfil', uploadMiddleware.single('avatar'), function(request, response, next){
        //request.file irá conter o arquivo 'avatar'
        //request.body irá conter os demais conteúdos
        const body = request.body;
        return response.json(body);
    });

    //Exemplo com várioas arquivos
    app.post('/fotos/upload', uploadMiddleware.array('images', 12), function(request, response, next){
        //request.file irá conter o array de imagens 'images'
        //request.body irá conter os demais conteúdos
    });

    //Exemplo vários arrays de imagens no exemplo 1 imagem de avatar e até 8 de galeria
    let cpUpload = uploadMiddleware.fields([{name: 'avatar', maxCount: 1}, {name: 'galeria', maxCount: 8}])
    app.post('/imagem-perfil', cpUpload, function(resquest, response, next) {
        //request.file irá conter um objeto (String -> Array)
        //request.body irá conter os demais conteúdos
    });


//Tratamento de erros com Global expection handling (tem que ser a última declaração entre as rotas)
app.use((error, request, response, next) => {
    //Foi um erro criado/gerenciado
    if(error instanceof ApplicationError) {
        return response.status(error.httpStatusCode).json({message: error.message});
    }
    //Um erro não mapeado/inesperado
    return response.status(500).json({
        message: 'Não foi possível processar sua requisição. Tente novamente mais tarde!'
    });
});


app.listen(3000);
