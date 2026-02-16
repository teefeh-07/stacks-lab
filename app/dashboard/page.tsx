export default function DashboardLayout({ children }) {
  return <div className="dashboard-layout">{children}</div>;
}

function Sidebar() {
  return <nav>Sidebar</nav>;
}

function MainContent() {
  return <main>Content</main>;
}

function MetricsGrid() {
  return <div className="grid">Metrics</div>;
}

function ActivityFeed() {
  return <div>Feed</div>;
}

function WalletStatus() {
  return <div>Status</div>;
}

