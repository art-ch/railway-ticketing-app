import { LayoutProps } from '@/types/types';
import { getFormattedTime } from '@/utils/formatters';
import { Metadata } from 'next';
import { TrainPageProvider } from './context';
import { fetchTrain } from './utils/utils';
import { notFound } from 'next/navigation';

export type TrainPageMetadataProps = { params: { trainId: string } };

export async function generateMetadata({
  params
}: TrainPageMetadataProps): Promise<Metadata> {
  // await is required here. Details at https://nextjs.org/docs/messages/sync-dynamic-apis
  const { trainId } = await params;

  return {
    title: `Train | ${trainId}`,
    description: `Information about train ${trainId}`
  };
}

export type TrainPageLayoutProps = LayoutProps & {
  params: { trainId: string };
};

export default async function TrainPageLayout({
  children,
  params
}: TrainPageLayoutProps) {
  const { trainId } = await params;

  const trainInfo = await fetchTrain(trainId);

  if (!trainInfo) {
    notFound();
  }

  const { departureStation, arrivalStation, departureTime, name, trainType } =
    trainInfo;

  return (
    <div>
      <div className="w-full border-b border-slate-300 p-2">
        <h1>
          {departureStation} → {arrivalStation},{' '}
          {getFormattedTime(new Date(departureTime))}
        </h1>

        <div className="flex gap-2">
          <div>{name}</div>
          <div>{trainType}</div>
        </div>
      </div>

      <TrainPageProvider pageData={trainInfo}>{children}</TrainPageProvider>
    </div>
  );
}
