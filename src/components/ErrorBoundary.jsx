import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[Chizel] Unhandled UI error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl p-6 text-center">
          <h1 className="font-heading text-2xl font-black text-text mb-2">Something went wrong</h1>
          <p className="text-secondary-text text-sm mb-5">
            Please reload. If this keeps happening, it’s likely a configuration issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl font-ui font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#1f6feb,#7c4dff)' }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

