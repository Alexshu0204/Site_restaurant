import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import MyButton from '../components/MyButton';
import SectionText from '../components/SectionText';
import MenuCategoryTabs from '../components/menu/MenuCategoryTabs';
import MenuItemCard from '../components/menu/MenuItemCard';
import api from '../lib/api';
import type { Category } from '../types/menu';

interface MenuGroup {
  key: string;
  title: string;
  description: string;
  categoryNames: string[];
}

const menuGroups: MenuGroup[] = [
  {
    key: 'notre-carte',
    title: 'NOTRE CARTE',
    description:
      "Les incontournables de la maison, dans l'esprit de la carte actuelle du Général.",
    categoryNames: [
      'COMPTOIRE DE LA MER',
      'VIANDES',
      'ENTRÉES',
      'SALADES',
      'BURGERS',
      'PÂTES & RISOTTO',
      'NOTRE CRÉATION VÉGÉTARIENNE',
      'POISSONS',
      'FROMAGES',
      'LES CROQUES',
      'LES PLANCHES',
      'FINGER FOOD',
      'DESSERTS',
      'GLACES & SORBETS',
    ],
  },
  {
    key: 'menu-petit-dejeuner',
    title: 'MENU PETIT-DÉJEUNER',
    description:
      'Une lecture plus simple et plus rapide des formules et options du matin.',
    categoryNames: ['PETITS DÉJEUNERS', 'PETITS DÉJEUNERS À LA CARTE'],
  },
  {
    key: 'formule-dejeuner',
    title: 'FORMULE DÉJEUNER',
    description:
      'Du lundi au vendredi, hors jour fériés, de 11h à 15h',
    categoryNames: ['FORMULES DÉJEUNER', 'PLATS'],
  },
  {
    key: 'nos-boissons',
    title: 'NOS BOISSONS',
    description:
      'Vins, cocktails, softs et boissons chaudes regroupés dans une seule navigation.',
    categoryNames: [
      'CHAMPAGNES',
      'EAUX',
      'APÉRITIFS',
      'BIÈRES PRESSIONS',
      'BIÈRES BOUTEILLES',
      'SODA',
      'THÉS GLACÉS MAISON',
      'LES FRUITS PRESSES ET DRINKS VITAMINEES FAITS MINUTE',
      'LES CLASSIQUES',
      'LES INCONTOURNABLES',
      'LES SIGNATURES',
      'LES SANS ALCOOLS',
      'BLANCS',
      'ROSÉS',
      'ROUGES',
      'BOISSONS CHAUDES',
    ],
  },
  {
    key: 'happy-hour',
    title: 'HAPPY HOUR',
    description:
      'de 17h à 21h',
    categoryNames: ['HAPPY HOUR'],
  },
];

function createSectionId(categoryName: string) {
  const withoutAccents = categoryName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const inLowerCase = withoutAccents.toLowerCase();
  const withReadableWords = inLowerCase.replace(/&/g, 'et');
  const withDashes = withReadableWords.replace(/[^a-z0-9]+/g, '-');

  return withDashes.replace(/^-+|-+$/g, '');
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await api.get<Category[]>('/categories');
        const visibleCategories = response.data
          .map((category) => ({
            ...category,
            menuItems: [...category.menuItems]
              .filter((item) => item.isAvailable)
              .sort((left, right) => left.id - right.id),
          }))
          .filter((category) => category.menuItems.length > 0);

        setCategories(visibleCategories);
        setActiveCategoryId(visibleCategories[0]?.id ?? null);
      } catch {
        setErrorMessage('Impossible de charger la carte pour le moment.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadCategories();
  }, []);

  const menus = useMemo(
    () =>
      menuGroups.map((menuGroup) => ({
        ...menuGroup,
        categories: categories.filter((category) =>
          menuGroup.categoryNames.includes(category.name),
        ),
      })),
    [categories],
  );

  const activeMenu = menus[activeMenuIndex] ?? menus[0];

  const categoryTabs = useMemo(
    () =>
      (activeMenu?.categories ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        slug: createSectionId(category.name),
      })),
    [activeMenu],
  );

  useEffect(() => {
    if (!activeMenu) {
      setActiveCategoryId(null);
      return;
    }

    setActiveCategoryId(activeMenu.categories[0]?.id ?? null);
  }, [activeMenu]);

  // Intersection Observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible
        const mostVisibleEntry = entries.reduce((prev, current) => {
          return current.intersectionRatio > prev.intersectionRatio ? current : prev;
        }, entries[0]);

        if (mostVisibleEntry?.isIntersecting) {
          const sectionId = mostVisibleEntry.target.id;
          const category = activeMenu?.categories.find(
            (cat) => createSectionId(cat.name) === sectionId,
          );

          if (category) {
            setActiveCategoryId(category.id);
          }
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '-100px 0px -100px 0px', // Account for sticky tabs
      },
    );

    // Observe all category sections
    const sections = document.querySelectorAll('[data-category-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [activeMenu]);

  function handleCategorySelect(categoryId: number, slug: string) {
    setActiveCategoryId(categoryId);
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showPreviousMenu() {
    setActiveMenuIndex((currentIndex) =>
      currentIndex === 0 ? menus.length - 1 : currentIndex - 1,
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showNextMenu() {
    setActiveMenuIndex((currentIndex) =>
      currentIndex === menus.length - 1 ? 0 : currentIndex + 1,
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[#231f1d]">
      {/* ---------------------------------------HEADER--------------------------------------- */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      <SectionText
        title={
            <div className="flex items-center justify-center">
            <span className="border-b-2 border-white pb-2 text-3xl md:text-4xl">
              {activeMenu?.title ?? 'NOTRE CARTE'}
            </span>
          </div>
        }
        description={activeMenu?.description}
        className="px-0 pb-12 pt-40 md:pt-44"
        titleClassName="mb-6"
        descriptionClassName="max-w-3xl px-6 text-center text-stone-300 md:px-12"
      >
        <div className="mt-8 w-full">
          {!isLoading && !errorMessage ? (
            <div className="mb-8 flex items-center justify-center gap-4 px-6">
              <MyButton
                label="< Carte précédente"
                variant="white"
                rounded={true}
                onClick={showPreviousMenu}
                className="px-6 py-3 text-[10px] tracking-[0.2em] cursor-pointer"
              />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-stone-400">
                {activeMenuIndex + 1} / {menus.length}
              </span>
              <MyButton
                label="Carte suivante >"
                variant="white"
                rounded={true}
                onClick={showNextMenu}
                className="px-6 py-3 text-[10px] tracking-[0.2em] cursor-pointer"
              />
            </div>
          ) : null}

          {categoryTabs.length > 0 ? (
            <MenuCategoryTabs
              categories={categoryTabs}
              activeCategoryId={activeCategoryId}
              onSelect={handleCategorySelect}
            />
          ) : null}

          <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
            {isLoading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((placeholder) => (
                  <div
                    key={placeholder}
                    className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-100">
                {errorMessage}
              </div>
            ) : null}

            {!isLoading && !errorMessage && categories.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-6 text-center text-stone-300">
                La carte est en cours de préparation.
              </div>
            ) : null}

            {!isLoading && !errorMessage && activeMenu
              ? activeMenu.categories.map((category) => {
                  const slug = createSectionId(category.name);

                  return (
                    <section
                      key={category.id}
                      id={slug}
                      data-category-section
                      className="scroll-mt-40 py-10 first:pt-0 md:py-12"
                    >
                      <h2 className="mb-8 text-center font-mono text-2xl uppercase tracking-[0.28em] text-white md:text-3xl">
                        {category.name}
                      </h2>

                      <div className="space-y-4">
                        {category.menuItems.map((item) => (
                          <MenuItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  );
                })
              : null}
          </div>
        </div>
      </SectionText>
    </div>
  );
}
