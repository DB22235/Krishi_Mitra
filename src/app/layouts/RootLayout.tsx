// // src/layouts/RootLayout.tsx
// import { Outlet } from 'react-router';
// import { LanguageProvider } from '../../context/LanguageContext';
// // import { useLanguage } from '../../context/LanguageContext';

// export function RootLayout() {
//   return (
//     <LanguageProvider>
//       <Outlet />
//     </LanguageProvider>
//   );
// }
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
