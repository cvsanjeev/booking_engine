import { v4 as uuidv4 } from 'uuid';
import ical from 'ical-generator';

/**
 * Generate iCal content for a reservation
 */
export function generateReservationIcal({
  id,
  propertyName,
  unitTypeName,
  unitCode,
  checkIn,
  checkOut,
  customerName,
}) {
  const calendar = ical({ name: `${propertyName} Booking` });
  
  calendar.createEvent({
    id,
    start: new Date(checkIn),
    end: new Date(checkOut),
    summary: `Stay at ${propertyName}`,
    description: `
      Booking Reference: ${id}
      Unit Type: ${unitTypeName}
      ${unitCode ? `Unit: ${unitCode}` : ''}
      Guest: ${customerName}
    `.trim(),
    location: propertyName,
    organizer: {
      name: propertyName,
      email: 'bookings@example.com',
    },
  });
  
  return calendar.toString();
}

/**
 * Generate iCal content for property availability
 */
export function generatePropertyIcal(property, reservations, blocks) {
  const calendar = ical({
    name: `${property.name} Availability`,
    prodId: { company: property.name, product: 'Booking Engine' },
  });
  
  // Add reservations as events
  reservations.forEach(reservation => {
    const summary = `Booking: ${reservation.customerName || 'Guest'}`;
    const description = `
      Booking Reference: ${reservation.id}
      Unit Type: ${reservation.unitTypeName}
      ${reservation.unitCode ? `Unit: ${reservation.unitCode}` : ''}
      Status: ${reservation.status}
    `.trim();
    
    calendar.createEvent({
      id: reservation.id,
      start: new Date(reservation.checkIn),
      end: new Date(reservation.checkOut),
      summary,
      description,
      location: property.name,
    });
  });
  
  // Add blocks as events
  blocks.forEach(block => {
    const summary = `Blocked: ${block.reason}`;
    
    calendar.createEvent({
      id: block.id || `block-${uuidv4()}`,
      start: new Date(block.startDate),
      end: new Date(block.endDate),
      summary,
      description: `Block: ${block.reason}\nNotes: ${block.notes || 'None'}`,
      location: property.name,
    });
  });
  
  return calendar.toString();
}

/**
 * Parse iCal content from OTA/external source
 */
export async function parseIcalContent(content) {
  // In a real implementation, we'd use a library like ical.js to parse
  // For now, we'll just simulate the parsing with a placeholder
  
  // This would extract VEVENT components and map them to blocks
  const events = [
    {
      id: 'external-1',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-05'),
      summary: 'External Booking',
      description: 'Booking from Airbnb',
    },
    {
      id: 'external-2',
      startDate: new Date('2025-09-10'),
      endDate: new Date('2025-09-15'),
      summary: 'External Booking',
      description: 'Booking from Booking.com',
    },
  ];
  
  return events.map(event => ({
    externalId: event.id,
    startDate: event.startDate,
    endDate: event.endDate,
    reason: event.summary,
    notes: event.description,
    source: 'OTA',
  }));
}