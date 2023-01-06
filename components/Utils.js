import { useState } from "react";

export const Title = ({ children, decoration, ...props }) => {
  return (
    <div
      className={"text-lg font-medium text-gray-700 mb-3 " + decoration}
      {...props}
    >
      {children}
    </div>
  );
};

export const CheckBox = ({ checked = false, ...props }) => {
  const [checkState, setCheckState] = useState(checked);

  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        className="mr-2 h-4 w-4 col-span-1"
        checked={checkState}
        onChange={(e) => {
          setCheckState(e.target.checked);
        }}
      />
      <div
        className={
          checkState === true
            ? "text-gray-700 col-span-4 line-through decoration-blue-500"
            : "text-gray-700 col-span-4"
        }
      >
        {props.label}
      </div>
    </div>
  );
};
