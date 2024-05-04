import Header from '#/components/header';
import Sidebar from '#/components/sidebar';

function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-auto">
        <div className="space-y-4 border-r bg-muted">
          <Sidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
