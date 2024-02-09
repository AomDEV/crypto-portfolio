import { ExecutionContext } from "@nestjs/common";
import { NestRequest } from "@/common/types/nest";

export function getRequest (context: ExecutionContext): NestRequest {
    return context.switchToHttp().getRequest<Request>();
}