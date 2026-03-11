
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { Splash } from "./screens/Splash";
import { SignUp } from "./screens/SignUp";
import { Login } from "./screens/Login";
import { OnboardingProfile } from "./screens/OnboardingProfile";
import { OnboardingFarmDetails } from "./screens/OnboardingFarmDetails";
import { OnboardingFinancial } from "./screens/OnboardingFinancial";
import { OnboardingDocuments } from "./screens/OnboardingDocuments";
import { Dashboard } from "./screens/Dashboard";
import Chat from "./screens/Chat";
import { SchemeMatcher } from "./screens/SchemeMatcher";
import { ApplicationTracking } from "./screens/ApplicationTracking";
import { Notifications } from "./screens/Notifications";
import { Profile } from "./screens/Profile";
import { CommunityEngagement } from "./screens/CommunityEngagement";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: "/", Component: Splash },
      { path: "/signup", Component: SignUp },
      { path: "/login", Component: Login },
      { path: "/onboarding/profile", Component: OnboardingProfile },
      { path: "/onboarding/farm-details", Component: OnboardingFarmDetails },
      { path: "/onboarding/financial", Component: OnboardingFinancial },
      { path: "/onboarding/documents", Component: OnboardingDocuments },
      { path: "/dashboard", Component: Dashboard },
      { path: "/chat", Component: Chat },
      { path: "/community", Component: CommunityEngagement },
      { path: "/schemes", Component: SchemeMatcher },
      { path: "/applications", Component: ApplicationTracking },
      { path: "/notifications", Component: Notifications },
      { path: "/profile", Component: Profile },
    ],
  },
]);