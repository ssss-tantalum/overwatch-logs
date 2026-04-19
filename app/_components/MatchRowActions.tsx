"use client";

import { useState } from "react";
import type { Match } from "../_types";
import { useStore } from "./StoreProvider";

export function MatchRowActions({ match }: { match: Match }) {
  const { openModal, deleteMatch } = useStore();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => deleteMatch(match.id)}
          className="text-xs text-nord11 hover:text-nord6 bg-nord11/20 hover:bg-nord11 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          削除確認
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-nord4 hover:text-nord6 px-2 py-1 rounded transition-colors cursor-pointer"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => openModal(match)}
        className="text-xs text-nord4 hover:text-nord8 px-2 py-1 rounded transition-colors cursor-pointer"
      >
        編集
      </button>
      <button
        onClick={() => setConfirming(true)}
        className="text-xs text-nord4 hover:text-nord11 px-2 py-1 rounded transition-colors cursor-pointer"
      >
        削除
      </button>
    </div>
  );
}
