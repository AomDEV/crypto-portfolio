export type UsePaginatorProps = {
	fetch: (page: number) => Promise<void> | void;
	defaultPage?: number;
}
export type UsePaginationProps = {
	currentPage: number;
	totalPages: number;
	setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
};
export type PaginatorProps = {
	children?: string | JSX.Element | JSX.Element[];
	totalItems: number;
	perPage: number;
	noMeta?: boolean;
} & UsePaginationProps;
export type CreatePaginationHelperProps = {
	currentPage: number;
	totalPages: number;
};
export type CreatePaginationHelperMetadata = {
	type: "page" | "ellipsis" | "prev" | "next";
	value?: number;
};