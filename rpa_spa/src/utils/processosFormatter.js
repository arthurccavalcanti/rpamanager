import { datetimeFormatter } from './datetimeFormatter';

export function processosFormatter(response) {
    for (const processo of response.data.content) {
        processo.dataHoraAgendada = (processo.dataHoraAgendada != null)
                                    ? datetimeFormatter(processo.dataHoraAgendada)
                                    : '';
        processo.dataHoraInicio = (processo.dataHoraInicio != null)
                                    ? datetimeFormatter(processo.dataHoraInicio)
                                    : '';
        processo.dataHoraFinalizacao = (processo.dataHoraFinalizacao != null)
                                    ? datetimeFormatter(processo.dataHoraFinalizacao)
                                    : '';
        if (processo.detalhes == null) {
            processo.detalhes = '';
        }
        if (processo.mensagemErro == null) {
            processo.mensagemErro = '';
        }   
        if (processo.resultado == null) {
            processo.resultado = '';
        } else {
            processo.resultado = `${processo.resultado.replace(/,/g, "\n\n").slice(1,-1)}`;
        }
    }
    return response;
}  
