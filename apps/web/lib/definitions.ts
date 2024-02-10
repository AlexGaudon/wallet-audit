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
  expand?: {
    keywords?: Keyword[];
  };
};
