import { Package, LayoutDashboard, X, Boxes } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const base = "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors";

  const active = "bg-white/10 text-white";
  const inactive = "text-gray-300 hover:bg-white/5 hover:text-white";

  return (
    <>
      {/* Overlay Mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className='fixed inset-0 bg-black/40 z-40 md:hidden'
        />
      )}

      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-64 bg-[#0c0f3d] text-white p-4
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-xl font-bold'>Projedata | Industry Control</h1>

          <button onClick={() => setOpen(false)} className='md:hidden'>
            <X size={20} />
          </button>
        </div>

        <nav className='flex flex-col gap-2'>
          <NavLink
            to='/'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to='/products'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <Package size={18} />
            Products
          </NavLink>
          <NavLink
            to='/raw-materials'
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <Boxes size={18} />
            Raw Materials
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
