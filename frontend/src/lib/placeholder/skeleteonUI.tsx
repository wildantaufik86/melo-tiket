import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function ProfileSkeleton() {
  return (
    <div className="p-4">
      <Skeleton circle height={60} width={60} />
      <Skeleton height={20} width={150} />
      <Skeleton height={15} width={100} />
    </div>
  );
}

export default function ProductCardSkeleton() {
  return (
    <div className="p-4 rounded-lg shadow-sm">
      <Skeleton height={150} className="rounded-md" />
      <div className="mt-2">
        <Skeleton height={20} width={180} />
        <Skeleton height={15} width={100} className="mt-1" />
        <Skeleton height={25} width={120} className="mt-2" />
      </div>
    </div>
  );
}
