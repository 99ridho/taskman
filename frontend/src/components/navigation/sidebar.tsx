"use client";

import NavLinks from "./navlinks";

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-64 border-r p-4 fixed h-[calc(100vh-4rem)]">
      <NavLinks />
    </aside>
  );
};

export default Sidebar;
