This SDK is the Single Source of Truth for the system. It contains the shared TypeScript interfaces used by the Frontend and Backend to ensure type-safety across the network boundary.

To use this SDK, install it via npm<br>
`npm i railway-ticketing-app-sdk`

Usage Example:
```
import { Booking } from 'railway-ticketing-app-sdk';

const handleBookingSuccess = (newBookingData: Booking) => { ... };
```
