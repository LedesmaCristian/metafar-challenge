import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de error.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Puedes registrar el error en un servicio de registro de errores
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar el mensaje de error aquí
      return <h1>¡Ups! Algo salió mal.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
