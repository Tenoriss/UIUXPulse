import { Outlet } from 'react-router-dom';
import { PageGuide } from '@/components/mascot/PageGuide';

/**
 * Pathless layout that mounts the mascot guide inside the router tree.
 *
 * The guide uses `useLocation()`, so it must live under `<RouterProvider>`.
 * Wrapping every top-level branch here keeps that requirement in one place
 * instead of repeating the component in each layout.
 */
export function GuideLayout() {
  return (
    <>
      <Outlet />
      <PageGuide />
    </>
  );
}
