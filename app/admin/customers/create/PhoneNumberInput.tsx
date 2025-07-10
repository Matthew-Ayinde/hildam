"use client"

import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface StyledPhoneInputProps {
  value: string
  onChange: (value: string) => void
}

const StyledPhoneInput = ({ value, onChange }: StyledPhoneInputProps) => {
  return (
    <div className="relative">
      <PhoneInput
        country="ng"
        enableSearch
        disableCountryCode={false}
        countryCodeEditable={false}
        value={value}
        onChange={onChange}
        containerClass="w-full"
        inputClass="!w-full !px-4 !py-3 !pl-16 !rounded-xl !border !border-gray-200 !bg-gray-50 focus:!border-[#ff6c2f] focus:!ring-2 focus:!ring-orange-100 focus:!bg-white !transition-all !duration-200 !text-gray-900 !font-normal !text-base !h-auto !outline-none"
        buttonClass="!absolute !left-0 !top-0 !h-full !bg-gray-50 !border-r !border-gray-200 !rounded-l-xl !pl-3 !pr-2 !border-t !border-b !border-l focus:!border-[#ff6c2f]"
        dropdownClass="!bg-white !border !border-gray-200 !rounded-xl !shadow-lg !z-50"
        searchClass="!px-3 !py-2 !border-b !border-gray-200"
        containerStyle={{
          width: "100%",
        }}
        inputStyle={{
          width: "100%",
          paddingLeft: "64px",
          paddingRight: "16px",
          paddingTop: "12px",
          paddingBottom: "12px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          fontSize: "16px",
          fontWeight: "400",
          color: "#111827",
          outline: "none",
          transition: "all 0.2s ease",
        }}
        buttonStyle={{
          position: "absolute",
          left: "0",
          top: "0",
          height: "100%",
          backgroundColor: "#f9fafb",
          borderRight: "1px solid #e5e7eb",
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          borderLeft: "1px solid #e5e7eb",
          paddingLeft: "12px",
          paddingRight: "8px",
        }}
        dropdownStyle={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          zIndex: 50,
        }}
      />

      {/* Custom CSS to override any remaining styles */}
      <style jsx>{`
        :global(.react-tel-input .form-control:focus) {
          border-color: #ff6c2f !important;
          box-shadow: 0 0 0 2px rgba(255, 108, 47, 0.1) !important;
          background-color: white !important;
        }
        
        :global(.react-tel-input .flag-dropdown:focus) {
          border-color: #ff6c2f !important;
        }
        
        :global(.react-tel-input .flag-dropdown.open) {
          border-color: #ff6c2f !important;
        }
        
        :global(.react-tel-input .form-control) {
          height: auto !important;
          line-height: 1.5 !important;
        }
        
        :global(.react-tel-input .flag-dropdown) {
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
      `}</style>
    </div>
  )
}

export default StyledPhoneInput
