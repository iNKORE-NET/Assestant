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