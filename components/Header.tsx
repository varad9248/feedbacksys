"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  FileText,
  LogOut,
  LucideLayoutDashboard,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ModeToggle } from "./Toogle-Theme";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LucideLayoutDashboard },
    { name: "Forms", href: "/forms", icon: FileText },
    { name: "Find", href: "/forms/share", icon: Search },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout Successful!");
      if (typeof window !== "undefined") {
        window.location.href = "auth/login";
      }
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };

  const getUserInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last || user?.email?.[0] || "U").toUpperCase();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${scrolled ? "shadow-sm" : ""
        }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 ml-2">
          <Link
            href="/home"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">FeedForms</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium ml-6">
              {navigation.map(({ href, name, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-md transition-colors ${isActive(href)
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right-side: Auth Buttons / Avatar / Theme */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size="icon"
              variant="ghost"
              className="md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Authenticated Dropdown */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 px-2 rounded-full flex items-center gap-2 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5">
                <div className="px-2 py-1.5 mb-1 border-b">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Logged in</p>
                </div>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="text-sm font-medium">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Divider & Dark Mode Toggle */}
          <div className="border-l h-6 mx-1 hidden sm:block" />
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navigation.map(({ href, name, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-md ${isActive(href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
