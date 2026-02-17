import apiClient from './axiosInstance';
import { processosFormatter } from '../utils/processosFormatter';
import ConsoleError from '../utils/ConsoleError';

// GET
export const getUsers = async (reqBody) => {
    const response = await apiClient.post('/admin/getUsers', reqBody)
        .catch((error) => ConsoleError(error));
    return response;
}

export const getProcessosAdmin = async (reqBody) => {
    const response = await apiClient.post('/admin/getJobs', reqBody)
        .catch((error) => ConsoleError(error));
    return processosFormatter(response);
}

export const getRPAsAdmin = async (reqBody) => {
    const response = await apiClient.post('/admin/getRPAs', reqBody)
        .catch((error) => ConsoleError(error));
    // Formata processos
    for (const rpa of response.data.content) {
        const processos = [];
        for (let i = 0; i < rpa.processos.length; i++) {
            processos.push(`\nURL: ${rpa.processos[i].url}\nStatus: ${rpa.processos[i].status}\n`);
        }
        rpa.processos = processos.join(' ');
        rpa.user = rpa.user.username;
    }
    return response;
}

// DELETE
export const deleteUser = async (deleteId) => {
    const parametros = {params: {id: deleteId}};
    await apiClient.delete("/admin/deleteUser", parametros)
        .catch((error) => ConsoleError(error));
}

export const deleteRPAAdmin = async (deleteId) => {
    const parametros = {params: {id: deleteId}};
    await apiClient.delete("/admin/deleteRPA", parametros)
        .catch((error) => ConsoleError(error));
}

export const deleteProcessoAdmin = async (deleteId) => {
    const parametros = {params: {id: deleteId}};
    await apiClient.delete("/admin/deleteJob", parametros)
        .catch((error) => ConsoleError(error));
}

// EDIT
export const editProcessoAdmin = async (reqBody, parametros) => {
    await apiClient.put("/admin/editJob", reqBody, {params: parametros})
        .catch((error) => ConsoleError(error));
}

export const editRPAAdmin = async (reqBody, parametros) => {
    await apiClient.put("/admin/editRPA", reqBody, {params: parametros})
        .catch((error) => ConsoleError(error));
}

export const editUserAdmin = async (reqBody, parametros) => {
    await apiClient.patch("/admin/editUser", reqBody, {params: parametros})
        .catch((error) => ConsoleError(error));
}