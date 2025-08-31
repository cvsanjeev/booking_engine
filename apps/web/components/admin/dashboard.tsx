'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon,
  DollarSign,
  Users,
  Bookmark,
  TrendingUp,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Overview } from '@/components/admin/overview';
import { RecentBookings } from '@/components/admin/recent-bookings';
import { useProperties } from '@/lib/hooks/use-properties';

export function Dashboard() {
  const router = useRouter();
  const { properties, selectedProperty, setSelectedProperty } = useProperties();
  const [date, setDate] = useState<Date>(new Date());
  
  // Handle property selection
  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setSelectedProperty(property || null);
    // Could store this in localStorage or in user preferences
  };
  
  // Handle date selection in calendar
  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    setDate(day);
    // Navigate to specific day view
    router.push(`/admin/calendar?date=${day.toISOString().split('T')[0]}`);
  };
  
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <Button onClick={() => router.push('/admin/reservations/new')}>
          New Booking
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Check-ins</p>
              <h3 className="text-2xl font-bold mt-1">8</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            +2 from yesterday
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
              <h3 className="text-2xl font-bold mt-1">₹52,400</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-xs text-green-600 mt-2">
            +12% from yesterday
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <h3 className="text-2xl font-bold mt-1">78%</h3>
            </div>
            <div className="bg-orange-100 p-2 rounded-full">
              <Bookmark className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="text-xs text-orange-600 mt-2">
            +5% from last week
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">ADR</p>
              <h3 className="text-2xl font-bold mt-1">₹4,850</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-xs text-purple-600 mt-2">
            +₹350 from last week
          </div>
        </Card>
      </div>
      
      {/* Calendar and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-1 p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Calendar
          </h3>
          <Calendar
            selected={date}
            onSelect={handleSelect}
          />
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => router.push('/admin/calendar')}
          >
            View Calendar
          </Button>
        </Card>
        
        <Card className="lg:col-span-2 p-6">
          <Tabs defaultValue="revenue">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Analytics</h3>
              <TabsList>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="revenue">
              <Overview />
            </TabsContent>
            
            <TabsContent value="occupancy">
              <Overview />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Recent Bookings */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Bookings</h3>
        <RecentBookings />
      </Card>
    </AdminLayout>
  );
}