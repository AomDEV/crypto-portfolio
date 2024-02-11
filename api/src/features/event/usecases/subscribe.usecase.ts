import { BaseUsecase } from "@/common/shared/usecase";
import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { EventService } from "../event.service";

type SubscribeUsecaseProps = {
    event?: string;
};

@Injectable()
export class SubscribeUsecase extends BaseUsecase<Observable<MessageEvent<any>>> {
    constructor(
        private readonly eventService: EventService,
    ) {
        super();
    }

    execute({
        event
    }: SubscribeUsecaseProps): Observable<MessageEvent<any>> {
        const events = (event ?? "").split(',');
        
        return this.eventService.subscribe(events.filter(Boolean));
    }
}