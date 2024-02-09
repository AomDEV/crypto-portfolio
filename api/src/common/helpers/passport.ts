import { ExtractJwt } from 'passport-jwt';
import { NestRequest } from "@/common/types/nest";

export function getBearerToken(request: NestRequest) {
	const extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
	return extractJwt(request);
}
export function getBasicToken (request: NestRequest) {
    const extractBasic = ExtractJwt.fromAuthHeaderWithScheme('Basic');
    return extractBasic(request);
}