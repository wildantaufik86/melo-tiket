import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ShippingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p>
          <Skeleton width={300} />
        </p>
        <p>
          <Skeleton width={300} />
        </p>
        <p>
          <Skeleton width={300} />
        </p>
        <p>
          <Skeleton width={300} />
        </p>
      </div>
    </div>
  );
}
