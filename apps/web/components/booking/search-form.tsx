'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form schema
const searchSchema = z.object({
  propertyId: z.string({
    required_error: "Please select a property",
  }),
  checkIn: z.date({
    required_error: "Please select a check-in date",
  }),
  checkOut: z.date({
    required_error: "Please select a check-out date",
  }),
  guests: z.number().min(1).max(10),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export function BookingSearch({ properties }) {
  const router = useRouter();
  const today = new Date();
  
  // Initialize form with default values
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      propertyId: properties[0]?.id || '',
      checkIn: today,
      checkOut: addDays(today, 1),
      guests: 2,
    },
  });
  
  // Form submission handler
  function onSubmit(data: SearchFormValues) {
    const params = new URLSearchParams({
      checkIn: format(data.checkIn, 'yyyy-MM-dd'),
      checkOut: format(data.checkOut, 'yyyy-MM-dd'),
      guests: data.guests.toString(),
    });
    
    // Find selected property code
    const selectedProperty = properties.find(p => p.id === data.propertyId);
    
    // Navigate to search results
    router.push(`/${selectedProperty?.code}/search?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-0 md:grid md:grid-cols-10 md:gap-4">
        {/* Property Select */}
        <div className="md:col-span-3">
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Check-in/Check-out Calendar */}
        <div className="md:col-span-4">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "MMM d, yyyy")
                        ) : (
                          <span>Check-in</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < today}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "MMM d, yyyy")
                        ) : (
                          <span>Check-out</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => 
                          date < form.getValues().checkIn || 
                          date < today
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="md:col-span-1">
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="h-12 pl-9"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Search Button */}
        <div className="md:col-span-2">
          <Button type="submit" className="w-full h-12 text-base font-medium">
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}