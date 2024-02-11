import { BaseUsecase } from "@/common/shared/usecase";
import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { EventService } from "../event.service";

type SubscribeUsecaseProps = {
    event?: string;
    merged: boolean;
};

@Injectable()
export class SubscribeUsecase extends BaseUsecase<Observable<MessageEvent<any>>> {
    constructor(
        private readonly eventService: EventService,
    ) {
        super();
    }

    execute({
        event,
        merged = false
    }: SubscribeUsecaseProps): Observable<MessageEvent<any>> {
        const events = (event ?? "").split(',');
        
        return this.eventService.subscribe(events.filter(Boolean), merged);
    }
}