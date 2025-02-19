import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

export default function QueryBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode | ((props: FallbackProps) => React.ReactNode);
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(props) =>
            typeof fallback === "function" ? fallback(props) : fallback
          }
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
