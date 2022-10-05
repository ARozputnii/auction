import { SetMetadata } from '@nestjs/common';

export const META_DATA_KEY = process.env.META_DATA_KEY;
export const SkipAuth = () => SetMetadata(META_DATA_KEY, true);
