
import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AppContext, AppContextType } from '../contexts/AppContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  declare context: AppContextType;
  static contextType = AppContext;

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    if (this.context && this.context.addLog) {
        this.context.addLog({
            type: 'error',
            message: `Caught rendering error: ${error.message}`,
            details: errorInfo.componentStack?.trim() || 'No component stack available.',
        });
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-4">
            <div className="max-w-md w-full bg-surface border border-subtle rounded-lg p-8 shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
                    <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h1>
                <p className="text-text-secondary mb-6">
                    We're sorry, but the application encountered an unexpected error. Please try reloading the page.
                </p>
                <button
                    onClick={this.handleReload}
                    className="bg-brand hover:bg-brand/90 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200"
                >
                    Reload Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
