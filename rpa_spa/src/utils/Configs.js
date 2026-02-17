import { getEditarProcessoSchema, getEditarRPASchema, getEditUserSchema } from './validationSchemas';

export const getConfigs = (intl) => {
    return {
        processos: {
            columns: [
                { field: 'status', headerName: intl.formatMessage({ id: 'statusHeader' }) },
                { field: 'detalhes', headerName: intl.formatMessage({ id: 'detailsHeader' }), collapsible: true },
                { field: 'url', headerName: intl.formatMessage({ id: 'urlHeader' }), collapsible: true },
                { field: 'mensagemErro', headerName: intl.formatMessage({ id: 'errorMessageHeader' }), collapsible: true },
                { field: 'nomeRPA', headerName: intl.formatMessage({ id: 'rpaNameHeader' }) },
                { field: 'tipoRPA', headerName: intl.formatMessage({ id: 'rpaTypeHeader' }) },
                { field: 'dataHoraAgendada', headerName: intl.formatMessage({ id: 'scheduleHeader' }) },
                { field: 'dataHoraInicio', headerName: intl.formatMessage({ id: 'startTimeHeader' }) },
                { field: 'dataHoraFinalizacao', headerName: intl.formatMessage({ id: 'endTimeHeader' }) },
                { field: 'resultado', headerName: intl.formatMessage({ id: 'resultHeader' }), collapsible: true },
            ],
            sortableFields: [{field: 'url', headerName: intl.formatMessage({ id: 'urlHeader' })},
                            {field: 'detalhes', headerName: intl.formatMessage({ id: 'detailsHeader' }) },
                            {field: 'status', headerName: intl.formatMessage({ id: 'statusHeader' }) },
                            {field: 'dataHoraAgendada', headerName: intl.formatMessage({ id: 'scheduleHeader' }) },
                            {field: 'dataHoraInicio', headerName: intl.formatMessage({ id: 'startTimeHeader' }) },
                            {field: 'dataHoraFinalizacao', headerName: intl.formatMessage({ id: 'endTimeHeader' }) }],
            editableFields: [
                            {field: 'url', headerName: intl.formatMessage({ id: 'urlHeader' }), type: 'select', options: ['https://g1.com.br', 'https://example.com']},
                            {field: 'detalhes', headerName: intl.formatMessage({ id: 'detailsHeader' }), type: 'texto'}],
            validationSchema: getEditarProcessoSchema(intl),
        },

        rpas: {
            columns: [
                { field: 'nomeRPA', headerName: intl.formatMessage({ id: 'rpaNameHeader' }) },
                { field: 'tipoRPA', headerName: intl.formatMessage({ id: 'rpaTypeHeader' }) },
                { field: 'processos', headerName: intl.formatMessage({ id: 'jobsHeader' }), collapsible: true },
            ],
            sortableFields: [{field: 'nomeRPA', headerName: intl.formatMessage({ id: 'rpaNameHeader' }) },
                            {field: 'tipoRPA', headerName: intl.formatMessage({ id: 'rpaTypeHeader' }) }
            ],
            editableFields: [{field: 'nomeRPA', headerName: intl.formatMessage({ id: 'rpaNameHeader' }), type: 'texto' },
                            {field: 'tipoRPA', headerName: intl.formatMessage({ id: 'rpaTypeHeader' }), type: 'select', options: ['headlines', 'rpaExample']}
            ],
            validationSchema: getEditarRPASchema(intl),
        },

        usuariosAdmin: {
            columns: [
                {field: 'username', headerName: intl.formatMessage({ id: 'usernameHeader' })},
                {field: 'role', headerName: intl.formatMessage({ id: 'roleHeader'})}
            ],
            sortableFields: [{field: 'username', headerName: intl.formatMessage({ id: 'usernameHeader' })},
                            {field: 'role', headerName: intl.formatMessage({ id: 'roleHeader'}) }],
            editableFields: [{field: 'role', headerName: intl.formatMessage({ id: 'roleHeader'}), type: 'select', options: ['USER', 'ADMIN']},
                            {field: 'username', headerName: intl.formatMessage({ id: 'usernameHeader' }), type: 'texto'},
                            {field: 'password', headerName: intl.formatMessage({ id: 'passwordHeader' }), type: 'texto'}
            ],
            validationSchema: getEditUserSchema(intl),
        }
    }
} 