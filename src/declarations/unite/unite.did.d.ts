import type { Principal } from '@dfinity/principal';
export interface ChatMessage {
  'to' : Count,
  'body' : string,
  'from' : Principal,
  'timestamp' : Timestamp,
}
export type ContactField = string;
export type ContactField__1 = string;
export type Count = bigint;
export type Timestamp = bigint;
export type Timestamp__1 = bigint;
export type UserId = Principal;
export type UserId__1 = Principal;
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
  'connect' : (arg_0: UserId__1) => Promise<undefined>,
  'getConnections' : (arg_0: string) => Promise<Array<UserRecord>>,
  'getLatestChats' : (arg_0: Timestamp__1) => Promise<Array<ChatMessage>>,
  'getMyRecord' : (arg_0: string) => Promise<UserRecord>,
  'listUsers' : (arg_0: string) => Promise<Array<UserRecord>>,
  'nameLogin' : (arg_0: ContactField__1) => Promise<UserRecord>,
  'putChat' : (arg_0: ChatMessage) => Promise<bigint>,
  'registerLogin' : () => Promise<UserRecord>,
  'updateUserRecord' : (arg_0: UserRecordAddendum) => Promise<boolean>,
}
