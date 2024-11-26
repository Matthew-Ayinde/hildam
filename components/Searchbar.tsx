import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = () => {
  return (
    <div className="flex items-center bg-transparent border-2 border-gray-400 rounded-xl px-4 py-2 w-full max-w-sm">
      <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
      <input
        type="text"
        placeholder="Search..."
        className="ml-3 flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"
      />
    </div>
  );
};

export default SearchBar;
