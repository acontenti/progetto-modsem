export type IRIandLabel = { iri: string, label: string }

export function deduplicateBy<V, T extends Record<string, V>>(list: T[], key: keyof T) {
  const seen = new Set();
  return list.filter((el: T) => {
    const duplicate = seen.has(el[key]);
    seen.add(el[key]);
    return !duplicate;
  });
}

export function deduplicate<T>(list: T[]) {
  const seen = new Set();
  return list.filter((el: T) => {
    const duplicate = seen.has(el);
    seen.add(el);
    return !duplicate;
  });
}
