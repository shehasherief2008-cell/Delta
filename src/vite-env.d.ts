/// <reference types="vite/client" />

declare namespace React {
  type ReactNode = any;
  type FC<P = {}> = (props: P & { key?: any; children?: any }) => any;
  type FormEvent<T = any> = any;
  type ChangeEvent<T = any> = any;
  type MouseEvent<T = any> = any;
  type AnchorHTMLAttributes<T = any> = any;
  type ReactElement = any;
  interface Context<T> {
    Provider: any;
    Consumer: any;
  }
}

declare module 'react' {
  export interface Context<T> {
    Provider: any;
    Consumer: any;
  }
  export const StrictMode: any;
  export function useState<T>(initial: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useContext<T>(context: Context<T>): T;
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue?: T): { current: T };
  export type ReactNode = any;
  export type FC<P = {}> = (props: P & { key?: any; children?: any }) => any;
  export type FormEvent<T = any> = any;
  export type ChangeEvent<T = any> = any;
  export type MouseEvent<T = any> = any;
  export type AnchorHTMLAttributes<T = any> = any;
  export const Children: any;
  export function isValidElement<P>(child: any): child is { props: P };
  const React: any;
  export default React;
}

declare module 'react-dom' {
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react-dom/client' {
  export function createRoot(container: any): {
    render(children: any): void;
    unmount(): void;
  };
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element { }
}

declare module 'lucide-react';

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

interface ImportMeta {
  env: Record<string, string>;
}
