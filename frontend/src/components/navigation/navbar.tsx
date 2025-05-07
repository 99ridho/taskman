"use client";

import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import NavLinks from "./navlinks";
import { useState } from "react";
import { useAuth } from "@/app/dashboard/context";

interface NavbarProps {
  logoutHandler: () => void;
}

const Navbar = (props: NavbarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const auth = useAuth();

  return (
    <nav className="h-16 border-b fixed top-0 w-full bg-background z-50 flex items-center px-4">
      <div className="flex flex-row justify-between w-full">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold">Task Management</h1>
        </div>
        <div className="flex items-center">
          <p className="text-lg font-medium">{auth.profile?.username}</p>
          <Button
            variant="outline"
            className="ml-4"
            onClick={() => {
              props.logoutHandler();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
