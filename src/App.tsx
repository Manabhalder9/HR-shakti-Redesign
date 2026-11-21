import { AuthProvider } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ThemeProvider } from './context/ThemeContext';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/AuthPages';
import {
  ApplicationsPage,
  BlogDetailPage,
  BlogsPage,
  CareerPathsPage,
  EventsPage,
  JobsPage,
  LearningPage,
  MentorshipPage,
  NewsPage,
  OrganizationsPage,
} from './pages/CareerLearnPages';
import {
  CommunitiesPage,
  DiscussionDetailPage,
  FeedAndDiscussionsPage,
} from './pages/CommunityPages';
import { WorkspaceModuleShellPage } from './components/WorkspaceModuleShellPage';
import { HomePage } from './pages/HomePage';
import {
  CalendarPage,
  DashboardPage,
  MessagesPage,
  NotificationsPage,
  PeopleAndNetworkPage,
  ProfileAndSettingsPage,
  SavedItemsPage,
  SearchPage,
  StaticPublicPage,
  SupportSurveysCredentialsPage,
  TasksPage,
} from './pages/WorkspacePages';

function AppRoutes() {
  const { pathname } = useRouter();
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  if (cleanPath === '/') return <HomePage />;
  if (cleanPath === '/login') return <LoginPage />;
  if (cleanPath === '/register') return <RegisterPage />;
  if (cleanPath === '/forgot-password') return <ForgotPasswordPage />;

  if (cleanPath === '/feed') return <FeedAndDiscussionsPage mode="feed" />;
  if (cleanPath === '/discussions') return <FeedAndDiscussionsPage mode="discussions" />;
  if (cleanPath.startsWith('/discussions/')) {
    return <DiscussionDetailPage id={decodeURIComponent(cleanPath.slice('/discussions/'.length))} />;
  }
  if (cleanPath === '/questions') return <FeedAndDiscussionsPage mode="questions" />;
  if (cleanPath === '/communities') return <CommunitiesPage />;

  if (cleanPath === '/jobs') return <JobsPage />;
  if (cleanPath === '/applications') return <ApplicationsPage />;
  if (cleanPath === '/career') return <CareerPathsPage />;
  if (cleanPath === '/organizations') return <OrganizationsPage />;

  if (cleanPath === '/learning') return <LearningPage section="courses" />;
  if (cleanPath === '/learning-paths') return <LearningPage section="paths" />;
  if (cleanPath === '/knowledge-hub') return <LearningPage section="hub" />;

  if (cleanPath === '/blogs') return <BlogsPage />;
  if (cleanPath.startsWith('/blogs/')) {
    return <BlogDetailPage slug={decodeURIComponent(cleanPath.slice('/blogs/'.length))} />;
  }
  if (cleanPath === '/news') return <NewsPage />;
  if (cleanPath === '/events') return <EventsPage />;
  if (cleanPath === '/my-events') return <EventsPage mineOnly />;
  if (cleanPath === '/mentorship') return <MentorshipPage />;

  if (cleanPath === '/dashboard') return <DashboardPage />;
  if (cleanPath === '/people') return <PeopleAndNetworkPage />;
  if (cleanPath === '/network') return <PeopleAndNetworkPage networkOnly />;
  if (cleanPath === '/calendar') return <CalendarPage />;
  if (cleanPath === '/tasks') return <TasksPage />;
  if (cleanPath === '/messages') return <MessagesPage />;
  if (cleanPath === '/notifications') return <NotificationsPage />;
  if (cleanPath === '/saved') return <SavedItemsPage />;
  if (cleanPath === '/profile') return <ProfileAndSettingsPage mode="profile" />;
  if (cleanPath === '/settings') return <ProfileAndSettingsPage mode="settings" />;
  if (cleanPath === '/support') return <SupportSurveysCredentialsPage view="support" />;
  if (cleanPath === '/surveys') return <SupportSurveysCredentialsPage view="surveys" />;
  if (cleanPath === '/certificates') return <SupportSurveysCredentialsPage view="certificates" />;
  if (cleanPath === '/search') return <SearchPage />;

  if (cleanPath === '/files') return <WorkspaceModuleShellPage moduleKey="files" />;
  if (cleanPath === '/my-learning') return <WorkspaceModuleShellPage moduleKey="my-learning" />;
  if (cleanPath === '/templates') return <WorkspaceModuleShellPage moduleKey="templates" />;
  if (cleanPath === '/toolkit') return <WorkspaceModuleShellPage moduleKey="toolkit" />;
  if (cleanPath === '/compliance') return <WorkspaceModuleShellPage moduleKey="compliance" />;
  if (cleanPath === '/benchmarks') return <WorkspaceModuleShellPage moduleKey="benchmarks" />;
  if (cleanPath === '/reports') return <WorkspaceModuleShellPage moduleKey="reports" />;
  if (cleanPath === '/ai-assistant') return <WorkspaceModuleShellPage moduleKey="ai-assistant" />;

  if (cleanPath === '/about') return <StaticPublicPage page="about" />;
  if (cleanPath === '/contact') return <StaticPublicPage page="contact" />;
  if (cleanPath === '/privacy') return <StaticPublicPage page="privacy" />;
  if (cleanPath === '/terms') return <StaticPublicPage page="terms" />;
  if (cleanPath === '/cookies') return <StaticPublicPage page="cookies" />;

  return <HomePage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <AppRoutes />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
