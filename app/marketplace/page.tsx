import { Marketplace } from '@/components/marketplace/marketplace-grid';
import { AuthGuard } from '@/components/auth-guard';

export default function MarketplacePage() {
    return (
        <AuthGuard>
            <div className="container py-8 space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Avatar Marketplace</h1>
                    <p className="text-muted-foreground">
                        Buy and sell unique Stacks Lab Avatars. Verified ownership on Bitcoin.
                    </p>
                </div>
                <Marketplace />
            </div>
        </AuthGuard>
    );
}
export default function MarketplacePage() {
  return <div>Marketplace</div>;
}

function SearchBar() {
  return <input type="search" />;
}

function FilterSidebar() {
  return <aside>Filters</aside>;
}

function ItemGrid() {
  return <div className="grid">Items</div>;
}

function SortControls() {
  return <select>Sort</select>;
}

