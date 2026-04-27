import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, Calendar, Flame, Eye, Heart, MessageCircle, Share2, BarChart3, Clock, Zap, Target, Copy, Check, ChevronRight, Play, Edit3, Sparkles, AlertCircle, Filter, Plus, RefreshCw, Award, Users, Brain, Lightbulb, Hash, Volume2, Save, Database, ClipboardCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function MattLoeberCommandTerminal() {
  const [activeModule, setActiveModule] = useState('overview');
  const [time, setTime] = useState(new Date());
  const [copiedId, setCopiedId] = useState(null);
  const [selectedScript, setSelectedScript] = useState(null);
  const [scriptFilter, setScriptFilter] = useState('all');

  // ============ PERSISTENT STORAGE LAYER ============
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageMode, setStorageMode] = useState('checking'); // checking, persistent, session
  const [currentReport, setCurrentReport] = useState(null);
  const [savingState, setSavingState] = useState('idle'); // idle, saving, saved, error

  // Load existing reports on mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        if (typeof window !== 'undefined' && window.storage) {
          const result = await window.storage.get('weekly_reports');
          if (result && result.value) {
            const parsed = typeof result.value === 'string' ? JSON.parse(result.value) : result.value;
            setWeeklyReports(Array.isArray(parsed) ? parsed : []);
          }
          setStorageMode('persistent');
        } else {
          // Fallback to in-memory only (still works during session)
          setStorageMode('session');
        }
      } catch (e) {
        // Key doesn't exist yet or other error - start fresh
        setStorageMode(window.storage ? 'persistent' : 'session');
      }
      setStorageReady(true);
    };
    loadReports();
  }, []);

  const saveReports = async (reports) => {
    setSavingState('saving');
    try {
      if (typeof window !== 'undefined' && window.storage) {
        await window.storage.set('weekly_reports', JSON.stringify(reports));
      }
      setWeeklyReports(reports);
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2000);
    } catch (e) {
      setSavingState('error');
      setTimeout(() => setSavingState('idle'), 3000);
    }
  };

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ============ DATA LAYER ============

  const baseAccounts = [
    { platform: 'TIKTOK', handle: '@matt.loeber', color: '#ff2d55', priority: 'PRIMARY', url: 'https://www.tiktok.com/@matt.loeber', key: 'tiktok' },
    { platform: 'INSTAGRAM', handle: '@matt_loeber', color: '#e1306c', priority: 'PRIMARY', url: 'https://www.instagram.com/matt_loeber/', key: 'instagram' },
    { platform: 'YOUTUBE', handle: '@matt_loeber', color: '#ff0000', priority: 'GROWTH', url: 'https://www.youtube.com/@matt_loeber', key: 'youtube' },
    { platform: 'X', handle: '@matt_loeber', color: '#ffffff', priority: 'AUTHORITY', url: 'https://x.com/matt_loeber', key: 'x' }
  ];

  // Compute account stats from latest report
  const latestReport = weeklyReports.length > 0 ? weeklyReports[weeklyReports.length - 1] : null;
  const previousReport = weeklyReports.length > 1 ? weeklyReports[weeklyReports.length - 2] : null;

  const accounts = baseAccounts.map(acc => {
    const current = latestReport?.platforms?.[acc.key]?.followers ?? null;
    const previous = previousReport?.platforms?.[acc.key]?.followers ?? null;
    let growth = '+0.0%';
    let growthRaw = 0;
    if (current !== null && previous !== null && previous > 0) {
      growthRaw = ((current - previous) / previous) * 100;
      growth = `${growthRaw >= 0 ? '+' : ''}${growthRaw.toFixed(1)}%`;
    }
    return {
      ...acc,
      followers: current !== null ? current.toLocaleString() : 'NO DATA',
      growth,
      growthRaw
    };
  });

  const viralScripts = [
    {
      id: 'vs01',
      hook: 'Stop trading FVGs until you understand THIS',
      category: 'EDUCATION',
      pain: 'Traders losing on every FVG entry',
      duration: '45s',
      platforms: ['TIKTOK', 'REELS', 'SHORTS'],
      script: `[HOOK 0-3s] Stop trading fair value gaps until you understand this one thing.\n\n[PROBLEM 3-10s] 90% of traders enter every FVG they see and wonder why they keep getting stopped out.\n\n[REVEAL 10-25s] The FVG isn't your entry. It's your CONFIRMATION. You need three things first: a CISD on your higher timeframe, an SMT divergence between correlated pairs, and price delivering into external range liquidity.\n\n[PROOF 25-38s] Look at this entry from yesterday. Liquidity swept above asia high, SMT printed between ES and NQ, change in state of delivery on the 5m, then I waited for the IFVG on the 1m for entry. Risk 1, made 4.\n\n[CTA 38-45s] If you want the full breakdown, comment "DELIVERY" and I'll send it.`,
      hashtags: '#daytrading #ictconcepts #smartmoney #fvg #priceaction',
      hookScore: 94,
      bestTime: '6:30 AM EST'
    },
    {
      id: 'vs02',
      hook: 'I lost $40K before I learned this one chart',
      category: 'STORY',
      pain: 'Blown accounts, no direction',
      duration: '60s',
      platforms: ['REELS', 'TIKTOK'],
      script: `[HOOK 0-3s] I lost forty thousand dollars before I learned the one chart that changed everything.\n\n[CONTEXT 3-15s] I was trading every setup. Every FVG, every order block, every breaker. I thought more entries equals more money. I was wrong.\n\n[TURN 15-30s] Then I learned quarterly theory. The market doesn't move randomly. It delivers in 90 minute cycles, broken into 22.5 minute quarters. Accumulation, manipulation, distribution, reversal. AMDR.\n\n[LESSON 30-50s] Once I started timing my entries to the third quarter of the cycle, after manipulation, my win rate went from 38% to 71%. Same setups. Different timing.\n\n[CTA 50-60s] Drop a 90 in the comments if you want me to break down today's cycle.`,
      hashtags: '#tradingstory #quarterlytheory #ict #daytrader #forex',
      hookScore: 96,
      bestTime: '7:00 PM EST'
    },
    {
      id: 'vs03',
      hook: 'POV: You finally understood SMT divergence',
      category: 'POV',
      pain: 'Confusion around correlation',
      duration: '30s',
      platforms: ['TIKTOK', 'REELS', 'SHORTS'],
      script: `[HOOK 0-3s] POV: You finally understand SMT divergence.\n\n[VISUAL 3-15s] (Split screen of ES and NQ) ES makes a higher high. NQ fails to make a higher high. That's it. That's the divergence. Smart money is selling one and not the other.\n\n[PAYOFF 15-25s] When this prints at a key level, with a CISD confirming, you have one of the highest probability setups in the entire market.\n\n[CTA 25-30s] Save this. You'll need it tomorrow at 9:30.`,
      hashtags: '#smtdivergence #esnq #futurestrading #ict #smartmoney',
      hookScore: 91,
      bestTime: '8:00 AM EST'
    },
    {
      id: 'vs04',
      hook: 'Your trading is failing because of THIS',
      category: 'CONTRARIAN',
      pain: 'Stuck, plateaued, frustrated',
      duration: '45s',
      platforms: ['REELS', 'TIKTOK', 'SHORTS'],
      script: `[HOOK 0-3s] Your trading is failing and it's not for the reason you think.\n\n[MISCONCEPTION 3-12s] It's not your strategy. It's not your risk management. It's not even your psychology.\n\n[TRUTH 12-30s] It's that you don't respect time. You enter when you feel like it. You exit when emotions hit. The market delivers on a schedule. 9:30, 10:00, 10:30, 11:00. Every quarter is engineered.\n\n[REFRAME 30-40s] Stop trading setups. Start trading time. Watch what happens.\n\n[CTA 40-45s] Tap follow for one tip every morning at 9.`,
      hashtags: '#tradingpsychology #timecycles #daytrading #priceaction',
      hookScore: 89,
      bestTime: '9:00 AM EST'
    },
    {
      id: 'vs05',
      hook: 'Day in the life of a profitable trader',
      category: 'LIFESTYLE',
      pain: 'Wanting the lifestyle',
      duration: '60s',
      platforms: ['REELS', 'TIKTOK'],
      script: `[HOOK 0-3s] Day in the life of a trader who actually makes money.\n\n[5AM 3-10s] Up at 5. No alarm. Coffee, journal, review yesterday's deliveries.\n\n[6AM 10-20s] Mark up DXY, ES, NQ, YM. Identify the daily bias. Where's external liquidity? Where's the inefficiency?\n\n[9:30 20-35s] One trade. Maybe two. In and out before lunch. The amateurs are still scrolling indicators.\n\n[AFTER 35-50s] Gym. Real food. Build something. The trade is 5% of the day. The discipline is 95%.\n\n[CTA 50-60s] If you want the morning routine in detail, follow for tomorrow's drop.`,
      hashtags: '#traderlifestyle #dayinthelife #disciplineisfreedom #trading',
      hookScore: 92,
      bestTime: '6:00 PM EST'
    },
    {
      id: 'vs06',
      hook: '3 sentences that fixed my trading forever',
      category: 'LIST',
      pain: 'Information overload',
      duration: '30s',
      platforms: ['SHORTS', 'TIKTOK', 'REELS'],
      script: `[HOOK 0-3s] Three sentences that fixed my trading forever.\n\n[ONE 3-10s] One. Liquidity is always taken before reversal. Always.\n\n[TWO 10-17s] Two. The first move after open is a lie. The second move is the truth.\n\n[THREE 17-25s] Three. If you can't draw it on a 15 minute chart, you don't understand the trade.\n\n[CTA 25-30s] Screenshot this. Read it before every session.`,
      hashtags: '#tradingtips #daytrading #ictconcepts #priceaction #mindset',
      hookScore: 95,
      bestTime: '7:30 AM EST'
    },
    {
      id: 'vs07',
      hook: 'Watch me call this trade live',
      category: 'PROOF',
      pain: 'Not believing it works',
      duration: '60s',
      platforms: ['REELS', 'TIKTOK', 'YOUTUBE'],
      script: `[HOOK 0-3s] Watch me call this trade before it happens.\n\n[SETUP 3-20s] It's 9:28. ES swept asia high overnight. DXY made a lower low while ES made a higher high. That's bearish SMT. I'm waiting for the 9:30 manipulation to fail.\n\n[EXECUTION 20-40s] 9:32. We get the spike. Volume divergence. Change in state of delivery on the 1 minute. I'm short with stop above the high.\n\n[RESULT 40-55s] 9:47. Target one hit. 9:58. Target two. 1R risked. 3.4R returned. Time on trade: 26 minutes.\n\n[CTA 55-60s] This is what we do every day. Link in bio.`,
      hashtags: '#livetrading #escharts #futures #smartmoney #priceaction',
      hookScore: 97,
      bestTime: '10:30 AM EST'
    },
    {
      id: 'vs08',
      hook: 'The gym taught me how to trade',
      category: 'LIFESTYLE',
      pain: 'Discipline and consistency',
      duration: '45s',
      platforms: ['TIKTOK', 'REELS'],
      script: `[HOOK 0-3s] The gym taught me how to trade.\n\n[PARALLEL 3-25s] You don't see results in a day. You don't see results in a week. You show up, do the boring work, and one day you look up and you're a different person.\n\n[APPLY 25-38s] Trading is the same. One green day means nothing. One red day means nothing. 200 sessions of disciplined execution? That's a career.\n\n[CTA 38-45s] Stack the reps. Both places. I'll see you at 6 AM.`,
      hashtags: '#disciplineisfreedom #gymandtrading #consistency #mindset',
      hookScore: 88,
      bestTime: '5:30 AM EST'
    }
  ];

  const trendsRadar = [
    { trend: 'AMDR Cycle Breakdowns', heat: 96, direction: 'up', niche: 'ICT/Quarterly', volume: '12.4K posts/wk' },
    { trend: 'Live Trade Calls', heat: 94, direction: 'up', niche: 'Day Trading', volume: '8.7K posts/wk' },
    { trend: 'Lost Money Stories', heat: 91, direction: 'up', niche: 'Story', volume: '23K posts/wk' },
    { trend: 'Morning Routine POV', heat: 89, direction: 'up', niche: 'Lifestyle', volume: '45K posts/wk' },
    { trend: 'Indicator Hate', heat: 87, direction: 'up', niche: 'Contrarian', volume: '6.2K posts/wk' },
    { trend: '3-Sentence Wisdom', heat: 84, direction: 'up', niche: 'List', volume: '18K posts/wk' },
    { trend: 'Trader vs Normal Job', heat: 82, direction: 'flat', niche: 'Comparison', volume: '11K posts/wk' },
    { trend: 'Whiteboard Explanations', heat: 79, direction: 'up', niche: 'Education', volume: '4.1K posts/wk' },
    { trend: 'Gym + Trade Day', heat: 76, direction: 'up', niche: 'Lifestyle', volume: '9.3K posts/wk' },
    { trend: 'Funded Account Pain', heat: 73, direction: 'down', niche: 'Story', volume: '14K posts/wk' }
  ];

  const contentSchedule = [
    { day: 'MON', date: 'WK1', slots: [
      { time: '6:30 AM', platform: 'TIKTOK', type: 'EDUCATION', topic: 'Weekly bias breakdown — DXY/ES SMT setup', status: 'QUEUED' },
      { time: '12:00 PM', platform: 'INSTAGRAM', type: 'CARRY', topic: 'Repurpose AM education to Reels w/ chart overlay', status: 'QUEUED' },
      { time: '7:00 PM', platform: 'YOUTUBE', type: 'LONG', topic: 'Quarterly Theory deep dive (8-12 min)', status: 'DRAFT' },
      { time: '8:30 PM', platform: 'X', type: 'THREAD', topic: 'Recap thread: Monday\'s NY session deliveries', status: 'IDEA' }
    ]},
    { day: 'TUE', date: 'WK1', slots: [
      { time: '5:30 AM', platform: 'TIKTOK', type: 'LIFESTYLE', topic: 'Pre-market routine + gym', status: 'QUEUED' },
      { time: '10:30 AM', platform: 'INSTAGRAM', type: 'PROOF', topic: 'Live trade documentation (story → reel)', status: 'PENDING' },
      { time: '6:00 PM', platform: 'TIKTOK', type: 'STORY', topic: 'Lost money lesson — the FVG mistake', status: 'QUEUED' },
      { time: '9:00 PM', platform: 'X', type: 'POST', topic: 'Single insight post — IRL vs ERL', status: 'IDEA' }
    ]},
    { day: 'WED', date: 'WK1', slots: [
      { time: '7:00 AM', platform: 'TIKTOK', type: 'CONTRARIAN', topic: 'Why your indicators are lying to you', status: 'QUEUED' },
      { time: '12:30 PM', platform: 'INSTAGRAM', type: 'CARROUSEL', topic: 'CISD vs TCISD — visual breakdown', status: 'DRAFT' },
      { time: '6:00 PM', platform: 'YOUTUBE', type: 'SHORT', topic: 'IFVG entry walkthrough (60s)', status: 'QUEUED' },
      { time: '10:00 PM', platform: 'X', type: 'POST', topic: 'Tomorrow bias post', status: 'IDEA' }
    ]},
    { day: 'THU', date: 'WK1', slots: [
      { time: '6:00 AM', platform: 'TIKTOK', type: 'POV', topic: 'POV: You finally understood SMT', status: 'QUEUED' },
      { time: '11:00 AM', platform: 'INSTAGRAM', type: 'REEL', topic: 'Order blocks vs Breaker blocks', status: 'DRAFT' },
      { time: '7:30 PM', platform: 'TIKTOK', type: 'LIST', topic: '3 sentences that fixed my trading', status: 'QUEUED' },
      { time: '9:00 PM', platform: 'X', type: 'THREAD', topic: 'Weekly recap thread', status: 'IDEA' }
    ]},
    { day: 'FRI', date: 'WK1', slots: [
      { time: '6:30 AM', platform: 'TIKTOK', type: 'EDUCATION', topic: 'Friday liquidity grab patterns', status: 'QUEUED' },
      { time: '1:00 PM', platform: 'INSTAGRAM', type: 'STORY', topic: 'Behind the scenes of a trade', status: 'PENDING' },
      { time: '6:00 PM', platform: 'YOUTUBE', type: 'LONG', topic: 'Week in review + setups for next week', status: 'DRAFT' },
      { time: '8:00 PM', platform: 'X', type: 'POST', topic: 'Friday wisdom post', status: 'IDEA' }
    ]},
    { day: 'SAT', date: 'WK1', slots: [
      { time: '9:00 AM', platform: 'INSTAGRAM', type: 'LIFESTYLE', topic: 'Weekend gym + meal prep', status: 'QUEUED' },
      { time: '2:00 PM', platform: 'TIKTOK', type: 'STORY', topic: 'Trader transformation story', status: 'DRAFT' },
      { time: '7:00 PM', platform: 'YOUTUBE', type: 'SHORT', topic: 'Saturday mindset short', status: 'IDEA' }
    ]},
    { day: 'SUN', date: 'WK1', slots: [
      { time: '10:00 AM', platform: 'TIKTOK', type: 'EDUCATION', topic: 'Sunday prep — weekly markup walkthrough', status: 'QUEUED' },
      { time: '4:00 PM', platform: 'INSTAGRAM', type: 'CARROUSEL', topic: 'Week ahead: Key levels carousel', status: 'DRAFT' },
      { time: '8:00 PM', platform: 'X', type: 'THREAD', topic: 'Setup of the week thread', status: 'IDEA' }
    ]}
  ];

  const tradeVisualPDFs = [
    { id: 'tv01', title: 'NQ — SMT Reversal w/ CISD Confirmation', date: '2025.04.22', rr: '4.2R', concepts: ['Sequential SMT', 'CISD', 'IFVG'], session: 'NY AM' },
    { id: 'tv02', title: 'ES — Quarterly Distribution Short', date: '2025.04.21', rr: '3.1R', concepts: ['Quarterly Theory', 'ERL Sweep', 'Order Block'], session: 'London Close' },
    { id: 'tv03', title: 'GU — TCISD After Correlation Break', date: '2025.04.20', rr: '5.7R', concepts: ['TCISD', 'Time Cycle Crack', 'Breaker Block'], session: 'London' },
    { id: 'tv04', title: 'NQ — IRL to ERL Delivery', date: '2025.04.19', rr: '2.8R', concepts: ['IRL/ERL', 'IFVG', 'Sequential SMT'], session: 'NY AM' },
    { id: 'tv05', title: 'ES — AMDR Full Cycle Trade', date: '2025.04.18', rr: '6.1R', concepts: ['Quarterly Theory', 'AMDR', 'CISD'], session: 'NY PM' }
  ];

  // Performance metrics now derive from latest report
  const performanceMetrics = useMemo(() => {
    if (!latestReport) {
      return [
        { metric: 'TOTAL FOLLOWERS', value: '—', delta: 'NO DATA · LOG WEEK 1', icon: Users },
        { metric: 'AVG ENGAGEMENT', value: '—', delta: 'NO DATA · LOG WEEK 1', icon: Heart },
        { metric: 'WEEKLY POSTS', value: '—', delta: 'NO DATA · LOG WEEK 1', icon: Activity },
        { metric: 'TOP POST REACH', value: '—', delta: 'NO DATA · LOG WEEK 1', icon: Eye }
      ];
    }
    const total = Object.values(latestReport.platforms || {}).reduce((sum, p) => sum + (Number(p.followers) || 0), 0);
    const prevTotal = previousReport
      ? Object.values(previousReport.platforms || {}).reduce((sum, p) => sum + (Number(p.followers) || 0), 0)
      : 0;
    const totalDelta = prevTotal > 0 ? ((total - prevTotal) / prevTotal * 100).toFixed(1) : '0.0';

    const avgEng = latestReport.avgEngagement || 0;
    const prevEng = previousReport?.avgEngagement || 0;
    const engDelta = prevEng > 0 ? (avgEng - prevEng).toFixed(2) : '0.00';

    const posts = latestReport.weeklyPosts || 0;
    const prevPosts = previousReport?.weeklyPosts || 0;
    const postDelta = posts - prevPosts;

    const topReach = latestReport.topPostReach || 0;
    const prevReach = previousReport?.topPostReach || 0;
    const reachDelta = prevReach > 0 ? (((topReach - prevReach) / prevReach) * 100).toFixed(0) : '0';

    return [
      { metric: 'TOTAL FOLLOWERS', value: total.toLocaleString(), delta: `${totalDelta >= 0 ? '+' : ''}${totalDelta}% WK/WK`, icon: Users, positive: parseFloat(totalDelta) >= 0 },
      { metric: 'AVG ENGAGEMENT', value: avgEng.toFixed(2) + '%', delta: `${engDelta >= 0 ? '+' : ''}${engDelta}pp WK/WK`, icon: Heart, positive: parseFloat(engDelta) >= 0 },
      { metric: 'WEEKLY POSTS', value: posts.toString(), delta: `${postDelta >= 0 ? '+' : ''}${postDelta} vs last wk`, icon: Activity, positive: postDelta >= 0 },
      { metric: 'TOP POST REACH', value: topReach >= 1000 ? `${(topReach/1000).toFixed(1)}K` : topReach.toString(), delta: `${reachDelta >= 0 ? '+' : ''}${reachDelta}% WK/WK`, icon: Eye, positive: parseFloat(reachDelta) >= 0 }
    ];
  }, [latestReport, previousReport]);

  const mentorTips = [
    { id: 'mt01', tier: 'CRITICAL', tip: 'Your hook is 80% of the algorithm. First 1.5 seconds must contain a pattern interrupt — a number, a contradiction, a "stop", a "POV", or visual motion that doesn\'t belong.', area: 'HOOKS' },
    { id: 'mt02', tier: 'HIGH', tip: 'Repurpose every TikTok to Reels and Shorts within 24 hours. Same hook, same delivery, vertical 9:16. Watermarks reduce distribution — re-export clean from CapCut.', area: 'DISTRIBUTION' },
    { id: 'mt03', tier: 'HIGH', tip: 'Trading is a credibility niche. Show real PnL screenshots watermarked with your handle. Anonymized broker statements work even better than charts.', area: 'TRUST' },
    { id: 'mt04', tier: 'MEDIUM', tip: 'Lifestyle content should be 1 in every 5 posts. Pure trading 3 in 5. Gym/health 1 in 5. This ratio compounds — pure trading accounts plateau, lifestyle adds parasocial bond.', area: 'CONTENT MIX' },
    { id: 'mt05', tier: 'HIGH', tip: 'YouTube is your authority moat. Long-form (8-15 min) on Quarterly Theory, SMT, and CISD will rank in search and feed leads to your other platforms forever.', area: 'PLATFORM STRATEGY' },
    { id: 'mt06', tier: 'CRITICAL', tip: 'Comments are the conversion layer. Reply to every comment in the first 60 minutes. The algorithm rewards reply velocity more than reply count.', area: 'ENGAGEMENT' },
    { id: 'mt07', tier: 'MEDIUM', tip: 'Build a content series with a name. "Morning Markup", "Delivery Diary", "60-Second Setup". Series create return viewers — random posts create random viewers.', area: 'BRAND' },
    { id: 'mt08', tier: 'HIGH', tip: 'Post your educational content right BEFORE market open (8:30-9:25 AM EST). Traders are scrolling, primed for information, and ready to save your content for later application.', area: 'TIMING' }
  ];

  const filteredScripts = scriptFilter === 'all' ? viralScripts : viralScripts.filter(s => s.category === scriptFilter);

  const copyScript = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatTime = (d) => d.toTimeString().slice(0, 8);
  const formatDate = (d) => d.toISOString().slice(0, 10).replace(/-/g, '.');

  // ============ STYLE TOKENS ============

  const colors = {
    bg: '#0a0e0d',
    panel: '#0f1413',
    panelHi: '#141a19',
    border: '#1f2826',
    borderHi: '#2a3633',
    text: '#d4dcd8',
    textDim: '#6b7873',
    textMute: '#3d4744',
    green: '#00ff9f',
    greenDim: '#00b873',
    red: '#ff3d5a',
    amber: '#ffaa00',
    cyan: '#00d4ff',
    magenta: '#ff00aa'
  };

  const monoFont = '"JetBrains Mono", "Fira Code", "Courier New", monospace';
  const displayFont = '"Space Mono", "JetBrains Mono", monospace';

  // ============ SUBCOMPONENTS ============

  const Header = () => (
    <div style={{
      borderBottom: `1px solid ${colors.border}`,
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: colors.panel,
      fontFamily: monoFont
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: colors.green, boxShadow: `0 0 10px ${colors.green}`,
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ color: colors.green, fontSize: '11px', letterSpacing: '0.15em', fontWeight: 700 }}>
            LOEBER//TERMINAL
          </span>
        </div>
        <span style={{ color: colors.textMute, fontSize: '10px', letterSpacing: '0.2em' }}>
          v2.0 · SOCIAL OPS
        </span>
        <span style={{
          color: storageMode === 'persistent' ? colors.green : colors.amber,
          fontSize: '9px', letterSpacing: '0.15em',
          background: colors.bg, padding: '3px 8px',
          border: `1px solid ${storageMode === 'persistent' ? colors.green : colors.amber}33`
        }}>
          <Database size={9} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          {storageMode === 'persistent' ? 'PERSISTENT STORAGE' : storageMode === 'session' ? 'SESSION STORAGE' : 'INITIALIZING...'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '24px', fontSize: '10px', color: colors.textDim, letterSpacing: '0.1em' }}>
        <span>SESSION: <span style={{ color: colors.green }}>LIVE</span></span>
        <span>{formatDate(time)}</span>
        <span style={{ color: colors.text }}>{formatTime(time)} EST</span>
      </div>
    </div>
  );

  const Nav = () => {
    const items = [
      { id: 'overview', label: 'OVERVIEW', icon: Activity },
      { id: 'review', label: 'SUNDAY REVIEW', icon: ClipboardCheck },
      { id: 'history', label: 'HISTORY', icon: Database },
      { id: 'scripts', label: 'SCRIPTS', icon: Edit3 },
      { id: 'schedule', label: 'SCHEDULE', icon: Calendar },
      { id: 'trends', label: 'TRENDS', icon: Flame },
      { id: 'pdfs', label: 'TRADE PDFs', icon: BarChart3 },
      { id: 'mentor', label: 'MENTOR AI', icon: Brain }
    ];
    return (
      <div style={{
        borderBottom: `1px solid ${colors.border}`,
        background: colors.bg,
        display: 'flex',
        fontFamily: monoFont,
        overflowX: 'auto'
      }}>
        {items.map(item => {
          const Icon = item.icon;
          const active = activeModule === item.id;
          const isReview = item.id === 'review';
          return (
            <button key={item.id} onClick={() => setActiveModule(item.id)}
              style={{
                background: active ? colors.panelHi : 'transparent',
                color: active ? colors.green : isReview ? colors.amber : colors.textDim,
                border: 'none',
                borderRight: `1px solid ${colors.border}`,
                borderBottom: active ? `2px solid ${colors.green}` : '2px solid transparent',
                padding: '14px 20px',
                fontSize: '10.5px',
                letterSpacing: '0.15em',
                fontFamily: monoFont,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
              <Icon size={13} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
        <div style={{ flex: 1, borderBottom: `1px solid ${colors.border}` }} />
      </div>
    );
  };

  const SectionLabel = ({ children, accent = colors.green }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      marginBottom: '14px', fontFamily: monoFont
    }}>
      <span style={{
        color: accent, fontSize: '10px', letterSpacing: '0.25em', fontWeight: 700
      }}>
        ▸ {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${accent}33, transparent)` }} />
    </div>
  );

  // ============ OVERVIEW MODULE ============

  const Overview = () => (
    <div style={{ padding: '24px', fontFamily: monoFont }}>
      {!latestReport && (
        <div style={{
          background: `${colors.amber}11`,
          border: `1px solid ${colors.amber}44`,
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <AlertTriangle size={18} color={colors.amber} />
          <div style={{ flex: 1 }}>
            <div style={{ color: colors.amber, fontSize: '11px', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '4px' }}>
              NO DATA YET — LOG YOUR FIRST WEEK
            </div>
            <div style={{ color: colors.text, fontSize: '11px' }}>
              Click <strong>SUNDAY REVIEW</strong> in the nav to enter your first week of Metricool numbers. Takes 5 minutes.
            </div>
          </div>
          <button onClick={() => setActiveModule('review')}
            style={{
              background: colors.amber, color: colors.bg, border: 'none',
              padding: '10px 18px', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 700,
              fontFamily: monoFont, cursor: 'pointer'
            }}>
            START REVIEW →
          </button>
        </div>
      )}

      <SectionLabel>ACCOUNT MATRIX</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {accounts.map((acc, i) => (
          <a key={i} href={acc.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              padding: '18px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = acc.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '3px', height: '100%',
                background: acc.color, boxShadow: `0 0 8px ${acc.color}66`
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: acc.color, fontSize: '11px', letterSpacing: '0.2em', fontWeight: 700 }}>
                  {acc.platform}
                </span>
                <span style={{ color: colors.textMute, fontSize: '9px', letterSpacing: '0.15em' }}>
                  {acc.priority}
                </span>
              </div>
              <div style={{ color: colors.text, fontSize: '13px', marginBottom: '4px' }}>{acc.handle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '12px' }}>
                <span style={{ color: colors.textDim, fontSize: '10px', letterSpacing: '0.1em' }}>FOLLOWERS</span>
                <span style={{ color: acc.followers === 'NO DATA' ? colors.textMute : colors.text, fontSize: '11px', fontFamily: displayFont, fontWeight: 700 }}>
                  {acc.followers}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                <span style={{ color: colors.textDim, fontSize: '10px', letterSpacing: '0.1em' }}>7D Δ</span>
                <span style={{
                  color: acc.growthRaw > 0 ? colors.green : acc.growthRaw < 0 ? colors.red : colors.textMute,
                  fontSize: '10px', fontWeight: 700
                }}>
                  {acc.growth}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <SectionLabel>PERFORMANCE TICKERS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {performanceMetrics.map((m, i) => {
          const Icon = m.icon;
          const positiveColor = m.positive === undefined ? colors.textMute : m.positive ? colors.green : colors.red;
          return (
            <div key={i} style={{
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ color: colors.textDim, fontSize: '10px', letterSpacing: '0.2em' }}>{m.metric}</span>
                <Icon size={14} color={colors.green} strokeWidth={1.5} />
              </div>
              <div style={{ color: m.value === '—' ? colors.textMute : colors.text, fontSize: '28px', fontFamily: displayFont, letterSpacing: '0.05em', marginBottom: '4px' }}>
                {m.value}
              </div>
              <div style={{ color: positiveColor, fontSize: '10px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {m.positive !== undefined && (m.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />)}
                {m.delta}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '20px' }}>
          <SectionLabel accent={colors.amber}>TODAY'S DIRECTIVE</SectionLabel>
          <div style={{ color: colors.text, fontSize: '12px', lineHeight: 1.7 }}>
            <div style={{ marginBottom: '14px', paddingLeft: '14px', borderLeft: `2px solid ${colors.green}` }}>
              <span style={{ color: colors.green, fontSize: '10px', letterSpacing: '0.15em' }}>06:30</span>
              <div>Post AM education clip — SMT setup of the day</div>
            </div>
            <div style={{ marginBottom: '14px', paddingLeft: '14px', borderLeft: `2px solid ${colors.amber}` }}>
              <span style={{ color: colors.amber, fontSize: '10px', letterSpacing: '0.15em' }}>10:30</span>
              <div>Capture live trade documentation for proof reel</div>
            </div>
            <div style={{ marginBottom: '14px', paddingLeft: '14px', borderLeft: `2px solid ${colors.cyan}` }}>
              <span style={{ color: colors.cyan, fontSize: '10px', letterSpacing: '0.15em' }}>13:00</span>
              <div>Repurpose AM clip → Reels + Shorts (vertical export)</div>
            </div>
            <div style={{ paddingLeft: '14px', borderLeft: `2px solid ${colors.magenta}` }}>
              <span style={{ color: colors.magenta, fontSize: '10px', letterSpacing: '0.15em' }}>19:00</span>
              <div>Lifestyle/recap post — gym → market wisdom parallel</div>
            </div>
          </div>
        </div>

        <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '20px' }}>
          <SectionLabel accent={colors.cyan}>CONTENT MIX TARGET</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {[
              { label: 'TRADING EDUCATION', pct: 60, color: colors.green },
              { label: 'LIFESTYLE / DAY', pct: 20, color: colors.cyan },
              { label: 'GYM / HEALTH', pct: 12, color: colors.amber },
              { label: 'COMMUNITY / Q&A', pct: 8, color: colors.magenta }
            ].map((m, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
                  <span style={{ color: colors.textDim, letterSpacing: '0.15em' }}>{m.label}</span>
                  <span style={{ color: m.color, fontWeight: 700 }}>{m.pct}%</span>
                </div>
                <div style={{ height: '6px', background: colors.bg, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    width: `${m.pct}%`, height: '100%',
                    background: m.color,
                    boxShadow: `0 0 6px ${m.color}88`
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel accent={colors.magenta}>BRAND POSITIONING THESIS</SectionLabel>
      <div style={{
        background: `linear-gradient(135deg, ${colors.panel} 0%, ${colors.panelHi} 100%)`,
        border: `1px solid ${colors.border}`,
        padding: '24px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, fontSize: '120px',
          fontFamily: displayFont, color: colors.borderHi, opacity: 0.5,
          lineHeight: 1, padding: '8px 16px', pointerEvents: 'none', userSelect: 'none'
        }}>
          ML
        </div>
        <div style={{ color: colors.green, fontSize: '11px', letterSpacing: '0.25em', marginBottom: '14px', fontWeight: 700 }}>
          THE LAST PLACE TRADERS NEED TO LEARN
        </div>
        <div style={{ color: colors.text, fontSize: '13px', lineHeight: 1.8, maxWidth: '720px', position: 'relative' }}>
          You are the bridge between ICT-style precision (SMT, CISD, IFVG, Quarterly Theory)
          and the lifestyle that proves it works. Your edge: most ICT educators are dry,
          chart-only, and intimidating. You translate institutional concepts into 30-second
          breakthroughs and back it with real PnL, real workouts, real life.
          <span style={{ color: colors.green }}> Education + Proof + Lifestyle = Conversion.</span>
        </div>
      </div>
    </div>
  );

  // ============ SUNDAY REVIEW MODULE ============

  const SundayReview = () => {
    const todayDate = new Date().toISOString().slice(0, 10);
    const initialForm = currentReport || {
      weekEnding: todayDate,
      platforms: {
        tiktok: { followers: '', topPostReach: '', topPostHook: '' },
        instagram: { followers: '', topPostReach: '', topPostHook: '' },
        youtube: { followers: '', topPostReach: '', topPostHook: '' },
        x: { followers: '', topPostReach: '', topPostHook: '' }
      },
      avgEngagement: '',
      weeklyPosts: '',
      topPostReach: '',
      topPostNotes: '',
      bottomPostNotes: '',
      whatWorked: '',
      whatDidnt: '',
      nextWeekFocus: '',
      bestPostTime: '',
      competitorWins: ''
    };
    const [form, setForm] = useState(initialForm);

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    const updatePlatform = (platform, field, value) => setForm(prev => ({
      ...prev,
      platforms: { ...prev.platforms, [platform]: { ...prev.platforms[platform], [field]: value } }
    }));

    const submitReport = async () => {
      // Convert string numbers to actual numbers
      const cleaned = {
        ...form,
        id: `wk_${Date.now()}`,
        savedAt: new Date().toISOString(),
        avgEngagement: parseFloat(form.avgEngagement) || 0,
        weeklyPosts: parseInt(form.weeklyPosts) || 0,
        topPostReach: parseInt(form.topPostReach) || 0,
        platforms: Object.fromEntries(
          Object.entries(form.platforms).map(([k, v]) => [k, {
            followers: parseInt(v.followers) || 0,
            topPostReach: parseInt(v.topPostReach) || 0,
            topPostHook: v.topPostHook || ''
          }])
        )
      };
      const updated = [...weeklyReports, cleaned];
      await saveReports(updated);
      // Reset form
      setForm(initialForm);
      setCurrentReport(null);
    };

    const Field = ({ label, value, onChange, placeholder, type = 'text', textarea = false, rows = 2, accent = colors.green }) => (
      <div style={{ marginBottom: '14px' }}>
        <div style={{ color: colors.textDim, fontSize: '9px', letterSpacing: '0.2em', marginBottom: '6px', fontWeight: 700 }}>
          ▸ {label}
        </div>
        {textarea ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
            style={{
              width: '100%', background: colors.bg, border: `1px solid ${colors.border}`,
              color: colors.text, padding: '10px 12px', fontFamily: monoFont, fontSize: '11px',
              resize: 'vertical', outline: 'none', borderRadius: 0, lineHeight: 1.6
            }}
            onFocus={e => e.target.style.borderColor = accent}
            onBlur={e => e.target.style.borderColor = colors.border}
          />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            style={{
              width: '100%', background: colors.bg, border: `1px solid ${colors.border}`,
              color: colors.text, padding: '10px 12px', fontFamily: monoFont, fontSize: '12px',
              outline: 'none', borderRadius: 0
            }}
            onFocus={e => e.target.style.borderColor = accent}
            onBlur={e => e.target.style.borderColor = colors.border}
          />
        )}
      </div>
    );

    return (
      <div style={{ padding: '24px', fontFamily: monoFont, maxWidth: '1400px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${colors.panel} 0%, ${colors.panelHi} 100%)`,
          border: `1px solid ${colors.border}`,
          padding: '24px',
          marginBottom: '24px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ color: colors.amber, fontSize: '10px', letterSpacing: '0.25em', marginBottom: '8px', fontWeight: 700 }}>
                ▸ WEEKLY METRICOOL DATA INTAKE
              </div>
              <div style={{ color: colors.text, fontSize: '20px', fontFamily: displayFont, marginBottom: '8px' }}>
                Sunday Review — Week of {form.weekEnding}
              </div>
              <div style={{ color: colors.textDim, fontSize: '11px', maxWidth: '720px', lineHeight: 1.7 }}>
                Open Metricool, copy your numbers below. Takes 5 minutes. Saves a permanent snapshot of your week so you can track real growth, not vibes. {weeklyReports.length} {weeklyReports.length === 1 ? 'week' : 'weeks'} logged.
              </div>
            </div>
            <button onClick={submitReport}
              disabled={savingState === 'saving'}
              style={{
                background: savingState === 'saved' ? colors.green : colors.amber,
                color: colors.bg, border: 'none',
                padding: '14px 22px', fontSize: '11px', letterSpacing: '0.2em', fontWeight: 700,
                fontFamily: monoFont, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                flexShrink: 0
              }}>
              {savingState === 'saving' ? <><RefreshCw size={13} className="spin" /> SAVING</> :
               savingState === 'saved' ? <><Check size={13} /> SAVED</> :
               <><Save size={13} /> SAVE WEEK</>}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* LEFT: Per-platform numbers */}
          <div>
            <SectionLabel accent={colors.cyan}>PLATFORM NUMBERS — FROM METRICOOL</SectionLabel>
            <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '18px', marginBottom: '14px' }}>
              <Field label="WEEK ENDING DATE" value={form.weekEnding} onChange={(v) => updateField('weekEnding', v)} type="date" accent={colors.cyan} />
            </div>

            {baseAccounts.map(acc => (
              <div key={acc.key} style={{
                background: colors.panel,
                border: `1px solid ${colors.border}`,
                borderLeft: `3px solid ${acc.color}`,
                padding: '18px',
                marginBottom: '12px'
              }}>
                <div style={{ color: acc.color, fontSize: '11px', letterSpacing: '0.25em', marginBottom: '12px', fontWeight: 700 }}>
                  {acc.platform} · {acc.handle}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="FOLLOWERS" value={form.platforms[acc.key].followers}
                    onChange={(v) => updatePlatform(acc.key, 'followers', v)}
                    placeholder="e.g. 1240" type="number" accent={acc.color} />
                  <Field label="TOP POST REACH" value={form.platforms[acc.key].topPostReach}
                    onChange={(v) => updatePlatform(acc.key, 'topPostReach', v)}
                    placeholder="e.g. 12500" type="number" accent={acc.color} />
                </div>
                <Field label="TOP POST HOOK / TOPIC" value={form.platforms[acc.key].topPostHook}
                  onChange={(v) => updatePlatform(acc.key, 'topPostHook', v)}
                  placeholder="What was the post about?" accent={acc.color} />
              </div>
            ))}
          </div>

          {/* RIGHT: Weekly synthesis */}
          <div>
            <SectionLabel accent={colors.amber}>WEEKLY SYNTHESIS</SectionLabel>

            <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '18px', marginBottom: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <Field label="WEEKLY POSTS" value={form.weeklyPosts} onChange={(v) => updateField('weeklyPosts', v)} placeholder="e.g. 14" type="number" accent={colors.amber} />
                <Field label="AVG ENGAGEMENT %" value={form.avgEngagement} onChange={(v) => updateField('avgEngagement', v)} placeholder="e.g. 4.2" type="number" accent={colors.amber} />
                <Field label="TOP REACH (ANY)" value={form.topPostReach} onChange={(v) => updateField('topPostReach', v)} placeholder="e.g. 18000" type="number" accent={colors.amber} />
              </div>
              <Field label="BEST POST TIME (FROM METRICOOL)" value={form.bestPostTime} onChange={(v) => updateField('bestPostTime', v)} placeholder="e.g. 7:00 AM EST" accent={colors.amber} />
            </div>

            <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '18px', marginBottom: '14px' }}>
              <Field label="TOP POST NOTES — WHY DID IT WORK?" value={form.topPostNotes} onChange={(v) => updateField('topPostNotes', v)} placeholder="e.g. Hook used 'stop' pattern, posted 6:30am, hit save rate 8%" textarea rows={3} accent={colors.green} />
              <Field label="BOTTOM POST NOTES — WHY DID IT FLOP?" value={form.bottomPostNotes} onChange={(v) => updateField('bottomPostNotes', v)} placeholder="e.g. Posted 11pm, weak hook, no visual punch" textarea rows={3} accent={colors.red} />
            </div>

            <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '18px', marginBottom: '14px' }}>
              <Field label="WHAT WORKED THIS WEEK?" value={form.whatWorked} onChange={(v) => updateField('whatWorked', v)} placeholder="Hook formulas, formats, topics that hit..." textarea rows={3} accent={colors.green} />
              <Field label="WHAT DIDN'T WORK?" value={form.whatDidnt} onChange={(v) => updateField('whatDidnt', v)} placeholder="What to cut, what to test differently..." textarea rows={3} accent={colors.red} />
            </div>

            <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '18px', marginBottom: '14px' }}>
              <Field label="COMPETITOR WINS — WHAT DID THEY POST THAT HIT?" value={form.competitorWins} onChange={(v) => updateField('competitorWins', v)} placeholder="Format / hook / topic to study" textarea rows={3} accent={colors.cyan} />
              <Field label="NEXT WEEK PRIMARY FOCUS" value={form.nextWeekFocus} onChange={(v) => updateField('nextWeekFocus', v)} placeholder="One thing to double down on next week" textarea rows={2} accent={colors.magenta} />
            </div>
          </div>
        </div>

        <div style={{
          background: `${colors.cyan}11`, border: `1px solid ${colors.cyan}33`,
          padding: '16px 20px', marginTop: '20px',
          display: 'flex', alignItems: 'flex-start', gap: '14px'
        }}>
          <Lightbulb size={18} color={colors.cyan} style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ color: colors.text, fontSize: '11px', lineHeight: 1.7 }}>
            <strong style={{ color: colors.cyan }}>WHERE TO FIND THESE NUMBERS IN METRICOOL:</strong> Followers per platform = Analytics → [Platform] → Overview. Top Post Reach = Analytics → [Platform] → Posts → sort by Reach. Avg Engagement = Analytics → [Platform] → top header KPIs. Best Post Time = Analytics → [Platform] → Best Time to Post (needs ~7 days of data first).
          </div>
        </div>
      </div>
    );
  };

  // ============ HISTORY MODULE ============

  const History = () => {
    const [selectedReportId, setSelectedReportId] = useState(null);
    const selected = weeklyReports.find(r => r.id === selectedReportId) || latestReport;

    const deleteReport = async (id) => {
      if (!confirm('Delete this week\'s report? This cannot be undone.')) return;
      const updated = weeklyReports.filter(r => r.id !== id);
      await saveReports(updated);
    };

    if (weeklyReports.length === 0) {
      return (
        <div style={{ padding: '24px', fontFamily: monoFont }}>
          <SectionLabel accent={colors.cyan}>HISTORICAL DATA</SectionLabel>
          <div style={{
            background: colors.panel, border: `1px solid ${colors.border}`,
            padding: '60px', textAlign: 'center'
          }}>
            <Database size={32} color={colors.textMute} strokeWidth={1} style={{ marginBottom: '14px' }} />
            <div style={{ color: colors.text, fontSize: '14px', fontFamily: displayFont, marginBottom: '8px' }}>
              No weekly reports yet
            </div>
            <div style={{ color: colors.textDim, fontSize: '11px', marginBottom: '20px' }}>
              Run your first Sunday Review to start building history.
            </div>
            <button onClick={() => setActiveModule('review')}
              style={{
                background: colors.amber, color: colors.bg, border: 'none',
                padding: '12px 24px', fontSize: '11px', letterSpacing: '0.2em', fontWeight: 700,
                fontFamily: monoFont, cursor: 'pointer'
              }}>
              GO TO SUNDAY REVIEW →
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '24px', fontFamily: monoFont, display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        <div>
          <SectionLabel accent={colors.cyan}>WEEK ARCHIVE</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[...weeklyReports].reverse().map((r, idx) => {
              const totalFollowers = Object.values(r.platforms || {}).reduce((sum, p) => sum + (Number(p.followers) || 0), 0);
              const isSelected = (selected?.id === r.id);
              return (
                <div key={r.id} onClick={() => setSelectedReportId(r.id)}
                  style={{
                    background: isSelected ? colors.panelHi : colors.panel,
                    border: `1px solid ${isSelected ? colors.cyan : colors.border}`,
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: colors.cyan, fontSize: '10px', letterSpacing: '0.2em', fontWeight: 700 }}>
                      WK · {r.weekEnding}
                    </span>
                    <span style={{ color: colors.textMute, fontSize: '9px' }}>
                      #{weeklyReports.length - idx}
                    </span>
                  </div>
                  <div style={{ color: colors.text, fontSize: '14px', fontFamily: displayFont, fontWeight: 700 }}>
                    {totalFollowers.toLocaleString()}
                  </div>
                  <div style={{ color: colors.textDim, fontSize: '9px', marginTop: '4px' }}>
                    TOTAL FOLLOWERS · {r.weeklyPosts || 0} POSTS
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {selected && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <SectionLabel accent={colors.green}>WEEK OF {selected.weekEnding}</SectionLabel>
                <button onClick={() => deleteReport(selected.id)}
                  style={{
                    background: 'transparent', color: colors.red,
                    border: `1px solid ${colors.red}44`,
                    padding: '6px 12px', fontSize: '9px', letterSpacing: '0.15em',
                    fontFamily: monoFont, fontWeight: 700, cursor: 'pointer'
                  }}>
                  DELETE
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {baseAccounts.map(acc => {
                  const data = selected.platforms?.[acc.key] || {};
                  return (
                    <div key={acc.key} style={{
                      background: colors.panel,
                      border: `1px solid ${colors.border}`,
                      borderLeft: `3px solid ${acc.color}`,
                      padding: '14px'
                    }}>
                      <div style={{ color: acc.color, fontSize: '9px', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: 700 }}>
                        {acc.platform}
                      </div>
                      <div style={{ color: colors.text, fontSize: '18px', fontFamily: displayFont, fontWeight: 700 }}>
                        {(data.followers || 0).toLocaleString()}
                      </div>
                      <div style={{ color: colors.textDim, fontSize: '9px', marginTop: '4px' }}>
                        FOLLOWERS
                      </div>
                      <div style={{ color: colors.amber, fontSize: '11px', fontFamily: displayFont, marginTop: '10px' }}>
                        {(data.topPostReach || 0).toLocaleString()}
                      </div>
                      <div style={{ color: colors.textDim, fontSize: '9px' }}>
                        TOP REACH
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '14px' }}>
                  <div style={{ color: colors.textDim, fontSize: '9px', letterSpacing: '0.2em', marginBottom: '6px' }}>WEEKLY POSTS</div>
                  <div style={{ color: colors.text, fontSize: '20px', fontFamily: displayFont, fontWeight: 700 }}>
                    {selected.weeklyPosts || 0}
                  </div>
                </div>
                <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '14px' }}>
                  <div style={{ color: colors.textDim, fontSize: '9px', letterSpacing: '0.2em', marginBottom: '6px' }}>AVG ENGAGEMENT</div>
                  <div style={{ color: colors.text, fontSize: '20px', fontFamily: displayFont, fontWeight: 700 }}>
                    {(selected.avgEngagement || 0).toFixed(2)}%
                  </div>
                </div>
                <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '14px' }}>
                  <div style={{ color: colors.textDim, fontSize: '9px', letterSpacing: '0.2em', marginBottom: '6px' }}>BEST POST TIME</div>
                  <div style={{ color: colors.amber, fontSize: '14px', fontFamily: displayFont, fontWeight: 700 }}>
                    {selected.bestPostTime || '—'}
                  </div>
                </div>
              </div>

              {[
                { label: 'WHAT WORKED', value: selected.whatWorked, accent: colors.green },
                { label: 'WHAT DIDN\'T WORK', value: selected.whatDidnt, accent: colors.red },
                { label: 'TOP POST NOTES', value: selected.topPostNotes, accent: colors.green },
                { label: 'COMPETITOR WINS', value: selected.competitorWins, accent: colors.cyan },
                { label: 'NEXT WEEK FOCUS', value: selected.nextWeekFocus, accent: colors.magenta }
              ].filter(s => s.value).map((s, i) => (
                <div key={i} style={{
                  background: colors.panel, border: `1px solid ${colors.border}`,
                  borderLeft: `3px solid ${s.accent}`, padding: '16px', marginBottom: '10px'
                }}>
                  <div style={{ color: s.accent, fontSize: '9px', letterSpacing: '0.25em', marginBottom: '8px', fontWeight: 700 }}>
                    ▸ {s.label}
                  </div>
                  <div style={{ color: colors.text, fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  // ============ SCRIPTS MODULE ============

  const Scripts = () => (
    <div style={{ padding: '24px', fontFamily: monoFont, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <SectionLabel>VIRAL SCRIPT LIBRARY</SectionLabel>
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {['all', 'EDUCATION', 'STORY', 'POV', 'CONTRARIAN', 'LIFESTYLE', 'LIST', 'PROOF'].map(c => (
            <button key={c} onClick={() => setScriptFilter(c)}
              style={{
                background: scriptFilter === c ? colors.green : 'transparent',
                color: scriptFilter === c ? colors.bg : colors.textDim,
                border: `1px solid ${scriptFilter === c ? colors.green : colors.border}`,
                padding: '6px 12px',
                fontSize: '9px',
                letterSpacing: '0.15em',
                fontFamily: monoFont,
                fontWeight: 700,
                cursor: 'pointer'
              }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '720px', overflowY: 'auto', paddingRight: '8px' }}>
          {filteredScripts.map(s => (
            <div key={s.id} onClick={() => setSelectedScript(s)}
              style={{
                background: selectedScript?.id === s.id ? colors.panelHi : colors.panel,
                border: `1px solid ${selectedScript?.id === s.id ? colors.green : colors.border}`,
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: colors.green, fontSize: '9px', letterSpacing: '0.2em', fontWeight: 700 }}>
                  {s.category}
                </span>
                <span style={{ color: colors.amber, fontSize: '10px', fontFamily: displayFont }}>
                  {s.hookScore}
                </span>
              </div>
              <div style={{ color: colors.text, fontSize: '12px', marginBottom: '10px', lineHeight: 1.4 }}>
                {s.hook}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: colors.textMute, fontSize: '9px', letterSpacing: '0.1em' }}>
                  {s.duration} · {s.platforms.join(' / ')}
                </span>
                <ChevronRight size={12} color={colors.textMute} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        padding: '24px',
        position: 'sticky',
        top: '20px',
        alignSelf: 'flex-start',
        maxHeight: 'calc(100vh - 180px)',
        overflowY: 'auto'
      }}>
        {selectedScript ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ color: colors.green, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '6px', fontWeight: 700 }}>
                  {selectedScript.category} · {selectedScript.duration} · HOOK SCORE {selectedScript.hookScore}
                </div>
                <div style={{ color: colors.text, fontSize: '17px', fontFamily: displayFont, lineHeight: 1.4 }}>
                  {selectedScript.hook}
                </div>
              </div>
              <button onClick={() => copyScript(selectedScript.id, selectedScript.script)}
                style={{
                  background: copiedId === selectedScript.id ? colors.green : 'transparent',
                  color: copiedId === selectedScript.id ? colors.bg : colors.green,
                  border: `1px solid ${colors.green}`,
                  padding: '6px 10px',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  fontFamily: monoFont,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0
                }}>
                {copiedId === selectedScript.id ? <Check size={11} /> : <Copy size={11} />}
                {copiedId === selectedScript.id ? 'COPIED' : 'COPY'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: colors.bg, padding: '12px', border: `1px solid ${colors.border}` }}>
                <div style={{ color: colors.textDim, fontSize: '9px', letterSpacing: '0.2em', marginBottom: '4px' }}>PAIN POINT</div>
                <div style={{ color: colors.text, fontSize: '11px' }}>{selectedScript.pain}</div>
              </div>
              <div style={{ background: colors.bg, padding: '12px', border: `1px solid ${colors.border}` }}>
                <div style={{ color: colors.textDim, fontSize: '9px', letterSpacing: '0.2em', marginBottom: '4px' }}>BEST POST TIME</div>
                <div style={{ color: colors.amber, fontSize: '11px' }}>{selectedScript.bestTime}</div>
              </div>
            </div>

            <div style={{ color: colors.green, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '10px', fontWeight: 700 }}>
              ▸ FULL SCRIPT
            </div>
            <pre style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              padding: '18px',
              color: colors.text,
              fontSize: '12px',
              lineHeight: 1.7,
              fontFamily: monoFont,
              whiteSpace: 'pre-wrap',
              margin: 0
            }}>
              {selectedScript.script}
            </pre>

            <div style={{ marginTop: '16px' }}>
              <div style={{ color: colors.green, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: 700 }}>
                ▸ HASHTAG STACK
              </div>
              <div style={{ color: colors.cyan, fontSize: '11px', fontFamily: monoFont, lineHeight: 1.6 }}>
                {selectedScript.hashtags}
              </div>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '400px', color: colors.textMute, gap: '16px'
          }}>
            <Edit3 size={32} strokeWidth={1} />
            <div style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
              SELECT A SCRIPT FROM LIBRARY
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ============ SCHEDULE MODULE ============

  const Schedule = () => {
    const statusColor = (s) => s === 'QUEUED' ? colors.green : s === 'DRAFT' ? colors.amber : s === 'PENDING' ? colors.cyan : colors.textMute;

    return (
      <div style={{ padding: '24px', fontFamily: monoFont }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <SectionLabel>WEEKLY CONTENT GRID — WK1</SectionLabel>
          <div style={{ display: 'flex', gap: '20px', fontSize: '9px', letterSpacing: '0.15em' }}>
            <span><span style={{ color: colors.green }}>■</span> <span style={{ color: colors.textDim }}>QUEUED</span></span>
            <span><span style={{ color: colors.amber }}>■</span> <span style={{ color: colors.textDim }}>DRAFT</span></span>
            <span><span style={{ color: colors.cyan }}>■</span> <span style={{ color: colors.textDim }}>PENDING</span></span>
            <span><span style={{ color: colors.textMute }}>■</span> <span style={{ color: colors.textDim }}>IDEA</span></span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {contentSchedule.map((day, i) => (
            <div key={i} style={{
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              minHeight: '500px'
            }}>
              <div style={{
                padding: '12px',
                borderBottom: `1px solid ${colors.border}`,
                background: colors.panelHi,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: colors.green, fontSize: '11px', letterSpacing: '0.2em', fontWeight: 700 }}>
                  {day.day}
                </span>
                <span style={{ color: colors.textMute, fontSize: '9px' }}>{day.slots.length} POSTS</span>
              </div>
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {day.slots.map((slot, j) => (
                  <div key={j} style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderLeft: `2px solid ${statusColor(slot.status)}`,
                    padding: '10px 8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: colors.amber, fontSize: '9px', fontFamily: displayFont }}>{slot.time}</span>
                      <span style={{ color: statusColor(slot.status), fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>
                        {slot.status}
                      </span>
                    </div>
                    <div style={{ color: colors.cyan, fontSize: '8.5px', letterSpacing: '0.15em', marginBottom: '4px', fontWeight: 700 }}>
                      {slot.platform} · {slot.type}
                    </div>
                    <div style={{ color: colors.text, fontSize: '10px', lineHeight: 1.4 }}>
                      {slot.topic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px' }}>
          <SectionLabel accent={colors.amber}>POSTING CADENCE PRINCIPLES</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { title: 'PRIMARY DROP', body: 'TikTok between 6:30–9:00 AM EST. Trader audience scrolls pre-market. Educational content peaks here.' },
              { title: 'CARRY WAVE', body: 'Repurpose to Reels/Shorts within 6 hours. Same hook, clean export, no watermarks.' },
              { title: 'AUTHORITY ANCHOR', body: 'YouTube long-form 2x/week (Mon + Fri). X recap threads daily after market close. Builds the moat.' }
            ].map((p, i) => (
              <div key={i} style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '18px' }}>
                <div style={{ color: colors.amber, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '10px', fontWeight: 700 }}>
                  ▸ {p.title}
                </div>
                <div style={{ color: colors.text, fontSize: '11px', lineHeight: 1.7 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============ TRENDS MODULE ============

  const Trends = () => (
    <div style={{ padding: '24px', fontFamily: monoFont }}>
      <SectionLabel>TREND HEAT RADAR — TRADING NICHE</SectionLabel>
      <div style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 90px 130px 130px 60px',
          padding: '12px 18px',
          borderBottom: `1px solid ${colors.border}`,
          background: colors.bg,
          fontSize: '9px',
          color: colors.textDim,
          letterSpacing: '0.2em',
          fontWeight: 700
        }}>
          <span>RANK</span>
          <span>TREND</span>
          <span>HEAT</span>
          <span>NICHE</span>
          <span>VOLUME</span>
          <span style={{ textAlign: 'right' }}>Δ</span>
        </div>
        {trendsRadar.map((t, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '50px 1fr 90px 130px 130px 60px',
            padding: '14px 18px',
            borderBottom: i < trendsRadar.length - 1 ? `1px solid ${colors.border}` : 'none',
            alignItems: 'center',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = colors.panelHi}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ color: colors.textMute, fontSize: '11px', fontFamily: displayFont }}>
              #{(i + 1).toString().padStart(2, '0')}
            </span>
            <span style={{ color: colors.text, fontSize: '12px' }}>{t.trend}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: t.heat > 90 ? colors.green : t.heat > 80 ? colors.amber : colors.textDim, fontSize: '12px', fontFamily: displayFont }}>
                {t.heat}
              </span>
              <div style={{ width: '40px', height: '3px', background: colors.bg, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${t.heat}%`,
                  background: t.heat > 90 ? colors.green : t.heat > 80 ? colors.amber : colors.textDim,
                  boxShadow: t.heat > 90 ? `0 0 6px ${colors.green}` : 'none'
                }} />
              </div>
            </div>
            <span style={{ color: colors.cyan, fontSize: '10px', letterSpacing: '0.1em' }}>{t.niche}</span>
            <span style={{ color: colors.textDim, fontSize: '10px' }}>{t.volume}</span>
            <span style={{ textAlign: 'right' }}>
              {t.direction === 'up' ? <TrendingUp size={14} color={colors.green} strokeWidth={2} /> :
               t.direction === 'down' ? <TrendingDown size={14} color={colors.red} strokeWidth={2} /> :
               <span style={{ color: colors.textMute }}>—</span>}
            </span>
          </div>
        ))}
      </div>

      <SectionLabel accent={colors.cyan}>TREND APPLICATION ENGINE</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '20px' }}>
          <div style={{ color: colors.cyan, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '12px', fontWeight: 700 }}>
            ▸ HIGH-OPPORTUNITY ANGLE
          </div>
          <div style={{ color: colors.text, fontSize: '12px', lineHeight: 1.7, marginBottom: '14px' }}>
            <strong style={{ color: colors.green }}>AMDR Cycle Breakdowns</strong> are heat-96 with only 12.4K weekly posts.
            That's a low-supply, high-demand window. Your Quarterly Theory expertise positions you uniquely.
          </div>
          <div style={{ background: colors.bg, padding: '12px', border: `1px solid ${colors.border}`, fontSize: '11px', color: colors.text, lineHeight: 1.6 }}>
            <span style={{ color: colors.amber }}>EXECUTE:</span> Post a 60-second AMDR breakdown daily this week. Use the same template (whiteboard or chart overlay) to build series recognition. Title format: "AMDR // [DATE] // [INSTRUMENT]"
          </div>
        </div>
        <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '20px' }}>
          <div style={{ color: colors.magenta, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '12px', fontWeight: 700 }}>
            ▸ AVOID / SATURATED
          </div>
          <div style={{ color: colors.text, fontSize: '12px', lineHeight: 1.7, marginBottom: '14px' }}>
            <strong style={{ color: colors.red }}>Funded Account Pain</strong> is heat-73 and trending DOWN with 14K posts. Audience fatigue.
          </div>
          <div style={{ background: colors.bg, padding: '12px', border: `1px solid ${colors.border}`, fontSize: '11px', color: colors.text, lineHeight: 1.6 }}>
            <span style={{ color: colors.amber }}>PIVOT:</span> If you want to address funded account audience, do it through the Quarterly Theory lens — "Why prop traders fail at 9:30" not "Lost my prop account again."
          </div>
        </div>
      </div>
    </div>
  );

  // ============ TRADE PDFs MODULE ============

  const TradePDFs = () => (
    <div style={{ padding: '24px', fontFamily: monoFont }}>
      <SectionLabel>TRADE VISUAL ARCHIVE</SectionLabel>
      <div style={{ color: colors.textDim, fontSize: '11px', marginBottom: '20px', lineHeight: 1.7, maxWidth: '720px' }}>
        Aesthetic, branded trade documentation for Instagram carousels, X posts, and PDF educational drops.
        Every entry tagged with the concept stack used.
      </div>

      <div style={{
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '70px 1fr 100px 90px 220px 100px',
          padding: '12px 18px',
          borderBottom: `1px solid ${colors.border}`,
          background: colors.bg,
          fontSize: '9px',
          color: colors.textDim,
          letterSpacing: '0.2em',
          fontWeight: 700
        }}>
          <span>ID</span>
          <span>SETUP</span>
          <span>DATE</span>
          <span>R:R</span>
          <span>CONCEPTS</span>
          <span style={{ textAlign: 'right' }}>SESSION</span>
        </div>
        {tradeVisualPDFs.map((t, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr 100px 90px 220px 100px',
            padding: '14px 18px',
            borderBottom: i < tradeVisualPDFs.length - 1 ? `1px solid ${colors.border}` : 'none',
            alignItems: 'center'
          }}>
            <span style={{ color: colors.textMute, fontSize: '10px', fontFamily: displayFont, letterSpacing: '0.1em' }}>
              {t.id.toUpperCase()}
            </span>
            <span style={{ color: colors.text, fontSize: '12px' }}>{t.title}</span>
            <span style={{ color: colors.textDim, fontSize: '10px', fontFamily: displayFont }}>{t.date}</span>
            <span style={{ color: colors.green, fontSize: '12px', fontFamily: displayFont, fontWeight: 700 }}>{t.rr}</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {t.concepts.map((c, j) => (
                <span key={j} style={{
                  fontSize: '8px',
                  letterSpacing: '0.1em',
                  color: colors.cyan,
                  border: `1px solid ${colors.border}`,
                  padding: '2px 6px',
                  fontWeight: 700
                }}>
                  {c}
                </span>
              ))}
            </div>
            <span style={{ color: colors.amber, fontSize: '9px', letterSpacing: '0.15em', textAlign: 'right' }}>{t.session}</span>
          </div>
        ))}
      </div>

      <SectionLabel accent={colors.amber}>PDF / CAROUSEL TEMPLATE BLUEPRINT</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {[
          { n: 1, title: 'COVER', body: 'Trade title + date + R:R achieved. Bold display font over chart screenshot. Watermark @matt_loeber.' },
          { n: 2, title: 'CONTEXT', body: 'Higher timeframe bias. Daily/4H structure. Where is liquidity sitting?' },
          { n: 3, title: 'TRIGGER', body: 'The CISD or SMT divergence moment. Annotated chart. Time stamp visible.' },
          { n: 4, title: 'ENTRY', body: 'IFVG, OB, or breaker block on entry timeframe. Stop placement. R defined.' },
          { n: 5, title: 'DELIVERY', body: 'Result. Time on trade. Lesson learned. CTA: "Save this. Apply tomorrow."' }
        ].map(s => (
          <div key={s.n} style={{
            background: colors.panel,
            border: `1px solid ${colors.border}`,
            padding: '16px',
            position: 'relative',
            minHeight: '180px'
          }}>
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              fontSize: '32px', fontFamily: displayFont, color: colors.borderHi,
              lineHeight: 1
            }}>
              0{s.n}
            </div>
            <div style={{ color: colors.amber, fontSize: '10px', letterSpacing: '0.25em', marginBottom: '12px', fontWeight: 700 }}>
              ▸ {s.title}
            </div>
            <div style={{ color: colors.text, fontSize: '11px', lineHeight: 1.6 }}>{s.body}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${colors.panel} 0%, ${colors.panelHi} 100%)`,
        border: `1px solid ${colors.border}`,
        padding: '24px'
      }}>
        <SectionLabel accent={colors.green}>VISUAL DESIGN STANDARD</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '8px' }}>
          {[
            { label: 'PALETTE', value: 'Black + neon green + amber. No gradients on charts.' },
            { label: 'TYPOGRAPHY', value: 'Mono for data. Bold display for hooks. Never serif.' },
            { label: 'WATERMARK', value: '@matt_loeber bottom-right. 30% opacity. Always.' },
            { label: 'DIMENSIONS', value: '1080×1350 IG · 1080×1080 X · 1080×1920 stories' }
          ].map((item, i) => (
            <div key={i}>
              <div style={{ color: colors.textDim, fontSize: '9px', letterSpacing: '0.25em', marginBottom: '6px', fontWeight: 700 }}>
                {item.label}
              </div>
              <div style={{ color: colors.text, fontSize: '11px', lineHeight: 1.6 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============ MENTOR AI MODULE ============

  const Mentor = () => (
    <div style={{ padding: '24px', fontFamily: monoFont }}>
      <SectionLabel>MENTOR DIRECTIVES</SectionLabel>
      <div style={{ color: colors.textDim, fontSize: '11px', marginBottom: '20px', lineHeight: 1.7, maxWidth: '720px' }}>
        Strategic guidance synthesized from creator economy data, trading-niche analytics, and conversion principles.
        Tier-ranked. Apply CRITICAL items immediately, HIGH within 7 days, MEDIUM as ongoing standards.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {mentorTips.map(t => {
          const tierColor = t.tier === 'CRITICAL' ? colors.red : t.tier === 'HIGH' ? colors.amber : colors.cyan;
          return (
            <div key={t.id} style={{
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              borderLeft: `3px solid ${tierColor}`,
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '120px 100px 1fr',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ color: tierColor, fontSize: '10px', letterSpacing: '0.25em', fontWeight: 700, marginBottom: '4px' }}>
                  ▸ {t.tier}
                </div>
                <div style={{ color: colors.textMute, fontSize: '9px', fontFamily: displayFont }}>
                  {t.id.toUpperCase()}
                </div>
              </div>
              <div style={{ color: colors.green, fontSize: '10px', letterSpacing: '0.2em', fontWeight: 700, paddingTop: '2px' }}>
                {t.area}
              </div>
              <div style={{ color: colors.text, fontSize: '12px', lineHeight: 1.7 }}>
                {t.tip}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '32px' }}>
        <SectionLabel accent={colors.magenta}>30-DAY GROWTH PLAYBOOK</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { week: 'WK 1', focus: 'FOUNDATION', tasks: ['Audit all 4 platforms', 'Lock content series names', 'Build 30-script bank', 'Set posting times'] },
            { week: 'WK 2', focus: 'VOLUME', tasks: ['Post 2x/day on TikTok', 'Repurpose to Reels/Shorts', 'Test 3 hook formats', 'Track top 5 performers'] },
            { week: 'WK 3', focus: 'OPTIMIZE', tasks: ['Double down on winners', 'Cut bottom 20% formats', 'First YouTube long-form', 'Engage comments <60min'] },
            { week: 'WK 4', focus: 'COMPOUND', tasks: ['Launch first PDF freebie', 'Email capture in bios', 'Collab with 2 creators', 'Review + plan next 30d'] }
          ].map((w, i) => (
            <div key={i} style={{ background: colors.panel, border: `1px solid ${colors.border}`, padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ color: colors.magenta, fontSize: '11px', letterSpacing: '0.25em', fontWeight: 700 }}>
                  {w.week}
                </span>
                <span style={{ color: colors.textMute, fontSize: '9px', letterSpacing: '0.15em' }}>{w.focus}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {w.tasks.map((task, j) => (
                  <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: colors.green, fontSize: '10px', marginTop: '2px' }}>▸</span>
                    <span style={{ color: colors.text, fontSize: '11px', lineHeight: 1.5 }}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============ ROUTING ============

  const renderModule = () => {
    if (!storageReady) return (
      <div style={{ padding: '60px', textAlign: 'center', color: colors.textDim, fontFamily: monoFont }}>
        <RefreshCw size={24} className="spin" /> Initializing storage...
      </div>
    );
    switch (activeModule) {
      case 'overview': return <Overview />;
      case 'review': return <SundayReview />;
      case 'history': return <History />;
      case 'scripts': return <Scripts />;
      case 'schedule': return <Schedule />;
      case 'trends': return <Trends />;
      case 'pdfs': return <TradePDFs />;
      case 'mentor': return <Mentor />;
      default: return <Overview />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      color: colors.text,
      fontFamily: monoFont,
      backgroundImage: `
        radial-gradient(circle at 20% 0%, rgba(0, 255, 159, 0.04) 0%, transparent 40%),
        radial-gradient(circle at 80% 100%, rgba(255, 170, 0, 0.03) 0%, transparent 40%),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.005) 2px, rgba(255,255,255,0.005) 4px)
      `
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; }
        ::-webkit-scrollbar-thumb:hover { background: ${colors.borderHi}; }
        button:hover { opacity: 0.85; }
        input::placeholder, textarea::placeholder { color: ${colors.textMute}; }
      `}</style>
      <Header />
      <Nav />
      {renderModule()}
      <div style={{
        borderTop: `1px solid ${colors.border}`,
        padding: '10px 24px',
        background: colors.panel,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '9px',
        color: colors.textMute,
        letterSpacing: '0.15em'
      }}>
        <span>LOEBER//TERMINAL · BUILT FOR PRECISION</span>
        <span>{weeklyReports.length} WEEKS LOGGED · STATUS: <span style={{ color: colors.green }}>OPERATIONAL</span></span>
      </div>
    </div>
  );
}
