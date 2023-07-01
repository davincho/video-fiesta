export type Nipple = {
  label: string;
  start: number;
  end: number;
};

export type Video = {
  videoId: string;
  nipples: Nipple[];
};

export type Board = {
  title: string;
  videos?: Video[];
};
