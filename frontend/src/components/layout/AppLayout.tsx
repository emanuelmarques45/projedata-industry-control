import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-100 overflow-hidden'>
      <Sidebar open={open} setOpen={setOpen} />

      <div className='flex-1 flex flex-col'>
        <Header setOpen={setOpen} />
        <main className='flex-1 p-6 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
