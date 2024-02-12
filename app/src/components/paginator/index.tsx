import {
	Pagination,
	PaginationContent,
	PaginationEllipsis as Ellipsis,
	PaginationItem as Item,
	PaginationLink as Link,
	PaginationNext as Next,
	PaginationPrevious as Prev,
} from "@/components/ui/pagination"
import { createPagination } from "./helper";
import { Fragment, useCallback, useMemo } from "react";
import { CreatePaginationHelperMetadata, PaginatorProps } from "./types";
import { usePagination } from "./hooks";

export default function Paginator({
	children,
	currentPage: _currentPage = 1,
	totalPages,
	totalItems,
	perPage,
	setCurrentPage,
	noMeta = false,
}: PaginatorProps) {
	const currentPage = useMemo(() => _currentPage, [_currentPage]);
	const {
		goToPage,
		onNextPage,
		onPrevPage
	} = usePagination({
		currentPage,
		totalPages,
		setCurrentPage
	});

	const map = useCallback((metadata: CreatePaginationHelperMetadata) => {
		if(!metadata) return null;
		if (metadata.type === "ellipsis") return <Ellipsis />;
		if (metadata.type === "next") return <Next href="#" onClick={onNextPage} />;
		if (metadata.type === "prev") return <Prev href="#" onClick={onPrevPage} />;
		const isActive = metadata.value === currentPage;
		const onClick = () => goToPage(metadata.value);
		return (<Link href="#" isActive={isActive} onClick={onClick}>
			{metadata.value}
		</Link>);
	}, [currentPage, onNextPage, onPrevPage, goToPage]);

	return (
		<Fragment>
			{children}
			<div>
				<Pagination>
					<PaginationContent>
						{
							createPagination({totalPages, currentPage})
							.map((metadata, index) => 
								<Item key={index}>{map(metadata)}</Item>
							)
						}
					</PaginationContent>
				</Pagination>
				{!noMeta && (
					<p className="text-center text-sm p-2 text-muted-foreground">
						Showing <b>{Math.min(totalItems, perPage)} of {totalItems}</b> items
					</p>
				)}
			</div>
		</Fragment>
	);
}