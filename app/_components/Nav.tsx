"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "./StoreProvider";

const links = [
  { href: "/", label: "ダッシュボード" },
  { href: "/stats", label: "統計" },
  { href: "/history", label: "履歴" },
  { href: "/settings", label: "初期設定" },
];

export default function Nav() {
  const pathname = usePathname();
  const { openModal } = useStore();

  return (
    <nav className="bg-nord1 border-b border-nord3 px-4 py-3 flex items-center gap-6">
      <span className="text-nord8 font-bold text-lg mr-2">OW Logs</span>
      <div className="flex gap-5 flex-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium transition-colors ${
              pathname === href
                ? "text-nord8"
                : "text-nord4 hover:text-nord6"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <button
        onClick={openModal}
        className="bg-nord10 hover:bg-nord9 text-nord6 text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
      >
        + 試合を追加
      </button>
    </nav>
  );
}
