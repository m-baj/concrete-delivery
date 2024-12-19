import { Footer } from "@/components/footer";
import NavBar from "@/components/navBar";
import React from "react";

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col min-h-screen">
      {" "}
      {/* Flexbox na pełną wysokość */}
      <NavBar />
      <main className="flex-grow">{children}</main>{" "}
      {/* Rozciągająca się sekcja */}
      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
