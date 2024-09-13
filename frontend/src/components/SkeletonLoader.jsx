import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import styles for the skeleton loader

const SkeletonLoader = () => {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-4">
      <Skeleton height={60} width={200}  className="mb-4" />
      <Skeleton height={60} width={200} className="mb-4" />
      <Skeleton height={60} width={200}  className="mb-4" />
      <Skeleton height={60} width={200}  />
    </div>
  );
};

export default SkeletonLoader;
