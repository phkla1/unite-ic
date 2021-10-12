import type { Principal } from '@dfinity/principal';
export type ContactField = string;
export type Count = bigint;
export type Timestamp = bigint;
export type UserId = Principal;
export interface UserRecord {
  'firstname' : ContactField,
  'counter' : Count,
  'surname' : ContactField,
  'callerId' : UserId,
  'timestamp' : Timestamp,
  'phone' : ContactField,
}
export interface UserRecordAddendum {
  'firstname' : ContactField,
  'surname' : ContactField,
  'phone' : ContactField,
}
export interface _SERVICE {
  'listUsers' : () => Promise<Array<UserRecord>>,
  'registerLogin' : () => Promise<UserRecord>,
  'updateUserRecord' : (arg_0: UserRecordAddendum) => Promise<boolean>,
}
