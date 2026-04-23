"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Skeleton } from "@/components/ui/skeleton";
import {
  OrganizationSwitcher,
  UserButton,
  useClerk,
} from "@clerk/nextjs";

import {
  type LucideIcon,
  Home,
  LayoutGrid,
  AudioLines,
  Volume2,
  Settings,
  Headphones,
} from "lucide-react";

interface MenuItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface NavSectionProps {
  label: string;
  items: MenuItem[];
  pathname: string;
}

function NavSection({
  label,
  items,
  pathname,
}: NavSectionProps) {
  return (
    <SidebarGroup>
      {label ? (
        <SidebarGroupLabel className="text-[13px] uppercase text-muted-foreground">
          {label}
        </SidebarGroupLabel>
      ) : null}

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.url
              ? item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url)
              : false;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={!!item.url}
                  isActive={isActive}
                  onClick={item.onClick}
                  tooltip={item.title}
                  className="h-9 px-3 py-2 text-[13px] font-medium tracking-tight border border-transparent data-[active=true]:border-border"
                >
                  {item.url ? (
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const clerk = useClerk();

  /* Hydration fix for Clerk widgets */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Explore Voices",
      url: "/voices",
      icon: LayoutGrid,
    },
    {
      title: "Text to Speech",
      url: "/text-to-speech",
      icon: AudioLines,
    },
    {
      title: "Voice Cloning",
      icon: Volume2,
    },
  ];

  const othersMenuItems: MenuItem[] = [
    {
      title: "Settings",
      icon: Settings,
      onClick: () =>
        clerk.openOrganizationProfile(),
    },
    {
      title: "Help and support",
      url: "mailto:shindepratik@gmail.com",
      icon: Headphones,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="flex flex-col gap-4 pt-4">
        <div className="flex items-center gap-2 pl-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
          <Image
            src="/logo.svg"
            alt="Vertex Logo"
            width={24}
            height={24}
            className="rounded-sm"
          />

          <span className="font-semibold text-lg tracking-tighter text-foreground group-data-[collapsible=icon]:hidden">
            Vertex
          </span>

          <SidebarTrigger className="ml-auto lg:hidden" />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            {mounted ? (
              <OrganizationSwitcher
                hidePersonal
                fallback={
                  <Skeleton className="h-9 w-full rounded-md border bg-white" />
                }
              />
            ) : (
              <Skeleton className="h-9 w-full rounded-md border bg-white" />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="border-b border-dashed border-border" />

      {/* CONTENT */}
      <SidebarContent>
        <NavSection
          label="Main"
          items={mainMenuItems}
          pathname={pathname}
        />

        <NavSection
          label="Others"
          items={othersMenuItems}
          pathname={pathname}
        />
      </SidebarContent>

      <div className="border-b border-dashed border-border" />

      {/* FOOTER */}
      <SidebarFooter className="gap-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            {mounted ? (
              <UserButton
                showName
                fallback={
                  <Skeleton className="h-9 w-full rounded-md border bg-white" />
                }
              />
            ) : (
              <Skeleton className="h-9 w-full rounded-md border bg-white" />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}