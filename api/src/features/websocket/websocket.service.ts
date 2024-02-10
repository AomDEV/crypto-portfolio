import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";
import { FetchRateUsecase } from "./usecases/fetch-rate.usecase";

@Injectable()
export class WebSocketService {
    constructor (
        private readonly fetchQuoteUsecase: FetchQuoteUsecase,
        private readonly fetchRateUsecase: FetchRateUsecase,
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    getQuotes () {
        return this.fetchQuoteUsecase.execute();
    }

    @Cron(CronExpression.EVERY_HOUR)
    getRates () {
        return this.fetchRateUsecase.execute();
    }
}