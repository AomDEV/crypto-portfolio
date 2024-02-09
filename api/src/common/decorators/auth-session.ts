import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { getRequest } from "@/common/helpers/context";

export const AuthSession = createParamDecorator(
	(_, context: ExecutionContext) => getRequest(context)?.user ?? null
);