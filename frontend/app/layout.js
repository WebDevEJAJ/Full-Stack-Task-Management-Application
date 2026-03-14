'use client';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import './styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Task Management Application</title>
        <meta name="description" content="A production-ready task management app" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
