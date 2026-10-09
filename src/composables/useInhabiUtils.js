export const  useUtilSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD") // Descompone caracteres con tildes (p. ej., "á" -> "a" + "´")
    .replace(/[\u0300-\u036f]/g, "") // Elimina las tildes/acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remueve caracteres especiales
    .replace(/\s+/g, "-"); // Reemplaza uno o más espacios por un guion
}
