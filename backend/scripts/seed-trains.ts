import { v4 as uuid } from 'uuid';
import { getDynamoDBDocClient } from '../src/infra/dynamodb';

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const trainConfigs = [
  {
    name: 'Morning Express',
    type: 'express',
    departure: '06:00',
    arrival: '08:30',
    from: 'London',
    to: 'Manchester'
  },
  {
    name: 'City Local',
    type: 'local',
    departure: '07:00',
    arrival: '08:00',
    from: 'London',
    to: 'Reading'
  },
  {
    name: 'Scottish Long-Distance',
    type: 'long-distance',
    departure: '08:00',
    arrival: '14:00',
    from: 'London',
    to: 'Edinburgh'
  },
  {
    name: 'Express Connect',
    type: 'express',
    departure: '09:00',
    arrival: '11:30',
    from: 'Manchester',
    to: 'London'
  },
  {
    name: 'Local Commuter',
    type: 'local',
    departure: '10:00',
    arrival: '11:00',
    from: 'Reading',
    to: 'London'
  },
  {
    name: 'Continental Long-Distance',
    type: 'long-distance',
    departure: '11:00',
    arrival: '17:00',
    from: 'London',
    to: 'Glasgow'
  },
  {
    name: 'Midday Express',
    type: 'express',
    departure: '12:00',
    arrival: '14:30',
    from: 'London',
    to: 'Leeds'
  },
  {
    name: 'Local Link',
    type: 'local',
    departure: '13:00',
    arrival: '14:00',
    from: 'Manchester',
    to: 'Liverpool'
  },
  {
    name: 'Northern Long-Distance',
    type: 'long-distance',
    departure: '14:00',
    arrival: '20:00',
    from: 'London',
    to: 'Aberdeen'
  },
  {
    name: 'Evening Express',
    type: 'express',
    departure: '17:00',
    arrival: '19:30',
    from: 'Leeds',
    to: 'London'
  }
] as const;

const generateTrains = () => {
  const tomorrowDate = getTomorrowDate();

  return trainConfigs.map((config) => ({
    trainId: uuid(),
    name: config.name,
    trainType: config.type,
    departureStation: config.from,
    arrivalStation: config.to,
    departureTime: `${tomorrowDate}T${config.departure}:00Z`,
    arrivalTime: `${tomorrowDate}T${config.arrival}:00Z`,
    seats: Array(10)
      .fill(null)
      .map((_, seatIndex) => ({
        seatNumber: seatIndex + 1,
        isBooked: false
      }))
  }));
};

const seedTrains = async () => {
  const docClient = getDynamoDBDocClient();
  const trains = generateTrains();

  for (const train of trains) {
    await docClient.put({
      TableName: 'TrainsTable',
      Item: train
    });
    console.log(`Seeded train: ${train.name}`);
  }
};

// Run if called directly
if (require.main === module) {
  seedTrains()
    .then(() => console.log('Seeding completed'))
    .catch(console.error);
}
