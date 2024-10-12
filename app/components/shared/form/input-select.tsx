import { type FormMetadata } from "@conform-to/react";
import { autoUpdate, size, useFloating } from "@floating-ui/react-dom";
import { useCombobox } from "downshift";
import React from "react";
import { tv } from "tailwind-variants";

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
  initialSelectedItem
}: PropTypes) {
  const twBase = tv({
    base: "text-sm font-normal text-black hover:cursor-pointer dark:text-neutral-300"
  });

  const twLabel = tv({
    extend: twBase,
    base: "inline-block text-gray-500 sm:mt-2.5 dark:text-neutral-500"
  });

  const twInput = tv({
    extend: twBase,
    base: "block w-full rounded-lg border-none border-gray-200 px-3 py-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-0 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
  });

  const twListItem = tv({
    extend: twBase,
    base: "rounded-md px-3 py-2",
    variants: {
      state: {
        hover: "bg-gray-100 dark:bg-neutral-800",
        selected: "bg-gray-100 dark:bg-neutral-800"
      }
    }
  });

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
      selectedItem
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
      initialSelectedItem // full region object, comes as component prop
    });

    // floating-ui size() for responsive full-width list items
    const { refs, floatingStyles } = useFloating({
      whileElementsMounted: autoUpdate,
      middleware: [
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`
            });
          }
        })
      ]
    });

    return (
      <>
        <div className="space-y-5 py-2">
          {/* Grid */}
          <div className="grid gap-y-1.5 sm:grid-cols-12 sm:gap-x-5 sm:gap-y-0">
            {/* Label Column*/}
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1">
              <label htmlFor="null" className={twLabel()} {...getLabelProps()}>
                {label}
              </label>
            </div>
            {/* End Label Column*/}

            {/* Combo Column */}
            <div className="mt-0.5 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-11">
              <div className="flex gap-0.5 rounded-lg border border-gray-200 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500  dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:focus-within:ring-1 dark:focus-within:ring-neutral-600">
                {/* User Input */}
                <input
                  placeholder="Select a region..."
                  className={twInput()}
                  {...getInputProps()}
                />

                {/* Form Input */}
                <input
                  type="hidden"
                  name={fieldName}
                  value={selectedItem ? selectedItem.id : ""}
                />

                {/* Dropdown Button */}
                <button
                  aria-label="toggle menu"
                  className="my-1 mr-1 rounded-md px-1 text-gray-500 hover:bg-gray-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-400"
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
                className={`z-10 mr-5 mt-2 max-h-80 overflow-auto rounded-lg border bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900 ${
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
                        twListItem(),
                        highlightedIndex === index &&
                          twListItem({ state: "hover" }),
                        selectedItem === item &&
                          twListItem({ state: "selected" })
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
              <div className="pt-1 text-xs text-red-700" id="name-error">
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
