// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router';
import { LanguageProvider } from '../../context/LanguageContext';
import { UserProvider } from '../../context/UserContext';
import { AuthProvider } from '../../context/AuthContext';

export function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <UserProvider>
          <Outlet />
        </UserProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
