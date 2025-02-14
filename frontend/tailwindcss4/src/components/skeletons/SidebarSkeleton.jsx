import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-gray-700 
    flex flex-col transition-all duration-200 bg-black text-white"
    >
      {/* Header */}
      <div className="border-b border-gray-700 w-full p-5">
        <div className="flex items-center gap-2 text-white">
          <Users className="w-6 h-6 text-gray-300" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="bg-gray-700 animate-pulse size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="bg-gray-700 animate-pulse h-4 w-32 mb-2 rounded" />
              <div className="bg-gray-600 animate-pulse h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
