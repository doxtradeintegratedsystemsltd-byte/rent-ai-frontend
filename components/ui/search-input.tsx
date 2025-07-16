"use client";

import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.ComponentProps<"input"> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  searchIcon?: string;
  clearIcon?: string;
  searchIconClassName?: string;
  clearIconClassName?: string;
  containerClassName?: string;
  iconClassName?: string;
  showClearButton?: boolean;
  loading?: boolean;
  loadingIcon?: string;
  debounceMs?: number;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      onClear,
      searchIcon = "material-symbols:search-rounded",
      clearIcon = "material-symbols:close-rounded",
      searchIconClassName = "w-5 h-5",
      clearIconClassName = "w-4 h-4",
      containerClassName,
      iconClassName,
      showClearButton = true,
      loading = false,
      loadingIcon = "material-symbols:progress-activity",
      debounceMs = 300,
      className,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value || "");
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
      null,
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (value === undefined) {
        setInternalValue(newValue);
      }

      if (onChange) {
        onChange(e);
      }

      if (onSearch && debounceMs > 0) {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
          onSearch(newValue);
        }, debounceMs);

        setDebounceTimer(timer);
      } else if (onSearch) {
        onSearch(newValue);
      }
    };

    const handleClear = () => {
      const newValue = "";

      if (value === undefined) {
        setInternalValue(newValue);
      }

      if (onClear) {
        onClear();
      }

      if (onSearch) {
        onSearch(newValue);
      }

      // Create synthetic event for onChange
      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue },
          currentTarget: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const showClear =
      showClearButton && currentValue && String(currentValue).length > 0;

    return (
      <div className={cn("relative", containerClassName)}>
        <Icon
          icon={loading ? loadingIcon : searchIcon}
          className={cn(
            "text-muted-foreground absolute top-1/2 left-4 flex-shrink-0 -translate-y-1/2 transform",
            loading && "animate-spin",
            searchIconClassName,
            iconClassName,
          )}
        />
        <Input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={handleChange}
          className={cn("pl-10", showClear && "pr-10", className)}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transform transition-colors"
          >
            <Icon
              icon={clearIcon}
              className={cn("flex-shrink-0", clearIconClassName)}
            />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
