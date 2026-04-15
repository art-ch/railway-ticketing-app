# Railway Ticketing SDK
### Purpose 

This SDK is the Single Source of Truth for the system. It contains shared TypeScript interfaces and Zod schemas used by both the Frontend and Backend to ensure type-safety and data integrity across the network boundary.

### Installation 

Install the package via npm to use the models and clients in your service:
npm i railway-ticketing-app-sdk

### Models & Validation 

All system entities are defined in sdk/src/models. The SDK exports:
Zod Schemas: For runtime validation at the API Gateway or Form level.
TypeScript Types: For compile-time safety across the codebase.

### Usage Example 
```typescript
import { BookingSchema, Booking } from 'railway-ticketing-app-sdk';

// Runtime Validation
const result = BookingSchema.safeParse(data);

if (!result.success) {
console.error("Invalid Booking Data:", result.error.format());
}

// Compile-time Type Safety
const myBooking: Booking = result.data;
