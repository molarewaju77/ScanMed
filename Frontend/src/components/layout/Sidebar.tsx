import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Scan,
  MessageCircle,
  Clock,
  ChevronRight,
  Menu,
  X,
  Pill,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Scan", path: "/scan", icon: Scan },
  { name: "Chat", path: "/chat", icon: MessageCircle },
  { name: "History", path: "/history", icon: Clock },
  { name: "Med Buddy", path: "/med-buddy", icon: Pill },
  { name: "Health Blog", path: "/health-blog", icon: BookOpen },
  { name: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  width?: number;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  startResizing?: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}

export function Sidebar({
  className,
  width = 256,
  isCollapsed = false,
  onCollapse,
  startResizing,
  isMobile = false
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(location.pathname.startsWith("/admin"));
  const [user, setUser] = useState({
    name: "User",
    username: "@user",
    initials: "U",
    role: "user",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const name = parsedUser.name || parsedUser.fullName || "User";
        setUser({
          name: name,
          username: parsedUser.username ? `@${parsedUser.username}` : `@${parsedUser.email?.split('@')[0] || 'user'}`,
          initials: name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          role: parsedUser.role || "user",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  const NavItemContent = ({ item, isActive }: { item: any, isActive: boolean }) => (
    <>
      <item.icon className={cn("w-5 h-5 flex-shrink-0", isCollapsed && "mx-auto")} />
      {!isCollapsed && <span className="truncate">{item.name}</span>}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-medical border border-border"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 lg:transition-none overflow-hidden group",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
          className
        )}
        style={{ width: isMobile ? undefined : width }}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Toggle */}
        <div className={cn("flex items-center border-b border-sidebar-border h-16 transition-all duration-200", isCollapsed ? "justify-center px-0" : "justify-between px-4")}>
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
            <div className="w-8 h-8 rounded-lg gradient-medical flex items-center justify-center flex-shrink-0">
              <Scan className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground truncate">ScanMed</span>
          </div>

          {/* Collapse Toggle (Desktop only) */}
          {!isMobile && (
            <button
              onClick={onCollapse}
              className={cn(
                "p-1.5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors",
                isCollapsed && "mx-auto"
              )}
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              if (isCollapsed) {
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-50 ml-2 font-medium">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}

            {/* Admin Link */}
            {['superadmin', 'admin', 'manager'].includes(user.role) && (
              isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onCollapse?.()}
                      className={cn(
                        "flex items-center justify-center p-2 mt-4 rounded-lg text-sm font-medium transition-all duration-200 w-full",
                        location.pathname.startsWith("/admin")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                      )}
                    >
                      <Shield className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-50 ml-2 font-medium">
                    Admin Panel
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Collapsible
                  open={adminOpen}
                  onOpenChange={setAdminOpen}
                  className="space-y-1 mt-4"
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                      location.pathname.startsWith("/admin")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      <span className="truncate">Admin Panel</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        adminOpen ? "rotate-180" : ""
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-4 mt-1">
                    {[
                      { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
                      { to: "/admin/users", icon: Users, label: "Users" },
                      { to: "/admin/blogs", icon: FileText, label: "Blogs" },
                      { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
                      { to: "/admin/chats", icon: MessageSquare, label: "Chats" }
                    ].map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/admin"}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          location.pathname === link.to
                            ? "text-primary bg-primary/5"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/30"
                        )}
                      >
                        <link.icon className="w-4 h-4" />
                        <span className="truncate">{link.label}</span>
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            )}
          </nav>
        </TooltipProvider>

        {/* User profile */}
        <div className={cn("border-t border-sidebar-border transition-all duration-200", isCollapsed ? "p-2" : "p-4")}>
          {isCollapsed ? (
            <div className="flex flex-col gap-2 items-center">
              <div className="w-8 h-8 rounded-full gradient-medical flex items-center justify-center text-primary-foreground font-semibold text-xs">
                {user.initials}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <NavLink
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-medical flex items-center justify-center text-primary-foreground font-semibold text-xs">
                  {user.initials}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </NavLink>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        {!isMobile && (
          <div
            onMouseDown={startResizing}
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-50 group"
          >
            <div className="absolute top-1/2 -translate-y-1/2 -right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
