export type PaginationResponse<T> = {
    data: Array<T>;
    meta: PaginationMeta;
};
export type PaginationMeta = {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number;
    pageCount: number;
    totalCount: number;
};