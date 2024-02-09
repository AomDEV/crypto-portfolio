import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import requestIp from 'request-ip';

const IpAddress = createParamDecorator(
    (_, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (request.clientIp) return request.clientIp;
        return requestIp.getClientIp(request);
    },
);
export default IpAddress;