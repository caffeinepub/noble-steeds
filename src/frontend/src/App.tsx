import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Layout } from './components/Layout';
import { HorsesPage } from './pages/HorsesPage';
import { HorseDetailPage } from './pages/HorseDetailPage';
import { ActivityTimelinePage } from './pages/ActivityTimelinePage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HorsesPage,
});

const horsesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/horses',
  component: HorsesPage,
});

const horseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/horses/$id',
  component: HorseDetailPage,
});

const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/activity',
  component: ActivityTimelinePage,
});

const routeTree = rootRoute.addChildren([indexRoute, horsesRoute, horseDetailRoute, activityRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
