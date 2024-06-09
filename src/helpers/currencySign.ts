enum SignsCurrency {
    RUB = '₽',
    EUR = '€',
    USD = '$',
    AMD = '֏',
    BYN = 'Br'
}

const getCurrencySignOfficeID = (value: number | string | null): string => {
    switch (value) {
        case 28:
            return SignsCurrency.AMD;
        case 32:
            return SignsCurrency.USD;
        case 3:
            return SignsCurrency.BYN;
        default:
            return SignsCurrency.RUB;
    }
}

const getCurrencySignName = (value: string): string => {
    switch (value) {
        case 'AMD':
            return SignsCurrency.AMD;
        case  'USD':
            return SignsCurrency.USD;
        case  'BYN':
            return SignsCurrency.BYN;
        case 'EUR':
            return SignsCurrency.EUR;
        default:
            return SignsCurrency.RUB;
    }
}

const getNameBySign = (value: string | null): string => {
    switch (value) {
        case 'Br':
            return 'BYN';
        case  '€':
            return 'EUR';
        case  '$':
            return 'USD';
        case '֏':
            return 'AMD'
        default:
            return 'RUB';
    }
}

export { getCurrencySignOfficeID, getCurrencySignName, getNameBySign }