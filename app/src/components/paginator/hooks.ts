import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UsePaginationProps, UsePaginatorProps } from "./types";

export function usePagination({
	setCurrentPage,
	currentPage,
	totalPages,
}: UsePaginationProps) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
    const { replace } = useRouter();

	// Go to `page`
	const goToPage = useCallback((page?: number) => {
		if (!page) return;
		if (typeof setCurrentPage === "function") return setCurrentPage(page);
		const params = new URLSearchParams(searchParams);
		if (page <= 0 || page > totalPages) return;
		params.set('page', String(page));
		return replace([pathname, params.toString()].filter(Boolean).join("?"));
	}, [searchParams, pathname]);

	// Go to next page
	const onNextPage = useCallback(() => {
		if (currentPage === totalPages) return;
		return goToPage(currentPage + 1);
	}, [currentPage]);

	// Go to previous page
	const onPrevPage = useCallback(() => {
		if (currentPage === 1) return;
		return goToPage(currentPage - 1);
	}, [currentPage]);

	return {
		searchParams,
		goToPage,
		onNextPage,
		onPrevPage
	};
}
function usePaginator({ fetch, defaultPage }: UsePaginatorProps) {
	const [currentPage, setCurrentPage] = useState<number>(defaultPage ?? 1);
	const searchParams = useSearchParams();
	
	useEffect(() => {
		const page = parseInt(searchParams.get('page')?.toString() ?? "1");
		if (typeof fetch === "function") fetch(page);
	}, [fetch, searchParams]);

	return { currentPage, setCurrentPage, fetch };
}
export default usePaginator;