This SDK is the Single Source of Truth for the system. It contains the shared TypeScript interfaces used by the Frontend and Backend to ensure type-safety across the network boundary.

To use this SDK, install it via npm<br>
`npm i railway-ticketing-app-sdk`

This SDK uses Zod for runtime validation. All models are exported as both Zod Schemas and TypeScript Types. This ensures that data entering the system is validated at the boundary. All models are located in `sdk/src/models`

Usage Example:
```
import { BookingSchema, Booking } from 'railway-ticketing-app-sdk';

// 1. Runtime Validation (e.g., in a Lambda or Form)
const result = BookingSchema.safeParse(data);

if (!result.success) {
  console.error("Invalid Booking Data:", result.error.format());
}

// 2. Compile-time Type Safety
const myBooking: Booking = result.data;
```
