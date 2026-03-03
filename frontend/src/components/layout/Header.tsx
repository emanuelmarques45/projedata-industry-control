import { Menu } from "lucide-react";

interface HeaderProps {
  setOpen: (value: boolean) => void;
}

export function Header({ setOpen }: HeaderProps) {
  return (
    <header className='h-16 bg-white border-b flex items-center justify-between px-6'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => setOpen(true)}
          className='md:hidden'
          aria-label='Open menu'
        >
          <Menu size={22} />
        </button>

        <h2 className='font-semibold text-lg'>Admin Panel</h2>
      </div>

      <div className='w-8 h-8 rounded-full bg-[#0c0f3d] text-white flex items-center justify-center text-sm'>
        A
      </div>
    </header>
  );
}
