export type MonthlyTopSpending = {
  id: string;
  collectionId: string;
  collectionName: string;
  user: string;
  vendor: string;
  transaction_count: number;
  total_amount: number;
};

export type Transaction = {
  amount: number;
  category: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  date: Date;
  expand: {
    category: Category;
  };
  id: string;
  updated: Date;
  user: string;
  vendor: string;
};

export type Keyword = {
  category: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  id: string;
  keyword: string;
  updated: Date;
  user: string;
};

export type User = {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: Date;
  username: string;
  verified: boolean;
};

export type Category = {
  collectionId: string;
  collectionName: string;
  created: Date;
  id: string;
  name: string;
  updated: Date;
  user: string;
  keywords: string[];
  color: string;
  expand?: {
    keywords?: Keyword[];
  };
};
