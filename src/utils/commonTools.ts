import { useT } from '@transifex/react';
export const t = useT();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debug(message: any, ...optionalParams: any[]) {
  if ('production' !== process.env.NODE_ENV) console.log(message, optionalParams);
}
