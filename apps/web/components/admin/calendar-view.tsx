'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { AdminLayout } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MonthCalendar } from '@/components/admin/month-calendar';
import { useProperties } from '@/lib/hooks/use-properties';
import { useReservations } from '@/lib/hooks/use-reservations';

export function CalendarView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  
  // Use the date from URL or default to today
  const [currentDate, setCurrentDate] = useState<Date>(
    dateParam ? parseISO(dateParam) : new Date()
  );
  
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const { properties, selectedProperty } = useProperties();
  const { reservations, blocks, isLoading, error } = useReservations(
    selectedProperty,
    format(currentDate, 'yyyy-MM-01'),
    format(addMonths(currentDate, 1), 'yyyy-MM-01')
  );
  
  // Get selected property
  const property = selectedProperty;
  
  // Get unit types for the selected property
  const [unitTypes, setUnitTypes] = useState<any[]>([]);
  const [selectedUnitType, setSelectedUnitType] = useState<string>('all');
  
  useEffect(() => {
    if (property) {
      // In a real app, fetch unit types from API
      // For now, we'll use placeholder data
      setUnitTypes([
        { id: 'all', name: 'All Unit Types' },
        { id: '1A', name: 'Studio Apartment' },
        { id: '1B', name: 'One Bedroom Suite' },
        { id: 'A1', name: 'Deluxe Studio' },
        { id: 'B1', name: 'Premium One Bedroom' },
        { id: 'C1', name: 'Executive Suite' },
      ]);
    }
  }, [property]);
  
  // Navigation functions
  const goToPreviousMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    updateUrl(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    updateUrl(newDate);
  };
  
  const goToToday = () => {
    const newDate = new Date();
    setCurrentDate(newDate);
    updateUrl(newDate);
  };
  
  // Update URL with new date
  const updateUrl = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('date', format(date, 'yyyy-MM-dd'));
    router.replace(`/admin/calendar?${params.toString()}`);
  };
  
  // Filter reservations by unit type
  const filteredReservations = selectedUnitType === 'all' 
    ? reservations 
    : reservations.filter(res => res.unitTypeCode === selectedUnitType);
  
  const filteredBlocks = selectedUnitType === 'all'
    ? blocks
    : blocks.filter(block => block.unitTypeCode === selectedUnitType);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Calendar</h1>
        
        <div className="flex flex-wrap gap-3">
          <Select value={selectedUnitType} onValueChange={setSelectedUnitType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Unit Type" />
            </SelectTrigger>
            <SelectContent>
              {unitTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={view} onValueChange={(val: any) => setView(val)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={goToPreviousMonth}>
            Previous
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" onClick={goToNextMonth}>
            Next
          </Button>
          
          <Button onClick={() => router.push('/admin/reservations/new')}>
            New Booking
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <p>Loading calendar...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-red-500">Error loading calendar data</p>
          </div>
        ) : (
          view === 'month' && (
            <MonthCalendar 
              date={currentDate}
              reservations={filteredReservations}
              blocks={filteredBlocks}
            />
          )
        )}
        
        {/* We would implement Week and Day views similarly */}
        {view !== 'month' && (
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-center">
              {view === 'week' ? 'Week' : 'Day'} view is under development
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}