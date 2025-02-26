import { Metadata } from 'next';
import { Train } from '@/components/pages/Train/Train';
import { fetchTrain } from './utils/utils';

export type TrainPageProps = { params: { trainId: string } };

export async function generateMetadata({
  params
}: TrainPageProps): Promise<Metadata> {
  return {
    title: `Train | ${params.trainId}`,
    description: `Information about train ${params.trainId}`
  };
}
export default async function TrainPage({ params }: TrainPageProps) {
  // await is required here. Details at https://nextjs.org/docs/messages/sync-dynamic-apis
  const { trainId } = await params;

  const trainInfo = await fetchTrain(trainId);

  return <Train trainInfo={trainInfo} />;
}
