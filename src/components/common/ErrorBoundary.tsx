import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application rendering error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F3] px-6 text-center text-[#050505]">
          <h1 className="text-3xl font-medium">Something went wrong.</h1>

          <p className="mt-3 text-sm text-neutral-600">Please try reloading the page.</p>

          <button onClick={() => window.location.reload()} className="mt-8 min-h-11 border border-black px-6 py-3 text-sm hover:bg-black hover:text-white">
            Reload Page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
