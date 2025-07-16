"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ReactNode } from "react";

export interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
}

export interface DropdownSeparator {
  type: "separator";
}

export interface DropdownLabel {
  type: "label";
  label: string;
}

export type DropdownItemType = DropdownItem | DropdownSeparator | DropdownLabel;

interface ReusableDropdownProps {
  trigger: {
    label: string;
    icon?: string;
    arrowIcon?: string;
    className?: string;
    customContent?: ReactNode; // For fully custom trigger content
    iconClassName?: string;
    arrowIconClassName?: string;
  };
  items: DropdownItemType[];
  onItemSelect?: (value: string) => void;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  itemIconClassName?: string; // Default icon class for all items
  selectedValue?: string; // For radio group selection
  useRadioGroup?: boolean; // Whether to use radio group or regular items
}

export const Dropdown = ({
  trigger,
  items,
  onItemSelect,
  className,
  contentClassName,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  itemIconClassName = "w-4 h-4",
  selectedValue,
  useRadioGroup = false,
}: ReusableDropdownProps) => {
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }
    if (onItemSelect) {
      onItemSelect(item.value);
    }
  };

  const renderItem = (item: DropdownItemType, index: number) => {
    if ("type" in item) {
      if (item.type === "separator") {
        return <DropdownMenuSeparator key={`separator-${index}`} />;
      }
      if (item.type === "label") {
        return (
          <DropdownMenuLabel key={`label-${index}`}>
            {item.label}
          </DropdownMenuLabel>
        );
      }
    }

    const dropdownItem = item as DropdownItem;

    if (useRadioGroup) {
      return (
        <DropdownMenuRadioItem
          key={dropdownItem.value}
          value={dropdownItem.value}
          disabled={dropdownItem.disabled}
          className={dropdownItem.className}
        >
          {dropdownItem.icon && (
            <Icon
              icon={dropdownItem.icon}
              className={`mr-2 flex-shrink-0 ${dropdownItem.iconClassName || itemIconClassName}`}
            />
          )}
          {dropdownItem.label}
        </DropdownMenuRadioItem>
      );
    }

    return (
      <DropdownMenuItem
        key={dropdownItem.value}
        onClick={() => handleItemClick(dropdownItem)}
        disabled={dropdownItem.disabled}
        className={dropdownItem.className}
      >
        {dropdownItem.icon && (
          <Icon
            icon={dropdownItem.icon}
            className={`mr-2 flex-shrink-0 ${dropdownItem.iconClassName || itemIconClassName}`}
          />
        )}
        {dropdownItem.label}
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`border-border text-muted-foreground flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm ${
          trigger.className || ""
        } ${className || ""}`}
      >
        {trigger.customContent ? (
          trigger.customContent
        ) : (
          <>
            {trigger.icon && (
              <Icon
                icon={trigger.icon}
                className={`flex-shrink-0 ${trigger.iconClassName || "h-4 w-4"}`}
              />
            )}
            {trigger.label}
            {trigger.arrowIcon && (
              <Icon
                icon={trigger.arrowIcon}
                className={`flex-shrink-0 ${trigger.arrowIconClassName || "h-6 w-6"}`}
              />
            )}
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {useRadioGroup ? (
          <DropdownMenuRadioGroup
            value={selectedValue}
            onValueChange={onItemSelect}
          >
            {items.map((item, index) => renderItem(item, index))}
          </DropdownMenuRadioGroup>
        ) : (
          items.map((item, index) => renderItem(item, index))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
