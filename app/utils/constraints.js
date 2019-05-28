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
    title: {
        length: {
            minimum: 3,
            tooShort: "^Au moins %{count} caractères.",
            maximum: 100,
            tooLong: "^Au plus %{count} caractères."
        },
        presence: {
            message: '^Veuillez entrer un mot de passe.'
        } 
    },
    description: {
        length: {
            minimum: 5,
            tooShort: "^Au moins %{count} caractères.",
            maximum: 200,
            tooLong: "^Au plus %{count} caractères."
        },
        presence: {
            message: '^Veuillez entrer un mot de passe.'
        } 
    },
    comment: {
        length: {
            minimum: 5,
            tooShort: "^Au moins %{count} caractères.",
            maximum: 150,
            tooLong: "^Au plus %{count} caractères."
        },
        presence: {
            message: '^Veuillez entrer un mot de passe.'
        } 
    }
};

export default constraints;