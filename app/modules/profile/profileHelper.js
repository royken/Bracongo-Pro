// Set highligth color by category
export function getHighLigthColor(category) {
    const color = {
        bronze: 'grey',
        argent: 'grey',
        or: 'grey',
        diamant: 'grey'
    };

    switch (category) {
        case 'BR':
            color.bronze = 'white';
            break;

        case 'AR':
            color.argent = 'white';
            break;

        case 'OR':
            color.or = 'white';
            break;

        case 'DI':
            color.diamant = 'white';
            break;

        default:
            color.bronze = 'white';
            break;
    }

    return color;
}