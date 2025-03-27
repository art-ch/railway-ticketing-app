const HeaderSkeleton = () => (
  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
);

const RowSkeleton = () => (
  <div className="grid grid-cols-[repeat(3,_180px)] gap-2">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="h-3 bg-gray-200 rounded animate-pulse" />
    ))}
  </div>
);

const ButtonSkeleton = () => (
  <div className="h-8 bg-gray-200 rounded animate-pulse w-45 space-x-5 ml-auto" />
);

export const BookingDataSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4">
      <HeaderSkeleton />
      <RowSkeleton />
      <HeaderSkeleton />
      <RowSkeleton />
      <ButtonSkeleton />
    </div>
  );
};
