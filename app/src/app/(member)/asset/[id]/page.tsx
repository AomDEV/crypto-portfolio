"use client";
import CoinIcon from "@/components/coin/icon";
import { LoadingText, NoDataText } from "@/components/loading";
import { useAsset } from "@/hooks/asset";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useState } from "react";
import { formatUnits } from "ethers";
import { useQuote } from "@/hooks/quote";
import { usePositions } from "@/hooks/position";
import usePaginator from "@/components/paginator/hooks";
import Paginator from "@/components/paginator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { AssetPosition, AssetQuote, EDirection } from "@/types/schema";
import { Slider } from "@/components/ui/slider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BigNumber from "bignumber.js";
import { useBalance } from "@/hooks/balance";
import { isEnum } from "class-validator"
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast"
import PositionItem from "@/components/position/item";
import { toReadable } from "@/lib/big-number";

const formSchema = z.object({
    leverage: z.number().min(1, {
        message: "Leverage must be greater than 1",
    }).max(100, {
        message: "Leverage must be less than 100",
    }),
    amount: z.string().refine((value) => !isNaN(Number(value)), {
        message: "Amount must be greater than 0",
    }),
    direction: z.enum([EDirection.LONG, EDirection.SHORT]),
})
type OpenPositionDialogProps = {
    iconId: string;
    symbol: string;
    name: string;
    direction: EDirection;
    balance: string;
    decimals: number;
    assetId: string;
    defaultQuote?: AssetQuote;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
};
function OpenPositionDialog({
    iconId,
    symbol,
    name,
    direction,
    balance,
    decimals,
    assetId,
    defaultQuote,
    onSubmit,
}: OpenPositionDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            leverage: 1,
            amount: "0",
            direction,
        },
    })
    const updateAmountPercentage = useCallback((value: string) => {
        form.setValue('amount', Number(toReadable(value, decimals)).toFixed(2))
    }, [form, decimals]);
    const { quote } = useQuote({ assetId, defaultQuote })

    return (
        <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <DialogHeader>
                        <DialogTitle>Open <b>{EDirection[direction].toUpperCase()}</b> position</DialogTitle>
                    </DialogHeader>
                    <div className="text-center">
                        <div className="flex gap-1 items-center justify-center mt-2">
                            <CoinIcon iconId={iconId} symbol={symbol} width={16} height={16} />
                            <div className="font-bold text-xl">{name}</div>
                            <small>{symbol}</small>
                        </div>
                        <div className="my-1 border rounded-lg p-2 bg-slate-100">
                            <div className="text-3xl flex items-center gap-2 justify-center">
                                <span className="font-bold">{Number(quote?.price_thb ?? 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                <small className="text-sm">THB</small>
                            </div>
                            <div className="text-xs text-muted-foreground">Entry Point</div>
                        </div>
                        <div className="my-2 flex gap-2 flex-col text-center w-full">
                            <FormField
                                control={form.control}
                                name={'leverage'}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-1 w-full">
                                            <FormLabel className="w-full text-left text-muted-foreground">Leverage</FormLabel>
                                            <FormLabel className="w-full text-right font-bold">x{field.value}</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Slider
                                                {...field}
                                                value={[Number(field.value)]}
                                                defaultValue={[field.value]}
                                                max={100}
                                                step={1}
                                                onValueChange={(value) => {
                                                    form.setValue('leverage', value[0])
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="my-2">
                            <FormField
                                control={form.control}
                                name={'amount'}
                                render={({ field }) => (
                                    <FormItem className="text-left">
                                        <div className="flex gap-2 w-full items-center">
                                            <FormLabel className="text-muted-foreground">Amount</FormLabel>
                                            <div className="flex gap-1 items-center justify-end">
                                                {[25, 50, 100].map((percentage) => (
                                                    <a
                                                        key={percentage}
                                                        className="text-xs"
                                                        href={'#'}
                                                        onClick={() => updateAmountPercentage(BigNumber(balance).multipliedBy(percentage).div(100).toString())}
                                                    >
                                                        {percentage}%
                                                    </a>
                                                ))}
                                            </div>
                                            <FormLabel className="flex-1 text-right">
                                                {Number(formatUnits(balance, decimals)).toLocaleString(undefined, { minimumFractionDigits: 2 })} {symbol}
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit">Confirm</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}

const LIMIT = 10;
export default function Page() {
    const { id } = useParams();
    const { data, isLoading, noData } = useAsset({ assetId: id as string });
    const { data: balance, isLoading: balanceLoading, fetch: balanceFetch } = useBalance({ assetId: id as string })
    const { quote } = useQuote({
        assetId: id as string,
        defaultQuote: data?.quote
    });
    const {
        fetch,
        data: positions,
        meta,
        isLoading: positionLoading,
        noData: positionNoData
    } = usePositions({
        assetId: id as string,
        page: 1,
        limit: LIMIT,
        callOnMount: false
    })
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const { currentPage } = usePaginator({ fetch })
    const { toast } = useToast()

    const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
        const { direction: _direction, amount: _amount, leverage: _leverage } = values;

        const amount = BigNumber(_amount).multipliedBy(BigNumber(10).pow(data?.decimals.toString() ?? "0")).toString();
        const leverage = Math.max(1, Math.min(_leverage, 100));
        const direction = isEnum(_direction, EDirection) ? _direction : EDirection.LONG;

        const open = async () => {
            if (!data) return;
            setSubmitLoading(true);
            return api().post(`/v1/asset/${id as string}/position/open`, {
                amount,
                leverage,
                direction
            }).then((response) => {
                const position = response.data as AssetPosition;
                return toast({
                    title: `Position ${direction} opened`,
                    description: `Position ${data.symbol} (${direction}) opened at ${position.entry_price} THB`,
                });
            }).catch(() => {
                return toast({
                    title: `Failed to open position`,
                    description: `Failed to open position for ${data.symbol} (${direction})`,
                });
            }).finally(() => setSubmitLoading(false));
        };
        return open().finally(() => Promise.all([fetch(currentPage), balanceFetch()]));
    }, [id, data, fetch, balanceFetch, toast, currentPage]);
    const closePosition = useCallback((positionId: string) => {
        const close = async () => {
            if (!data) return;
            setSubmitLoading(true);
            return api().post(`/v1/asset/${id as string}/position/${positionId}/close`).then((response) => {
                const position = response.data as AssetPosition;
                return toast({
                    title: `Position closed`,
                    description: `Position for ${data.symbol} closed at ${position.exit_price} THB`,
                });
            }).catch(() => {
                return toast({
                    title: `Failed to close position`,
                    description: `Failed to close position for ${data.symbol}`,
                });
            }).finally(() => setSubmitLoading(false));
        };
        return close().finally(() => Promise.all([fetch(currentPage), balanceFetch()]));
    }, [id, data, fetch, balanceFetch, toast, currentPage])

    const coinBalance = useMemo(() => {
        if (!balance) return 0;
        return toReadable(balance.balance ?? "0", data?.decimals ?? 18).toNumber();
    }, [balance, data])

    if (isLoading) return <LoadingText />;
    if (!data || noData) return <NoDataText />;
    return (
        <div className="p-2">
            <div className="flex gap-2 items-center mb-2">
                <CoinIcon iconId={data.icon_id} symbol={data.symbol} width={32} height={32} />
                <h1 className="font-bold">{data.name}</h1>
                <small>{data.symbol}</small>
                <h3 className="flex-1 text-sm text-right flex gap-2 justify-end">
                    {(() => {
                        const className = (() => {
                            if (!quote || quote?.percent_change === 0) return 'text-slate-500';
                            return quote?.percent_change > 0 ? 'text-green-500' : 'text-red-500';
                        })();
                        const fragments = [
                            (() => {
                                if (!quote || quote?.percent_change === 0) return null;
                                return quote?.percent_change > 0 ? '+' : '';
                            })(),
                            quote?.percent_change.toFixed(2) ?? '0.00',
                            '%'
                        ];
                        return <small className={["font-bold", className].join(" ")}>{fragments.join('')}</small>;
                    })()}
                    {Number(quote?.price_thb).toLocaleString(undefined, { minimumFractionDigits: 2 })} THB
                </h3>
            </div>
            <div className="flex flex-col items-center my-2">
                <small>Your Balance</small>
                <h1 className="font-bold text-3xl">
                    {(() => {
                        if (balanceLoading) return <LoadingText />
                        const formattedPrice = coinBalance.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        return [formattedPrice, data.symbol].join(' ');
                    })()}
                </h1>
                <small className="text-slate-500">
                    ~{(() => {
                        const formattedPrice = (Number(quote?.price_thb ?? 0) * coinBalance).toLocaleString(undefined, { minimumFractionDigits: 2 });
                        return [formattedPrice, 'THB'].join(' ');
                    })()}
                </small>
            </div>
            <div className="flex gap-2 items-center w-full justify-center">
                <div className="max-w-xs flex gap-2 items-center justify-center w-full">
                    <Dialog>
                        <DialogTrigger disabled={submitLoading} asChild>
                            <Button disabled={submitLoading} className="bg-green-700 w-full">
                                Long
                            </Button>
                        </DialogTrigger>
                        <OpenPositionDialog
                            iconId={data.icon_id}
                            symbol={data.symbol}
                            name={data.name}
                            direction={EDirection.LONG}
                            balance={balance?.balance ?? "0"}
                            decimals={data.decimals}
                            assetId={data.id}
                            defaultQuote={data.quote}
                            onSubmit={onSubmit}
                        />
                    </Dialog>
                    <Dialog>
                        <DialogTrigger disabled={submitLoading} asChild>
                            <Button disabled={submitLoading} className="bg-red-700 w-full">
                                Short
                            </Button>
                        </DialogTrigger>
                        <OpenPositionDialog
                            iconId={data.icon_id}
                            symbol={data.symbol}
                            name={data.name}
                            direction={EDirection.SHORT}
                            balance={balance?.balance ?? "0"}
                            decimals={data.decimals}
                            assetId={data.id}
                            defaultQuote={data.quote}
                            onSubmit={onSubmit}
                        />
                    </Dialog>
                </div>
            </div>
            {/* DataTable */}
            <div className="my-2">
                Positions
                <div>
                    <div className="flex justify-center flex-col items-center gap-2 my-2">
                        {(() => {
                            if (positionLoading) return <LoadingText />;
                            if (positionNoData) return <NoDataText />;
                            return (positions ?? []).map((position, index) => (
                                <PositionItem
                                    key={index}
                                    position={position}
                                    asset={data}
                                    quote={quote}
                                    onClose={closePosition}
                                    loading={submitLoading}
                                />
                            ));
                        })()}
                    </div>
                    {meta && <Paginator
                        totalItems={meta.totalCount}
                        totalPages={meta.pageCount}
                        perPage={LIMIT}
                        currentPage={currentPage}
                    />}
                </div>
            </div>
        </div>
    );
}