'use client';
import api from "@/lib/api";
import React, { useState, useRef, useEffect } from "react";

interface TrashType {
  id: string;
  name: string;
}

interface DropdownJenisSampahProps {
  selectedTrashes: string[];
  setSelectedTrashes: (values: string[]) => void;
}

const DropdownJenisSampah: React.FC<DropdownJenisSampahProps> = ({
  selectedTrashes,
  setSelectedTrashes,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<TrashType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await api.get("api/setor/trash-types");
        setDropdownOptions(response.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (id: string) => {
    if (selectedTrashes.includes(id)) {
      setSelectedTrashes(selectedTrashes.filter((trashId) => trashId !== id));
    } else {
      setSelectedTrashes([...selectedTrashes, id]);
    }
  };

  const selectedNames = dropdownOptions
    .filter((item) => selectedTrashes.includes(item.id))
    .map((item) => item.name)
    .join(", ") || "Pilih jenis sampah";

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-black">
        Jenis Sampah
      </label>
      <div
        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{ backgroundColor: "#569490", color: "white", cursor: "pointer" }}
      >
        {selectedNames}
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {dropdownOptions.map((item) => (
            <label
              key={item.id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTrashes.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
                className="mr-2"
              />
              {item.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownJenisSampah;
