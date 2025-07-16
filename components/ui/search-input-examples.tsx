import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";

// Example usage of the SearchInput component

export const SearchInputExamples = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (value: string) => {
    console.log("Search:", value);
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    console.log("Search cleared");
    setSearchValue("");
  };

  return (
    <div className="flex max-w-2xl flex-col gap-8 p-8">
      <h2 className="text-2xl font-bold">SearchInput Examples</h2>

      <div className="flex flex-col gap-6">
        {/* Basic search input */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Basic Search</h3>
          <SearchInput
            placeholder="Search..."
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>

        {/* Controlled search input */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Controlled Search</h3>
          <SearchInput
            placeholder="Controlled search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClear}
          />
          <p className="text-muted-foreground text-sm">
            Current value: {searchValue}
          </p>
        </div>

        {/* Search with loading state */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Search with Loading</h3>
          <SearchInput
            placeholder="Search with loading..."
            onSearch={handleSearch}
            loading={loading}
            debounceMs={500}
          />
        </div>

        {/* Custom icons */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Custom Icons</h3>
          <SearchInput
            placeholder="Search users..."
            searchIcon="material-symbols:person-search"
            clearIcon="material-symbols:cancel"
            searchIconClassName="w-6 h-6"
            clearIconClassName="w-5 h-5"
            onSearch={handleSearch}
          />
        </div>

        {/* No clear button */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No Clear Button</h3>
          <SearchInput
            placeholder="Search without clear..."
            showClearButton={false}
            onSearch={handleSearch}
          />
        </div>

        {/* Custom styling */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Custom Styling</h3>
          <SearchInput
            placeholder="Custom styled search..."
            className="border-blue-200 bg-blue-50 focus:border-blue-400"
            iconClassName="text-blue-500"
            containerClassName="w-full max-w-md"
            onSearch={handleSearch}
          />
        </div>

        {/* No debounce (instant search) */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Instant Search (No Debounce)
          </h3>
          <SearchInput
            placeholder="Instant search..."
            debounceMs={0}
            onSearch={handleSearch}
          />
        </div>

        {/* Different placeholder and size */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Different Sizes</h3>
          <div className="space-y-3">
            <SearchInput
              placeholder="Small search..."
              className="py-2 text-sm"
              searchIconClassName="w-4 h-4"
              clearIconClassName="w-3 h-3"
              onSearch={handleSearch}
            />
            <SearchInput
              placeholder="Large search..."
              className="py-3 text-lg"
              searchIconClassName="w-6 h-6"
              clearIconClassName="w-5 h-5"
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage examples in your components:
//
// 1. Basic usage:
// <SearchInput
//   placeholder="Search..."
//   onSearch={(value) => console.log(value)}
// />
//
// 2. Controlled with state:
// const [search, setSearch] = useState("");
// <SearchInput
//   value={search}
//   onChange={(e) => setSearch(e.target.value)}
//   onSearch={handleSearch}
// />
//
// 3. With loading state:
// <SearchInput
//   placeholder="Search..."
//   loading={isLoading}
//   onSearch={handleSearch}
// />
//
// 4. Custom icons and styling:
// <SearchInput
//   placeholder="Search users..."
//   searchIcon="material-symbols:person-search"
//   className="bg-gray-50"
//   onSearch={handleSearch}
// />
//
// 5. Instant search (no debounce):
// <SearchInput
//   placeholder="Instant search..."
//   debounceMs={0}
//   onSearch={handleSearch}
// />
