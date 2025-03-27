import React from 'react';

import { PassengerDetails } from '@/models/passengerDetails.model';

export type PassengerInfoProps = { passengerInfo: PassengerDetails };

export const PassengerInfo = ({ passengerInfo }: PassengerInfoProps) => {
  const { name, email, phone } = passengerInfo;

  return (
    <div>
      <p className="font-bold pb-1">Passenger Info</p>

      <table className="w-full">
        <thead>
          <tr className="text-sm font-semibold">
            <th className="text-left min-w-45">Name</th>
            <th className="text-left min-w-45">Email</th>
            <th className="text-left min-w-45">Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="min-w-45">{name}</td>
            <td className="min-w-45">{email}</td>
            <td className="min-w-45">{phone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
