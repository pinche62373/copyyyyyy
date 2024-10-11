import { type FormMetadata } from "@conform-to/react";
import { autoUpdate, size, useFloating } from "@floating-ui/react-dom";
import { useCombobox } from "downshift";
import React from "react";

import { IconChevronDown } from "#app/components/icons/icon-chevron-down";
import { cn } from "#app/utils/lib/cn";

interface PropTypes {
  label: string;
  fields: ReturnType<FormMetadata["getFieldset"]>;
  items: {
    id: string;
    name: string;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any record type
  initialSelectedItem?: any;
}

export function InputSelect({
  label,
  items: data,
  fields,
  initialSelectedItem,
}: PropTypes) {
  const baseClass =
    "text-sm font-normal hover:cursor-pointer font-normal text-black dark:text-neutral-300";

  function getNameFilter(inputValue: string) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return function nameFilter(filterObject: { id: string; name: string }) {
      return (
        !inputValue ||
        filterObject.name.toLowerCase().includes(lowerCasedInputValue)
      );
    };
  }

  function ComboBox() {
    const [items, setItems] = React.useState(data);

    const fieldName = label.toLowerCase() + "Id"; // e.g. `regionId`

    const {
      isOpen,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      selectedItem,
    } = useCombobox({
      items,
      itemToString(item) {
        return item ? item.name : "";
      },
      onInputValueChange({ inputValue }) {
        setItems(items.filter(getNameFilter(inputValue)));
      },
      onStateChange() {
        // reset filter after user selects an entry
        !isOpen && setItems(data);
      },
      initialSelectedItem, // full region object, comes as component prop
    });

    // floating-ui size() for responsive full-width list items
    const { refs, floatingStyles } = useFloating({
      whileElementsMounted: autoUpdate,
      middleware: [
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
            });
          },
        }),
      ],
    });

    return (
      <>
        <div className="py-2 space-y-5">
          {/* Grid */}
          <div className="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
            {/* Label Column*/}
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
              <label
                htmlFor="null"
                {...getLabelProps()}
                className={cn(
                  baseClass,
                  "sm:mt-2.5 inline-block font-normal text-gray-500 dark:text-neutral-500",
                )}
              >
                {label}
              </label>
            </div>
            {/* End Label Column*/}

            {/* Combo Column */}
            <div className="mt-0.5 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
              <div className="flex bg-white gap-0.5 border border-gray-200 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500  dark:focus-within:ring-1 dark:border-neutral-700 dark:text-neutral-300 dark:focus-within:ring-neutral-600 dark:bg-neutral-800">
                {/* User Input */}
                <input
                  placeholder="Select a region..."
                  className={cn(
                    baseClass,
                    "py-2 px-3 block w-full border-gray-200 rounded-lg placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600 border-none focus:ring-0",
                  )}
                  {...getInputProps()}
                />

                {/* Form Input */}
                <input type="hidden" name={fieldName} value={selectedItem ? selectedItem.id : ""} />

                {/* Dropdown Button */}
                <button
                  aria-label="toggle menu"
                  className="px-1 mt-1 mb-1 mr-1 text-gray-500 rounded-md dark:text-neutral-400 hover:bg-gray-100 hover:text-black dark:hover:bg-neutral-700 dark:hover:text-neutral-400"
                  type="button"
                  {...getToggleButtonProps()}
                >
                  {/* {isOpen ? <>&#8593;</> : <>&#8595;</>} */}
                  <IconChevronDown
                    className=""
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                  />
                </button>
              </div>

              <ul
                className={`p-1 mr-5 z-10 bg-white dark:bg-neutral-900 dark:border-neutral-800 border rounded-lg mt-2 max-h-80 overflow-auto ${
                  !(isOpen && items.length) && "hidden"
                }`}
                {...getMenuProps({}, { suppressRefError: true })}
                ref={refs.setFloating}
                style={floatingStyles}
              >
                {
                  //isOpen &&
                  items.map((item, index) => (
                    <li
                      className={cn(
                        baseClass,
                        highlightedIndex === index &&
                          baseClass &&
                          "bg-gray-100 dark:bg-neutral-800 rounded-md",
                        selectedItem === item &&
                          "bg-gray-100 dark:bg-neutral-800 rounded-md",
                        "py-2 px-3",
                      )}
                      key={item.id}
                      {...getItemProps({ item, index })}
                    >
                      <span>{item.name}</span>
                    </li>
                  ))
                }
              </ul>

              {/* Downshift refs */}
              <div ref={refs.setReference} />

              {/* Validation Error */}
              <div className="pt-1 text-red-700 text-xs" id="name-error">
                {fields[fieldName].errors}
              </div>
              {/* End Validation Error */}
            </div>
            {/* End Combo Column */}
          </div>
          {/* End Grid */}
        </div>
      </>
    );
  }

  return <ComboBox />;
}
