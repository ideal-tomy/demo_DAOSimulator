export type Participant = {
  id: string;
  name: string;
  stakePercentage: number;
  walletBalance: number;
};

export type VoteChoice = 'support' | 'against' | null;

export type Vote = {
  participantId: Participant['id'];
  weight: number;
  choice: VoteChoice;
};

export type ProposalStatus = 'voting' | 'passed' | 'rejected';

export type Proposal = {
  id: string;
  title: string;
  type: 'INCOME' | 'EXPENSE';
  amount?: number; // 支出/収入のデモ用金額
  status: ProposalStatus;
  threshold: number; // e.g. 51
  votes: Vote[];
};

export type ActivityLogItem = {
  id: string;
  timestamp: string; // ISO 8601
  message: string;
};

export type DemoState = {
  currentPersona: string | 'LEGACY' | null;
  treasury: {
    balance: number;
  };
  participants: Participant[];
  proposals: Proposal[];
  activityLog: ActivityLogItem[];
  ui: {
    // アニメーション用のトリガー（収益/支出）
    flowEvent?: {
      id: number;
      type: 'income' | 'expense';
      amount: number;
    };
    // 可決通知
    notification?: {
      id: number;
      title: string;
      message: string;
    };
  };
};

export const INITIAL_STATE: DemoState = {
  currentPersona: null,
  treasury: {
    balance: 100_000_000,
  },
  participants: [
    { id: 'corp-01', name: 'A社（スタジオ）', stakePercentage: 7, walletBalance: 1_750_000 },
    { id: 'corp-02', name: 'B社（出版社）', stakePercentage: 5, walletBalance: 1_250_000 },
    { id: 'corp-03', name: 'C社（音楽会社）', stakePercentage: 9, walletBalance: 2_250_000 },
    { id: 'corp-04', name: 'D社（広告代理店）', stakePercentage: 4, walletBalance: 1_000_000 },
    { id: 'corp-05', name: 'E社（配信プラットフォーム）', stakePercentage: 11, walletBalance: 2_750_000 },
    { id: 'corp-06', name: 'F社（グッズメーカー）', stakePercentage: 6, walletBalance: 1_500_000 },
    { id: 'corp-07', name: 'G社（海外パートナー）', stakePercentage: 8, walletBalance: 2_000_000 },
    { id: 'corp-08', name: 'H社（投資ファンド）', stakePercentage: 10, walletBalance: 2_500_000 },
    { id: 'corp-09', name: 'I社（アニメ制作）', stakePercentage: 3, walletBalance: 750_000 },
    { id: 'corp-10', name: 'J社（マーケティング）', stakePercentage: 12, walletBalance: 3_000_000 },
    { id: 'corp-11', name: 'K社（興行会社）', stakePercentage: 5, walletBalance: 1_250_000 },
    { id: 'corp-12', name: 'L社（ITインテグレーター）', stakePercentage: 4, walletBalance: 1_000_000 },
    { id: 'corp-13', name: 'M社（サウンドスタジオ）', stakePercentage: 6, walletBalance: 1_500_000 },
    { id: 'corp-14', name: 'N社（ローカライズ）', stakePercentage: 5, walletBalance: 1_250_000 },
    { id: 'corp-15', name: 'O社（ライセンス管理）', stakePercentage: 5, walletBalance: 1_250_000 },
  ],
  proposals: [
    {
      id: 'proposal-001',
      title: '北米でのゲーム化ライセンス許諾',
      type: 'EXPENSE',
      amount: 20_000_000,
      status: 'voting',
      threshold: 51,
      votes: [
        { participantId: 'corp-01', weight: 7, choice: null },
        { participantId: 'corp-02', weight: 5, choice: null },
        { participantId: 'corp-03', weight: 9, choice: null },
        { participantId: 'corp-04', weight: 4, choice: null },
        { participantId: 'corp-05', weight: 11, choice: null },
        { participantId: 'corp-06', weight: 6, choice: null },
        { participantId: 'corp-07', weight: 8, choice: null },
        { participantId: 'corp-08', weight: 10, choice: null },
        { participantId: 'corp-09', weight: 3, choice: null },
        { participantId: 'corp-10', weight: 12, choice: null },
        { participantId: 'corp-11', weight: 5, choice: null },
        { participantId: 'corp-12', weight: 4, choice: null },
        { participantId: 'corp-13', weight: 6, choice: null },
        { participantId: 'corp-14', weight: 5, choice: null },
        { participantId: 'corp-15', weight: 5, choice: null },
      ],
    },
    {
      id: 'proposal-002',
      title: '新オフィス設備投資',
      type: 'EXPENSE',
      amount: 30_000_000,
      status: 'voting',
      threshold: 60,
      votes: [
        { participantId: 'corp-01', weight: 7, choice: null },
        { participantId: 'corp-02', weight: 5, choice: null },
        { participantId: 'corp-03', weight: 9, choice: null },
        { participantId: 'corp-04', weight: 4, choice: null },
        { participantId: 'corp-05', weight: 11, choice: null },
        { participantId: 'corp-06', weight: 6, choice: null },
        { participantId: 'corp-07', weight: 8, choice: null },
        { participantId: 'corp-08', weight: 10, choice: null },
        { participantId: 'corp-09', weight: 3, choice: null },
        { participantId: 'corp-10', weight: 12, choice: null },
        { participantId: 'corp-11', weight: 5, choice: null },
        { participantId: 'corp-12', weight: 4, choice: null },
        { participantId: 'corp-13', weight: 6, choice: null },
        { participantId: 'corp-14', weight: 5, choice: null },
        { participantId: 'corp-15', weight: 5, choice: null },
      ],
    },
  ],
  activityLog: [
    {
      id: 'log-001',
      timestamp: '2025-11-10T15:20:00+09:00',
      message: 'A社（スタジオ） (7%) が提案#001を作成しました。',
    },
    {
      id: 'log-002',
      timestamp: '2025-11-10T15:25:00+09:00',
      message: 'E社（配信プラットフォーム） (11%) が提案#002を作成しました。',
    },
  ],
  ui: {},
};

export const YEN = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

