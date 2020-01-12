const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Crea un algoritmo de hash el numero de veces indicado de manera asincrona
    const hash = await bcrypt.hash(password, salt); // Contraeña final
    return hash;
};

helpers.decryptPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
}

module.exports = helpers;