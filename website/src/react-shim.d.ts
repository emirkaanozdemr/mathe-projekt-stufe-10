declare module 'react' {
  export type ReactNode = unknown;
  export type ChangeEvent<T = Element> = { target: T & { files?: FileList | null } };
  export interface FC<P = Record<string, unknown>> {
    (props: P): ReactNode;
  }
  export function useState<S>(initialState: S): [S, (value: S) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export const StrictMode: FC<{ children?: ReactNode }>;
}

declare module 'react-dom/client' {
  import type { ReactNode } from 'react';

  export function createRoot(container: Element | DocumentFragment): {
    render(children: ReactNode): void;
  };
}

declare module 'react/jsx-runtime' {
  export const Fragment: unique symbol;
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown;
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown;
}

declare module 'katex' {
  const katex: {
    renderToString(input: string, options?: { throwOnError?: boolean; displayMode?: boolean }): string;
  };

  export default katex;
}

declare module '*.css';

declare module 'vite/client';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
