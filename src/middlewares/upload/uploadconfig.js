/**
 * Arquivo de configuração para upload de arquivos estáticos
 */
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const tempDir = path.resolve(__dirname, '..', '..', 'images');

module.exports = {
    directory : tempDir,
    storage: multer.diskStorage({
        destination: tempDir,
        filename(request, file, callback) {
            const nameHash = crypto.randomBytes(10).toString('HEX');
            const nameFile = `${nameHash}=${file.originalname}`;

            return callback(null, nameFile);
        }
    })
};