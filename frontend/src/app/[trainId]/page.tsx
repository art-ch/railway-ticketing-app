import { Metadata } from 'next';
import { Train } from '@/components/pages/Train/Train';
import { fetchTrain } from './utils/utils';

export type TrainPageProps = { params: { trainId: string } };

export async function generateMetadata({
  params
}: TrainPageProps): Promise<Metadata> {
  // await is required here. Details at https://nextjs.org/docs/messages/sync-dynamic-apis
  const { trainId } = await params;

  return {
    title: `Train | ${trainId}`,
    description: `Information about train ${trainId}`
  };
}
export default async function TrainPage({ params }: TrainPageProps) {
  // await is required here. Details at https://nextjs.org/docs/messages/sync-dynamic-apis
  const { trainId } = await params;

  const trainInfo = await fetchTrain(trainId);

  return <Train trainInfo={trainInfo} />;
}
