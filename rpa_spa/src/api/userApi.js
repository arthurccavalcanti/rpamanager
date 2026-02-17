import apiClient from './axiosInstance';
import { processosFormatter } from '../utils/processosFormatter';
import ConsoleError from '../utils/ConsoleError';

export const getUserProcessos = async (reqBody) => {
    const response = await apiClient.post('/user/jobs', reqBody)
        .catch((error) => ConsoleError(error));
    return processosFormatter(response);
}

export const getUserRPAsData = async () => {
    const response = await apiClient.get('user/me/RPAs')
        .catch((error) => ConsoleError(error));
    return response;
}

export const getRPATypes = async () => {
    const response = await apiClient.get('RPA/types')
        .catch((error) => ConsoleError(error));
    return response;
}

export const getUserRPAs = async (reqBody) => {
    const response = await apiClient.post('/user/RPAs', reqBody)
        .catch((error) => ConsoleError(error));
    // Filtra e formata processos
    for (const rpa of response.data.content) {
        const processos = []
        for (let i = 0; i < rpa.processos.length; i++) {
            let resultado = (rpa.processos[i].resultado == null) ? '' : rpa.processos[i].resultado;
            if (resultado) {
                // Subsitui vírgula por new line e retira travessões: '[' e ']'
                resultado = resultado.replace(/,/g, "\n\n").slice(1,-1);
                // Abrevia resultado para 250 caracteres
                resultado = resultado.substring(0, 250) + ' [...]';
            }
            processos.push(`\n${i+1}. URL: ${rpa.processos[i].url}\n\n${resultado}\n`);
        }
        rpa.processos = processos.join(' ');
    }
    return response;
}

export const createRPA = async (reqBody) => {
    try {
        await apiClient.post('/RPA/createRPA', reqBody);
        return {success: true, error: null};
    } catch (err) {
        console.log("Erro ao criar RPA.");
        return {success: false, error: err};
    }
}

export const createProcesso = async (reqBody) => {
    try {
        await apiClient.post('/RPA/createJob', reqBody);
        return {success: true, error: null};
    } catch (err) {
        console.log("Erro ao criar processo.");
        return {success: false, error: err};
    }
}

export const editRPA = async (reqBody, parametros) => {
    const response = await apiClient.put('/RPA/editRPA', reqBody, {params:parametros})
            .catch((error) => ConsoleError(error));
    return response;
}

export const editProcesso = async (reqBody, parametros) => {
    const response = await apiClient.put('/RPA/editJob', reqBody, {params:parametros})
            .catch((error) => ConsoleError(error));
    return response;
}

export const deleteProcesso = async (deleteId) => {
    const parametros = {params: {id: deleteId}};
    const response = await apiClient.delete('/RPA/deleteJob', parametros)
            .catch((error) => ConsoleError(error));
    return response;
}

export const editUserPassword = async (reqBody) => {
    const response = await apiClient.post('/user/resetPassword', reqBody)
            .catch((error) => ConsoleError(error));
    return response;
}