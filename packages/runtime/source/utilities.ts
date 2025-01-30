export function removeSlash(url: string, removes: { trailing?: boolean, leading?: boolean })
{
    if (removes.trailing) url = url.replace(/\/+$/, "");
    if (removes.leading) url = url.replace(/^\/+/, "");
    return url;
}

export type Func = (...args: any[]) => any | Function;
export type ResolvableValue<TValue, TArgs extends any[] = []> = TValue extends Func ? never : (TValue | ((...args: TArgs) => TValue));
export function resolveValue<T, TA extends any[] = []>(value: ResolvableValue<T, TA>, args: TA): T
{
    return typeof value === "function" ? value(...args) : value;
}



export type DeepReadonly<T> =
    T extends (infer R)[] ? DeepReadonlyArray<R> :
    T extends Function ? T :
    T extends object ? DeepReadonlyObject<T> :
    T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type SomePartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;