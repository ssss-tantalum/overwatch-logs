"use client";

import { useEffect, useState } from "react";
import { DIVISIONS, MAPS_BY_RULE, RULES, TIERS } from "../_lib/data";
import type { Division, Match, MatchResult, Rule, Tier } from "../_types";
import { useStore } from "./StoreProvider";

export default function MatchModal() {
  const {
    isModalOpen,
    closeModal,
    settings,
    matches,
    addMatch,
    editMatch,
    editingMatch,
  } = useStore();

  const isEditing = editingMatch !== null;
  const today = new Date().toISOString().split("T")[0];
  const lastRank =
    matches.length > 0 ? matches[0].rank : settings?.initialRank;

  const [date, setDate] = useState(today);
  const [rule, setRule] = useState<Rule>("Control");
  const [map, setMap] = useState(MAPS_BY_RULE["Control"][0]);
  const [result, setResult] = useState<MatchResult>("VICTORY");
  const [tier, setTier] = useState<Tier>(lastRank?.tier ?? "Gold");
  const [division, setDivision] = useState<Division>(lastRank?.division ?? 1);

  useEffect(() => {
    if (!isModalOpen) return;
    if (editingMatch) {
      setDate(editingMatch.date);
      setRule(editingMatch.rule);
      setMap(editingMatch.map);
      setResult(editingMatch.result);
      setTier(editingMatch.rank.tier);
      setDivision(editingMatch.rank.division);
    } else {
      const r =
        matches.length > 0 ? matches[0].rank : settings?.initialRank;
      setDate(new Date().toISOString().split("T")[0]);
      setRule("Control");
      setMap(MAPS_BY_RULE["Control"][0]);
      setResult("VICTORY");
      setTier(r?.tier ?? "Gold");
      setDivision(r?.division ?? 1);
    }
  }, [isModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEditing) setMap(MAPS_BY_RULE[rule]?.[0] ?? "");
  }, [rule]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isModalOpen) return null;

  const handleSubmit = () => {
    if (!settings) return;
    const match: Match = {
      id: editingMatch?.id ?? Date.now().toString(),
      date,
      season: editingMatch?.season ?? settings.season,
      rule,
      map,
      result,
      rank: { tier, division },
    };
    if (isEditing) {
      editMatch(match);
    } else {
      addMatch(match);
    }
    closeModal();
  };

  const inputCls =
    "w-full bg-nord2 border border-nord3 rounded-lg px-3 py-2 text-nord6 text-sm focus:outline-none focus:border-nord8";
  const labelCls = "block text-nord4 text-sm mb-1";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-nord1 rounded-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-nord6 font-semibold text-lg">
            {isEditing ? "試合を編集" : "試合を追加"}
          </h2>
          <button
            onClick={closeModal}
            className="text-nord4 hover:text-nord6 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className={labelCls}>シーズン</p>
            <p className="text-nord6 text-sm bg-nord2 border border-nord3 rounded-lg px-3 py-2">
              Season {editingMatch?.season ?? settings?.season ?? "-"}
            </p>
          </div>
          <div>
            <p className={labelCls}>ヒーロー</p>
            <p className="text-nord6 text-sm bg-nord2 border border-nord3 rounded-lg px-3 py-2 truncate">
              {settings?.hero ?? "-"}
            </p>
          </div>
        </div>

        <div>
          <label className={labelCls}>日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>ルール</label>
          <select
            value={rule}
            onChange={(e) => setRule(e.target.value as Rule)}
            className={inputCls}
          >
            {RULES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>マップ</label>
          <select
            value={map}
            onChange={(e) => setMap(e.target.value)}
            className={inputCls}
          >
            {MAPS_BY_RULE[rule]?.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>勝敗</label>
          <div className="flex gap-2">
            {(["VICTORY", "DEFEAT", "DRAW"] as MatchResult[]).map((r) => (
              <button
                key={r}
                onClick={() => setResult(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  result === r
                    ? r === "VICTORY"
                      ? "bg-nord14 text-nord0"
                      : r === "DEFEAT"
                        ? "bg-nord11 text-nord6"
                        : "bg-nord13 text-nord0"
                    : "bg-nord2 text-nord4 hover:text-nord6"
                }`}
              >
                {r === "VICTORY" ? "勝利" : r === "DEFEAT" ? "敗北" : "引き分け"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>マッチ終了時ランク</label>
          <div className="flex gap-2">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier)}
              className={inputCls}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={division}
              onChange={(e) =>
                setDivision(Number(e.target.value) as Division)
              }
              className="w-20 bg-nord2 border border-nord3 rounded-lg px-3 py-2 text-nord6 text-sm focus:outline-none focus:border-nord8 shrink-0"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!settings}
          className="w-full bg-nord10 hover:bg-nord9 disabled:opacity-50 text-nord6 font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          {isEditing ? "更新する" : "記録する"}
        </button>

        {!settings && (
          <p className="text-nord11 text-xs text-center">
            先に初期設定を完了してください。
          </p>
        )}
      </div>
    </div>
  );
}
