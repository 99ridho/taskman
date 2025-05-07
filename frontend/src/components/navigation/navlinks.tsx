"use client";

const NavLinks = () => (
  <div className="space-y-4">
    {/* Add your navigation links here */}
    <a href="/" className="block p-2 hover:bg-secondary rounded-lg">
      Dashboard
    </a>
    <a
      href="/dashboard/projects"
      className="block p-2 hover:bg-secondary rounded-lg"
    >
      Projects
    </a>
    <a
      href="/dashboard/tasks"
      className="block p-2 hover:bg-secondary rounded-lg"
    >
      Tasks
    </a>
    {/* Add more navigation links as needed */}
  </div>
);

export default NavLinks;
