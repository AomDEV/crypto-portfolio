import { SetMetadata } from '@nestjs/common';

export const GUEST = 'GUEST';
export const Guest = () => SetMetadata(GUEST, true);