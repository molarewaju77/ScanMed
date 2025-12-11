import { Sidebar } from "./Sidebar";
import { ReactNode, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 60 && newWidth < 480) {
        setSidebarWidth(newWidth);
        if (newWidth < 80) {
          setIsCollapsed(true);
        } else {
          setIsCollapsed(false);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setSidebarWidth(80); // Mini width
    } else {
      setSidebarWidth(256); // Default expanded width
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <Sidebar
        width={isMobile ? 0 : sidebarWidth}
        isCollapsed={isCollapsed && !isMobile}
        onCollapse={toggleCollapse}
        startResizing={startResizing}
        isMobile={isMobile}
      />
      <main
        className={cn(
          "flex-1 overflow-auto transition-all duration-200 ease-in-out",
          isResizing ? "transition-none select-none" : ""
        )}
        style={{
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`
        }}
      >
        <div className="p-6 lg:p-8 pt-16 lg:pt-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
