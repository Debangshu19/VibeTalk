const MessageSkeleton = () => {
    // Create 6 skeleton messages (random alignment)
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="p-4 space-y-3">
        {skeletonMessages.map((_, idx) => {
          const isSent = idx % 2 === 0; // Simulate alternating messages
          return (
            <div
              key={idx}
              className={`flex ${isSent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg animate-pulse ${
                  isSent ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"
                }`}
              >
                <div className="h-4 w-32 bg-gray-600 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-600 rounded" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default MessageSkeleton;
  