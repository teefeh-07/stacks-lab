export default function DashboardLayout({ children }) {
  return <div className="dashboard-layout">{children}</div>;
}

function Sidebar() {
  return <nav>Sidebar</nav>;
}

function MainContent() {
  return <main>Content</main>;
}

