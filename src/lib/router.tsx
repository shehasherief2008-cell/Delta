import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to !== path) {
      window.history.pushState({}, '', to);
      setPath(to);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigate, params: {} }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }
  return context;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useLocation() {
  const { path } = useRouter();
  return { pathname: path };
}

export function useParams<T extends Record<string, string>>(): T {
  const { params } = useRouter();
  return params as T;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  children: ReactNode;
}

export function Link({ to, children, className, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && to.startsWith('/')) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}

interface RouteProps {
  path: string;
  element: ReactNode;
}

export function Route({ element }: RouteProps) {
  return <>{element}</>;
}

interface RoutesProps {
  children: ReactNode;
}

function matchRoute(routePath: string, currentPath: string): { match: boolean; params: Record<string, string> } {
  if (routePath === '*') return { match: true, params: {} };

  const routeSegments = routePath.split('/').filter(Boolean);
  const currentSegments = currentPath.split('/').filter(Boolean);

  if (routeSegments.length !== currentSegments.length) {
    return { match: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSeg = routeSegments[i];
    const currentSeg = currentSegments[i];

    if (routeSeg.startsWith(':')) {
      const paramName = routeSeg.slice(1);
      params[paramName] = decodeURIComponent(currentSeg);
    } else if (routeSeg !== currentSeg) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}

export function Routes({ children }: RoutesProps) {
  const { path } = useRouter();

  let matchedElement: ReactNode = null;
  let matchedParams: Record<string, string> = {};

  React.Children.forEach(children, (child) => {
    if (!matchedElement && React.isValidElement(child)) {
      const childProps = (child as any).props as RouteProps;
      const { path: routePath, element } = childProps;
      const { match, params } = matchRoute(routePath, path);
      if (match) {
        matchedElement = element;
        matchedParams = params;
      }
    }
  });

  if (matchedElement && React.isValidElement(matchedElement)) {
    return (
      <RouterContext.Consumer>
        {(ctx) =>
          ctx ? (
            <RouterContext.Provider value={{ ...ctx, params: matchedParams }}>
              {matchedElement}
            </RouterContext.Provider>
          ) : (
            matchedElement
          )
        }
      </RouterContext.Consumer>
    );
  }

  return null;
}

