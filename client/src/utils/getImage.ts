export const getImage = (id: string | null) => {
  if (!id) return "";
  const url = new URL(`../assets/img/cosmoport/${id}.jpg`, import.meta.url);
  return url.toString();
}