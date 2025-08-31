'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  ChevronDown,
  Menu,
  X,
  Home,
  Calendar,
  Users,
  Settings,
  DollarSign,
  Tag,
  LogOut,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProperties } from '@/lib/hooks/use-properties';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
  { name: 'Reservations', href: '/admin/reservations', icon: Users },
  { name: 'Properties', href: '/admin/properties', icon: Building },
  { name: 'Rates', href: '/admin/rates', icon: DollarSign },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { properties, selectedProperty, setSelectedProperty } = useProperties();
  
  const currentProperty = selectedProperty;
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-gray-900/80 z-40" onClick={() => setSidebarOpen(false)} />
        )}
        
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <h2 className="text-lg font-semibold">Admin</h2>
            <button onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5 text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Mobile sidebar content */}
          <div className="flex flex-1 flex-col overflow-y-auto py-4">
            {/* Property selector */}
            {properties.length > 0 && (
              <div className="px-4 mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="truncate">
                        {currentProperty?.name || 'Select Property'}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {properties.map((property) => (
                      <DropdownMenuItem 
                        key={property.id}
                        onClick={() => setSelectedProperty(property)}
                      >
                        {property.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {/* Navigation */}
            <nav className="space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-gray-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50",
                    "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-4 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col grow bg-white border-r">
          <div className="flex h-16 items-center justify-center border-b px-6">
            <h2 className="text-lg font-bold">Service Apartments</h2>
          </div>
          
          <div className="flex flex-1 flex-col overflow-y-auto py-4">
            {/* Property selector */}
            {properties.length > 0 && (
              <div className="px-4 mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="truncate">
                        {currentProperty?.name || 'Select Property'}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {properties.map((property) => (
                      <DropdownMenuItem 
                        key={property.id}
                        onClick={() => setSelectedProperty(property)}
                      >
                        {property.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {/* Navigation */}
            <nav className="space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-gray-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Right-side items */}
            <div className="flex items-center ml-auto">
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name || 'User'}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}