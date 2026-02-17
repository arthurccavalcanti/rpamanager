export function datetimeFormatter(isoDateString) {
  const date = new Date(isoDateString);

  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  //const segundos = String(date.getSeconds()).padStart(2, '0');

  return `${horas}:${minutos}\n${dia}-${mes}-${ano}`;
}