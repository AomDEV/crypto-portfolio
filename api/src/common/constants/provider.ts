import { Provider } from "@nestjs/common";
import { JwtAuthGuard } from "@/common/middlewares/jwt.guard";

export const APP_GUARDS: Array<Provider> = [
	JwtAuthGuard,
];