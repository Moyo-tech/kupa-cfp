"use client"

import type React from "react"

import { useState, useContext, createContext, type ReactNode } from "react"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProviderProps {
  children: ReactNode
}

interface SidebarContextProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextProps>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
})

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <div className="flex h-screen overflow-hidden">{children}</div>
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { setIsSidebarOpen } = useContext(SidebarContext)

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("p-0 h-8 w-8", className)}
      onClick={() => setIsSidebarOpen((prev) => !prev)}
      {...props}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}

export function SidebarInset({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-auto">{children}</div>
}

export function AppSidebar({ currentView, onNavigate }: { currentView: string; onNavigate: (view: string) => void }) {
  return (
    <Sidebar>
      <SidebarContent>
        <div>Sidebar Content</div>
      </SidebarContent>
    </Sidebar>
  )
}

function Sidebar({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useContext(SidebarContext)

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-secondary/50 transition-transform duration-300",
        isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full w-0",
      )}
    >
      {children}
    </aside>
  )
}

function SidebarContent({ children }: { children: ReactNode }) {
  return <div className="flex-1">{children}</div>
}

function SidebarHeader({ children }: { children: ReactNode }) {
  return <div className="px-4 py-2">{children}</div>
}

function SidebarMenu({ children }: { children: ReactNode }) {
  return <ul className="space-y-1 px-2">{children}</ul>
}

function SidebarMenuItem({ children }: { children: ReactNode }) {
  return <li>{children}</li>
}

function SidebarMenuButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center gap-2 w-full justify-start rounded-md px-3.5 py-2.5 font-medium transition-colors hover:bg-secondary",
        isActive ? "bg-secondary text-foreground" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function SidebarGroup({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

function SidebarGroupLabel({ children }: { children: ReactNode }) {
  return <p className="px-3.5 text-sm font-medium text-muted-foreground">{children}</p>
}

function SidebarGroupContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
}
