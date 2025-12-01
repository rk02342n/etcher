import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, User, Globe, Settings, LogOut, Search } from 'lucide-react';

/**
 * A reusable Dropdown component.
 * * Props:
 * - label: Text to display when nothing is selected (or as a label).
 * - options: Array of objects { label: string, value: any, icon?: ReactNode }.
 * - value: The currently selected value (controlled component).
 * - onChange: Callback function (value) => void.
 * - width: Optional CSS class for width (default: w-64).
 */

const Dropdown = ({ 
  label = "Select an option", 
  options = [], 
  value, 
  onChange,
  width = "w-64",
  fieldName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened and reset search when closed
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small timeout ensures the element is rendered before focusing
      setTimeout(() => searchInputRef.current.focus(), 50);
    } else if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Find the currently selected option object to display its label
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(fieldName, option.value); // pass field name from parent
    setIsOpen(false);
  };

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        // className={`
        //   relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left shadow-md 
        //   focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 
        //   focus-visible:ring-white/75 focus-visible:ring-offset-2 
        //   focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-200
        //   transition-all duration-200 ease-in-out
        //   ${isOpen ? 'ring-2 ring-indigo-500 border-transparent' : ''}
        // `}
      >
        <span className="block truncate text-gray-700 font-medium">
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span className="text-gray-400">{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-gray-400">{label}</span>
          )}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          
          {/* Search Input Sticky Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-500 text-center italic">
                No results found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={`${option.value}-${index}`}
                  onClick={() => handleSelect(option)}
                  className={`
                    relative cursor-pointer select-none py-2.5 pl-10 pr-4 
                    hover:bg-indigo-50 transition-colors duration-150
                    ${value === option.value ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}
                  `}
                >
                  <span className={`block truncate ${value === option.value ? 'font-semibold' : 'font-normal'}`}>
                    <div className="flex items-center gap-2">
                      {option.icon && <span className="text-gray-400 w-5 flex justify-center">{option.icon}</span>}
                      {option.label}
                    </div>
                  </span>
                  
                  {/* Checkmark for selected item */}
                  {value === option.value && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
