import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FetchQuoteUsecase } from "./usecases/fetch-quote.usecase";

@Injectable()
export class WebSocketService {
    constructor (
        private readonly fetchQuoteUsecase: FetchQuoteUsecase,
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    getQuotes () {
        return this.fetchQuoteUsecase.execute();
    }
}