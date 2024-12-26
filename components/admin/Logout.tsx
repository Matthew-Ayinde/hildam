import React from "react";

const LogoutButton = () => {
  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
