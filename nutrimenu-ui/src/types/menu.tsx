export type MenuSlim = {
    date: string;
    lunch: string;
    dinner: string;
};

export type MenusSlimByMonth = {
    [month: string]: MenuSlim[];
};