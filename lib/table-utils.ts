/**
 * Utility functions for table components
 */

export interface DropdownItem {
  type?: "label";
  label: string;
  value?: string;
}

/**
 * Get the label for a selected filter value from dropdown items
 * @param items - Array of dropdown items
 * @param selectedValue - The currently selected value
 * @param defaultLabel - Default label to return if no match is found
 * @returns The label of the selected item or default label
 */
export const getSelectedLabel = (
  items: DropdownItem[],
  selectedValue: string,
  defaultLabel: string = "All",
): string => {
  const selectedItem = items.find(
    (item) => "value" in item && item.value === selectedValue,
  ) as { label: string; value: string } | undefined;

  return selectedItem ? selectedItem.label : defaultLabel;
};

/**
 * Get filter label specifically for filter dropdowns
 * @param items - Array of filter dropdown items
 * @param selectedValue - The currently selected filter value
 * @returns The label of the selected filter or "ALL"
 */
export const getFilterLabel = (
  items: DropdownItem[],
  selectedValue: string,
): string => {
  return getSelectedLabel(items, selectedValue, "ALL");
};

/**
 * Get location label specifically for location dropdowns
 * @param items - Array of location dropdown items
 * @param selectedValue - The currently selected location value
 * @returns The label of the selected location or "Location"
 */
export const getLocationLabel = (
  items: DropdownItem[],
  selectedValue: string,
): string => {
  return getSelectedLabel(items, selectedValue, "Location");
};

/**
 * Generic search filter function for table data
 * @param data - Array of data to filter
 * @param searchTerm - The search term to filter by
 * @param searchFields - Array of field names to search in
 * @returns Filtered array of data
 */
export const filterTableData = <T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
): T[] => {
  if (!searchTerm) return data;

  const lowercaseSearchTerm = searchTerm.toLowerCase();

  return data.filter((item) =>
    searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(lowercaseSearchTerm),
    ),
  );
};

/**
 * Calculate pagination data
 * @param totalItems - Total number of items
 * @param currentPage - Current page number (1-based)
 * @param itemsPerPage - Number of items per page
 * @returns Object containing pagination calculations
 */
export const calculatePagination = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

/**
 * Get paginated data slice
 * @param data - Array of data to paginate
 * @param currentPage - Current page number (1-based)
 * @param itemsPerPage - Number of items per page
 * @returns Sliced array for the current page
 */
export const getPaginatedData = <T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number,
): T[] => {
  const { startIndex, endIndex } = calculatePagination(
    data.length,
    currentPage,
    itemsPerPage,
  );
  return data.slice(startIndex, endIndex);
};
