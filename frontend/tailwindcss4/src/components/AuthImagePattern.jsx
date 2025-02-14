const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="flex items-center justify-center bg-black p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-full sm:max-w-md text-center">
          <div className="grid grid-cols-3 gap-3 mb-6 sm:mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl border-2 border-white bg-white/20 ${
                  i % 2 === 0 ? "animate-pulse" : ""
                }`}
              />
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;  