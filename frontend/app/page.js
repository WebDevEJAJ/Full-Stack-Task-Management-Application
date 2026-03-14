'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Welcome to Task Manager 📋
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          A production-ready task management application built with Node.js, Express, Next.js, and MongoDB
        </p>

        {isAuthenticated ? (
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Go to Dashboard
            </button>
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button>Login</button>
            </Link>
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <button>Register</button>
            </Link>
          </div>
        )}

        <div style={{ marginTop: '4rem', textAlign: 'left', maxWidth: '600px', margin: '4rem auto' }}>
          <h2>Features:</h2>
          <ul style={{ lineHeight: '2' }}>
            <li>✅ User Authentication with JWT & HTTP-only Cookies</li>
            <li>✅ Secure Password Hashing with bcrypt</li>
            <li>✅ CRUD Operations for Tasks</li>
            <li>✅ Task Filtering by Status</li>
            <li>✅ Task Search Functionality</li>
            <li>✅ Pagination Support</li>
            <li>✅ User Authorization (Access only own tasks)</li>
            <li>✅ Input Validation & Error Handling</li>
            <li>✅ Sensitive Data Encryption</li>
            <li>✅ Production-Ready Security</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
