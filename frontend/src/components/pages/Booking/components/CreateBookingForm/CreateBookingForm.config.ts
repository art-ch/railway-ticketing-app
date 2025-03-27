import { PassengerDetails } from '@/models/passengerDetails.model';

export const CREATE_BOOKING_FORM_FIELD_CONFIG: {
  name: keyof PassengerDetails;
  label: string;
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
}[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Type in a name' },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Type in an email'
  },
  {
    name: 'phone',
    label: 'Phone number (optional)',
    type: 'tel',
    placeholder: 'Type in phone number'
  }
];
