'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1>📋 Task Manager</h1>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <span style={{ color: 'white' }}>Welcome, {user?.fullName}</span>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
