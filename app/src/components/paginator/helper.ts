import { CreatePaginationHelperMetadata, CreatePaginationHelperProps } from "./types";

export function range(length: number) {
    return Array.from({ length }, (_, index) => index + 1);
}
const MAX_PAGES = 5;
const ELLIPSIS: CreatePaginationHelperMetadata = { type: "ellipsis" };
const PREV: CreatePaginationHelperMetadata = { type: "prev" };
const NEXT: CreatePaginationHelperMetadata = { type: "next" };
const FIRST_PAGE: CreatePaginationHelperMetadata = { type: "page", value: 1 };
export function createPagination({
    totalPages,
    currentPage
}: CreatePaginationHelperProps): Array<CreatePaginationHelperMetadata> {
    const LAST_PAGE: CreatePaginationHelperMetadata = {
			type: "page",
			value: totalPages
		};
		const pages: CreatePaginationHelperMetadata[] = range(Math.max(1, totalPages)).map(value => ({
	    type: "page",
	    value
    }));
    if (totalPages <= MAX_PAGES) return [PREV, ...pages, NEXT];
    if (currentPage <= 3) {
        return [
            PREV,
            ...pages.slice(0, MAX_PAGES - 1),
            ELLIPSIS,
            LAST_PAGE,
            NEXT,
        ];
    }
    if (currentPage >= totalPages - 2) {
        return [
            PREV,
            FIRST_PAGE,
            ELLIPSIS,
            ...pages.slice(totalPages - MAX_PAGES + 1, totalPages),
            NEXT,
        ];
    }
    return [
        PREV,
        FIRST_PAGE,
        ELLIPSIS,
        ...pages.slice(currentPage - 2, currentPage + 1),
        ELLIPSIS,
        LAST_PAGE,
        NEXT,
    ];
}