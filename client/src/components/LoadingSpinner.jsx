// LoadingSpinner.jsx
// Small reusable spinner shown while data is being fetched.

import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
