const Skeleton = ({ className }: { className: string }) => {
  return (
    <>
      <div
        className={`${className} transition-colors animate-pulse bg-gray-600`}
      />
    </>
  );
}

export default Skeleton;
