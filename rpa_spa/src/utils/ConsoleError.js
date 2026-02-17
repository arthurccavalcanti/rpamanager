export default function ConsoleError(error) {
    if (error.response) {
        console.log('Corpo do erro:\n', error.response.data);
        console.log('Status: ', error.response.status);
        console.log('Headers:\n', error.response.headers);
        throw error;
    } else if (error.request) {
        console.log("Sem resposta do servidor: ", error.request);
        throw error;
    } else {
        console.log('Erro: ', error);
        throw error;
    }
}