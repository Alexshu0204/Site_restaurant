import type { MenuItem } from '../../types/menu';

interface MenuItemCardProps {
  item: MenuItem;
}

function formatPrice(priceInCents: number | null) {
  if (priceInCents === null) {
    return null;
  }

  return `${(priceInCents / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

function buildPriceRows(item: MenuItem) {
  const rows: Array<{ label: string | null; value: string }> = [];

  if (item.price !== null) {
    rows.push({ label: null, value: formatPrice(item.price)! });
  }

  if (item.priceGourmand !== null) {
    rows.push({ label: 'Gourmand', value: formatPrice(item.priceGourmand)! });
  }

  if (item.priceTresGourmand !== null) {
    rows.push({ label: 'Très gourmand', value: formatPrice(item.priceTresGourmand)! });
  }

  return rows;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const priceRows = buildPriceRows(item);

  return (
    <article className="rounded-xl border border-white/10 bg-[#2d2622] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.22)] md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-white md:text-base">
            {item.name}
          </h3>

          {item.description ? (
            <p className="mt-3 text-center text-sm leading-6 text-stone-300 md:max-w-[85%]">
              {item.description}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          {priceRows.map((row) => (
            <div key={`${item.id}-${row.label ?? 'standard'}"`} className="mb-1 last:mb-0">
              {row.label ? (
                <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">
                  {row.label}
                </p>
              ) : null}
              <p className="font-mono text-sm text-stone-100 md:text-base">{row.value}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
