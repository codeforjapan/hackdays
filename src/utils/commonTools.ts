// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debuglog(message: any, ...optionalParams: any[]) {
  if ('production' !== process.env.NODE_ENV) console.log(message, optionalParams);
}
