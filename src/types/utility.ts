export type Fixed<
  T,
  L extends number,
  A extends readonly T[] = []
> = A["length"] extends L ? A : Fixed<T, L, [...A, T]>;
