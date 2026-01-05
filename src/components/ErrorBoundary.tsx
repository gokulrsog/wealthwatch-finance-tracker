import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Send error to parent window for logging
    try {
      window.parent?.postMessage(
        {
          type: 'iframe-console',
          level: 'error',
          args: ['ErrorBoundary caught error:', error.message, error.stack, errorInfo],
        },
        '*'
      );
    } catch (e) {
      console.error('Failed to postMessage error:', e);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 text-center">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-danger-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-neutral-900 mb-3">
              Something went wrong
            </h1>
            
            <p className="text-neutral-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            {this.state.error && (
              <div className="mb-6 p-4 bg-neutral-100 rounded-xl text-left">
                <div className="text-sm text-neutral-600 mb-2">Error details:</div>
                <div className="text-xs font-mono text-neutral-800 break-all">
                  {this.state.error.message}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={this.handleRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                Go Home
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                If this error persists, please contact our support team with the error details above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}