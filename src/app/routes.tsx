
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Splash } from "./screens/Splash";
import { SignUp } from "./screens/SignUp";
import { Login } from "./screens/Login";
import { OnboardingProfile } from "./screens/OnboardingProfile";
import { OnboardingFarmDetails } from "./screens/OnboardingFarmDetails";
import { OnboardingFinancial } from "./screens/OnboardingFinancial";
import { Dashboard } from "./screens/Dashboard";
import { CommunityEngagement } from "./screens/CommunityEngagement";

import Chat from "./screens/Chat";



import { SchemeDiscovery } from "./screens/SchemeDiscovery";
import { SchemeDetail } from "./screens/SchemeDetail";
import { ApplicationWizard } from "./screens/ApplicationWizard";
import { ApplicationTracking } from "./screens/ApplicationTracking";
import { Notifications } from "./screens/Notifications";
import { Profile } from "./screens/Profile";

export const router = createBrowserRouter([
  {
    // Root layout wraps ALL routes with LanguageProvider
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: Splash,
      },
      {
        path: "/signup",
        Component: SignUp,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/onboarding/profile",
        Component: OnboardingProfile,
      },
      {
        path: "/onboarding/farm-details",
        Component: OnboardingFarmDetails,
      },
      {
        path: "/onboarding/financial",
        Component: OnboardingFinancial,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/chat",
        Component: Chat,
      },
      {
        path: "/schemes",
        Component: SchemeDiscovery,
      },
      {
        path: "/schemes/:id",
        Component: SchemeDetail,
      },
      {
        path: "/apply/:schemeId",
        Component: ApplicationWizard,
      },
      {
        path: "/applications",
        Component: ApplicationTracking,
      },
      {
        path: "/notifications",
        Component: Notifications,
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/community",
        Component: CommunityEngagement,
      },
    ],
  },
]);