import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { name: '공지사항', path: '/notices' },
  { name: '질의응답', path: '/qa' },
  { name: '수강후기', path: '/reviews' },
];

export default function BoardTabs() {
  const location = useLocation();

  return (
    <div className="flex border-b border-gray-200 mb-8">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-6 py-3 text-sm transition-all ${
              isActive
                ? 'font-bold text-navy-950 border-b-2 border-navy-950'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
