import { Outlet } from "react-router-dom";

import MainNavigation from "./MainNavigation";

function Layout() {
  return (
    <>
      <MainNavigation />
      <Outlet />
    </>
  );
}

export default Layout;
