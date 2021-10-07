import type { Principal } from '@dfinity/principal';
export type Time = bigint;
export interface UserRecord {
  'counter' : bigint,
  'callerId' : Principal,
  'timestamp' : Time,
}
export interface _SERVICE {
  'listUsers' : () => Promise<Array<UserRecord>>,
  'register' : () => Promise<boolean>,
}
