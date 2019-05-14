const constraints = {
    numero: {
        presence: {
            message: '^Veuillez entrer un numéro.'
        }
    },
    password: {
        presence: {
            message: '^Veuillez entrer un mot de passe.'
        }
    },
};

export default constraints;