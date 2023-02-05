const Title = ({ title }: { title: string }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-400" />
      </div>
      <div className="mx-4">
        <div className="relative flex justify-start">
          <div className="px-1 bg-gray-100">
            <h1 className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;
