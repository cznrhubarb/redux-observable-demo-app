export type TypeFromCreator<
  T extends { [key: string]: (...args: any) => object }
> = ReturnType<T[keyof T]>;
