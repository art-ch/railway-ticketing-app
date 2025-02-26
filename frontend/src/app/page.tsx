import { Home } from '@/components/pages/Home/Home';
import { fetchTrainList } from './utils/utils';

export default async function HomePage() {
  const trainList = await fetchTrainList();

  return <Home trainList={trainList} />;
}
