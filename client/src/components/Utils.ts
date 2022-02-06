export type IRIandLabel = { iri: string, label: string }

export function deduplicate<V, T extends Record<string, V>>(list: T[], key: keyof T) {
  const seen = new Set();
  return list.filter((el: T) => {
    const duplicate = seen.has(el[key]);
    seen.add(el[key]);
    return !duplicate;
  });
}
