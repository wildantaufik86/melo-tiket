import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TableSkeleton() {
  return (
    <div className="p-4 rounded-lg shadow-sm h-screen">
      <div className="grid grid-cols-4 gap-4">
        <Skeleton height={100} className="rounded-md" />
        <Skeleton height={100} className="rounded-md" />
        <Skeleton height={100} className="rounded-md" />
        <Skeleton height={100} className="rounded-md" />
      </div>
    </div>
  );
}
