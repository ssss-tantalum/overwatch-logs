"use client";

import { useEffect, useState } from "react";
import { useStore } from "../_components/StoreProvider";
import { DIVISIONS, HEROES, TIERS } from "../_lib/data";
import type { Division, Tier } from "../_types";

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();

  const [playerName, setPlayerName] = useState("");
  const [hero, setHero] = useState(HEROES[0]);
  const [season, setSeason] = useState(15);
  const [goalWins, setGoalWins] = useState(25);
  const [tier, setTier] = useState<Tier>("Gold");
  const [division, setDivision] = useState<Division>(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setPlayerName(settings.playerName);
    setHero(settings.hero);
    setSeason(settings.season);
    setGoalWins(settings.seasonGoalWins);
    setTier(settings.initialRank.tier);
    setDivision(settings.initialRank.division);
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      playerName,
      hero,
      season,
      seasonGoalWins: goalWins,
      initialRank: { tier, division },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    "w-full bg-nord2 border border-nord3 rounded-lg px-3 py-2 text-nord6 text-sm focus:outline-none focus:border-nord8";
  const labelCls = "block text-nord4 text-sm mb-1";

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-xl font-bold text-nord6">初期設定</h1>

      <div className="bg-nord1 rounded-xl p-5 space-y-4">
        <div>
          <label className={labelCls}>プレイヤー名</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className={inputCls}
            placeholder="BattleTag#1234"
          />
        </div>

        <div>
          <label className={labelCls}>使用ヒーロー</label>
          <select
            value={hero}
            onChange={(e) => setHero(e.target.value)}
            className={inputCls}
          >
            {HEROES.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>シーズン</label>
          <input
            type="number"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className={inputCls}
            min={1}
          />
        </div>

        <div>
          <label className={labelCls}>シーズン目標勝利数</label>
          <input
            type="number"
            value={goalWins}
            onChange={(e) => setGoalWins(Number(e.target.value))}
            className={inputCls}
            min={1}
          />
        </div>

        <div>
          <label className={labelCls}>初期ランク</label>
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
          onClick={handleSave}
          className="w-full bg-nord10 hover:bg-nord9 text-nord6 font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          {saved ? "保存しました ✓" : "保存する"}
        </button>
      </div>
    </div>
  );
}
