import React from 'react';

export type SingleNavItem = { 
  title: string; 
  href: string; 
  outlined?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export type NavItems = SingleNavItem[];

export type SingleArticle = {
  slug: string;
  content: string;
  meta: {
    title: string;
    description: string;
    date: string;
    tags: string;
    imageUrl: string;
  };
};

export type NonNullableChildren<T> = { [P in keyof T]: Required<NonNullable<T[P]>> };

export type NonNullableChildrenDeep<T> = {
  [P in keyof T]-?: NonNullableChildrenDeep<NonNullable<T[P]>>;
};