export default function handleAxiosError(intl, error) {

    if (error.response) {
        if (typeof error.response.data === 'object' && !Array.isArray(error.response.data)
                                                    && error.response.data !== null) {
                let errorString = '';
                Object.values(error.response.data).forEach(value => {
                    errorString += (String(value) + '\n');
                });
                return errorString;
        } else if (error.response.data) {
            return String(error.response.data);
        }
        else {
            return intl.formatMessage({ id: 'errors.unexpectedServerResponse', defaultMessage: 'Houve um erro inesperado ao processar a mensagem do servidor.' });
        }
    } else if (error.request) {
        return intl.formatMessage({ id: 'errors.noServerResponse', defaultMessage: 'Sem resposta do servidor.' });
    } else {
        return intl.formatMessage({ id: 'errors.unexpectedError', defaultMessage: 'Houve um erro inesperado.' });
    }
}