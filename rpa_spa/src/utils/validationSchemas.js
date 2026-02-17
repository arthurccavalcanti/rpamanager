import * as Yup from 'yup';

// Registro
export const getRegisterSchema = (intl) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: 'yup.email.invalid', defaultMessage: 'Campo deve ser um e-mail válido.' }))
      .min(5, intl.formatMessage({ id: 'yup.email.minLength', defaultMessage: 'Email deve ter no mínimo 5 caracteres.' }))
      .max(100, intl.formatMessage({ id: 'yup.email.maxLength', defaultMessage: 'Email deve ter no máximo 100 caracteres.' }))
      .required(intl.formatMessage({ id: 'yup.email.required', defaultMessage: 'Email é obrigatório.' })),
    password: Yup.string()
      .min(6, intl.formatMessage({ id: 'yup.password.minLength', defaultMessage: 'Senha deve ter no mínimo 6 caracteres.' }))
      .max(30, intl.formatMessage({ id: 'yup.password.maxLength', defaultMessage: 'Senha deve ter no máximo 30 caracteres.' }))
      .required(intl.formatMessage({ id: 'yup.password.required', defaultMessage: 'Senha é obrigatória.' })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'yup.confirmPassword.match', defaultMessage: 'Senhas devem ser iguais.' }))
      .required(intl.formatMessage({ id: 'yup.confirmPassword.required', defaultMessage: 'Confirmar a senha é obrigatório.' }))
  });
};

// Login
export const getLoginSchema = (intl) => {
  return Yup.object().shape({
    email: Yup.string()
      .required(intl.formatMessage({ id: 'yup.email.required', defaultMessage: 'Email é obrigatório.' }))
      .email(intl.formatMessage({ id: 'yup.email.invalid', defaultMessage: 'Campo deve ser um e-mail válido.' }))
      .min(5, intl.formatMessage({ id: 'yup.email.minLength', defaultMessage: 'Email deve ter no mínimo 5 caracteres.' }))
      .max(100, intl.formatMessage({ id: 'yup.email.maxLength', defaultMessage: 'Email deve ter no máximo 100 caracteres.' })),
    password: Yup.string()
      .required(intl.formatMessage({ id: 'yup.password.required', defaultMessage: 'Senha é obrigatória.' }))
      .min(6, intl.formatMessage({ id: 'yup.password.minLength', defaultMessage: 'Senha deve ter no mínimo 6 caracteres.' }))
      .max(30, intl.formatMessage({ id: 'yup.password.maxLength', defaultMessage: 'Senha deve ter no máximo 30 caracteres.' }))
  });
};

// Criar RPA
export const getRPASchema = (intl) => {
  return Yup.object().shape({
    nomeRPA: Yup.string()
      .required(intl.formatMessage({ id: 'yup.rpaName.required', defaultMessage: 'Nome é obrigatório.' }))
      .min(5, intl.formatMessage({ id: 'yup.rpaName.minLength', defaultMessage: 'Nome deve ter no mínimo 5 caracteres.' }))
      .max(100, intl.formatMessage({ id: 'yup.rpaName.maxLength', defaultMessage: 'Nome deve ter no máximo 100 caracteres.' })),
    tipoRPA: Yup.string()
      .required(intl.formatMessage({ id: 'yup.rpaType.required', defaultMessage: 'Escolha um tipo de RPA.' }))
  });
};

// Criar processo
export const getProcessoSchema = (intl) => {
  return Yup.object().shape({
    url: Yup.string()
      .required(intl.formatMessage({ id: 'yup.url.required', defaultMessage: 'Escolha uma URL.' })),
    rpa: Yup.string()
      .required(intl.formatMessage({ id: 'yup.rpa.required', defaultMessage: 'Escolha um RPA.' })),
    detalhes: Yup.string()
      .max(100, intl.formatMessage({ id: 'yup.details.maxLength', defaultMessage: 'O campo deve ter no máximo 100 caracteres.' }))
  });
};

// Editar processo
export const getEditarProcessoSchema = (intl) => {
  return Yup.object().shape({
    url: Yup.string()
      .required(intl.formatMessage({ id: 'yup.url.fieldRequired', defaultMessage: 'Campo URL é obrigatório.' })),
    detalhes: Yup.string()
      .max(100, intl.formatMessage({ id: 'yup.details.maxLength', defaultMessage: 'Campo deve ter no máximo 100 caracteres.' }))
  });
};

// Editar RPA
export const getEditarRPASchema = (intl) => {
  return Yup.object().shape({
    nomeRPA: Yup.string()
      .required(intl.formatMessage({ id: 'yup.rpaName.fieldRequired', defaultMessage: 'Campo nome é obrigatório.' }))
      .min(1, intl.formatMessage({ id: 'yup.rpaName.editMinLength', defaultMessage: 'Nome deve ter no mínimo 1 caractere.' }))
      .max(100, intl.formatMessage({ id: 'yup.rpaName.maxLength', defaultMessage: 'Nome deve ter no máximo 100 caracteres.' })),
    tipoRPA: Yup.string()
      .required(intl.formatMessage({ id: 'yup.rpaType.fieldRequired', defaultMessage: 'Tipo de RPA é obrigatório.' }))
  });
};

// Editar user
export const getEditUserSchema = (intl) => {
  return Yup.object().shape({
    role: Yup.string()
      .required(intl.formatMessage({ id: 'yup.role.required', defaultMessage: 'Escolha uma role.' }))
      .oneOf(['USER', 'ADMIN']),
    username: Yup.string()
      .required(intl.formatMessage({ id: 'yup.email.required', defaultMessage: 'Email é obrigatório.' }))
      .email(intl.formatMessage({ id: 'yup.email.invalid', defaultMessage: 'Campo deve ser um email válido.' }))
      .min(5, intl.formatMessage({ id: 'yup.email.minLength', defaultMessage: 'Email deve ter no mínimo 5 caracteres.' }))
      .max(100, intl.formatMessage({ id: 'yup.email.maxLength', defaultMessage: 'Email deve ter no máximo 100 caracteres.' })),
    password: Yup.string()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .min(6, intl.formatMessage({ id: 'yup.password.minLength', defaultMessage: 'Senha deve ter no mínimo 6 caracteres.' }))
      .max(30, intl.formatMessage({ id: 'yup.password.maxLength', defaultMessage: 'Senha deve ter no máximo 30 caracteres.' }))
  });
};

// Criar usuário admin
export const getCreateUserSchema = (intl) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: 'yup.email.invalid', defaultMessage: 'Campo deve ser um e-mail válido.' }))
      .min(5, intl.formatMessage({ id: 'yup.email.minLength', defaultMessage: 'Email deve ter no mínimo 5 caracteres.' }))
      .max(100, intl.formatMessage({ id: 'yup.email.maxLength', defaultMessage: 'Email deve ter no máximo 100 caracteres.' }))
      .required(intl.formatMessage({ id: 'yup.email.required', defaultMessage: 'Email é obrigatório.' })),
    password: Yup.string()
      .min(6, intl.formatMessage({ id: 'yup.password.minLength', defaultMessage: 'Senha deve ter no mínimo 6 caracteres.' }))
      .max(30, intl.formatMessage({ id: 'yup.password.maxLength', defaultMessage: 'Senha deve ter no máximo 30 caracteres.' }))
      .required(intl.formatMessage({ id: 'yup.password.required', defaultMessage: 'Senha é obrigatória.' }))
  });
};

// Reset senha
export const getResetPasswordSchema = (intl) => {
  return Yup.object().shape({
    password: Yup.string()
      .min(6, intl.formatMessage({ id: 'yup.password.minLength', defaultMessage: 'Senha deve ter no mínimo 6 caracteres.' }))
      .max(30, intl.formatMessage({ id: 'yup.password.maxLength', defaultMessage: 'Senha deve ter no máximo 30 caracteres.' }))
      .required(intl.formatMessage({ id: 'yup.password.required', defaultMessage: 'Senha é obrigatória.' })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'yup.confirmPassword.match', defaultMessage: 'Senhas devem ser iguais.' }))
      .required(intl.formatMessage({ id: 'yup.confirmPassword.required', defaultMessage: 'Confirmar a senha é obrigatório.' }))
  });
};