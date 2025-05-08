"use client";

import Link from "next/link";

const NavLinks = () => (
  <div className="space-y-4">
    {/* Add your navigation links here */}
    <Link href="/" className="block p-2 hover:bg-secondary rounded-lg">
      Dashboard
    </Link>
    <Link
      href="/dashboard/projects"
      className="block p-2 hover:bg-secondary rounded-lg"
    >
      Projects
    </Link>
    <Link
      href="/dashboard/tasks"
      className="block p-2 hover:bg-secondary rounded-lg"
    >
      Tasks
    </Link>
    {/* Add more navigation links as needed */}
  </div>
);

export default NavLinks;
