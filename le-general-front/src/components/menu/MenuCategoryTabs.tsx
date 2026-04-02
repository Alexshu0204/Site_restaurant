import { useEffect, useState } from 'react';

interface MenuCategoryTabsProps {
  categories: Array<{ id: number; name: string; slug: string }>;
  activeCategoryId: number | null;
  onSelect: (categoryId: number, slug: string) => void;
}

export default function MenuCategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
}: MenuCategoryTabsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    function handleDrawerStateChange(event: Event) {
      const drawerEvent = event as CustomEvent<{ isOpen?: boolean }>;
      setIsDrawerOpen(Boolean(drawerEvent.detail?.isOpen));
    }

    window.addEventListener('drawer-state-change', handleDrawerStateChange);

    return () => {
      window.removeEventListener('drawer-state-change', handleDrawerStateChange);
    };
  }, []);

  return (
    // We use a sticky container to keep the tabs visible while scrolling
    <div
      className={[
        'sticky top-24 z-[60] border-y border-white/10 bg-[#231f1d]/95 backdrop-blur transition-opacity duration-200',
        isDrawerOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="overflow-x-auto">
        <div className="mx-auto flex w-max min-w-full gap-6 px-4 py-4 md:justify-center md:px-8">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelect(category.id, category.slug)}
                className={[
                  'shrink-0 border-b pb-2 font-mono text-xs uppercase tracking-[0.25em] transition-colors md:text-sm',
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-stone-400 hover:text-white',
                ].join(' ')}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
