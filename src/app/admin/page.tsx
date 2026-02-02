import Link from "next/link";
import {
  Trophy,
  Users,
  MapPin,
  Calendar,
  Newspaper,
  FileText,
} from "lucide-react";

const quickLinks = [
  { href: "/admin/seasons", label: "Seasons", icon: Trophy, description: "Manage league seasons" },
  { href: "/admin/teams", label: "Teams", icon: Users, description: "Add and edit teams" },
  { href: "/admin/locations", label: "Locations", icon: MapPin, description: "Manage venues" },
  { href: "/admin/matches", label: "Matches", icon: Calendar, description: "Schedule and score matches" },
  { href: "/admin/news", label: "News", icon: Newspaper, description: "Post announcements" },
  { href: "/admin/documents", label: "Documents", icon: FileText, description: "Upload league documents" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-500 mb-2">Admin Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome to the King Family Dart League admin portal.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6 hover:border-red-500 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <Icon className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-sm text-gray-400">{link.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Tips</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Create a season first, then add teams to that season</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Set up locations before scheduling matches</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Each match has 3 games - enter the games won by each team as the score</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Mark a season as &quot;Active&quot; to show it by default on the public site</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
