import { BaseUsecase } from "@/common/shared/usecase";
import { Injectable } from "@nestjs/common";

type CoinBalanceUsecaseProps = {

};

@Injectable()
export class CoinBalanceUsecase extends BaseUsecase<Promise<any>> {
    constructor () {
        super();
    }

    async execute({
        
    }: CoinBalanceUsecaseProps): Promise<any> {
        
    }
}