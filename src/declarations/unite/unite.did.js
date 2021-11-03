export const idlFactory = ({ IDL }) => {
  const UserId__1 = IDL.Principal;
  const ContactField = IDL.Text;
  const Count = IDL.Nat;
  const UserId = IDL.Principal;
  const Timestamp = IDL.Int;
  const UserRecord = IDL.Record({
    'firstname' : ContactField,
    'counter' : Count,
    'surname' : ContactField,
    'callerId' : UserId,
    'timestamp' : Timestamp,
    'phone' : ContactField,
  });
  const Timestamp__1 = IDL.Int;
  const ChatMessage = IDL.Record({
    'to' : Count,
    'body' : IDL.Text,
    'from' : IDL.Principal,
    'timestamp' : Timestamp,
  });
  const ContactField__1 = IDL.Text;
  const UserRecordAddendum = IDL.Record({
    'firstname' : ContactField,
    'surname' : ContactField,
    'phone' : ContactField,
  });
  return IDL.Service({
    'connect' : IDL.Func([UserId__1], [], []),
    'getConnections' : IDL.Func([IDL.Text], [IDL.Vec(UserRecord)], []),
    'getLatestChats' : IDL.Func([Timestamp__1], [IDL.Vec(ChatMessage)], []),
    'getMyRecord' : IDL.Func([IDL.Text], [UserRecord], []),
    'listUsers' : IDL.Func([IDL.Text], [IDL.Vec(UserRecord)], []),
    'nameLogin' : IDL.Func([ContactField__1], [UserRecord], []),
    'putChat' : IDL.Func([ChatMessage], [IDL.Nat], []),
    'registerLogin' : IDL.Func([], [UserRecord], []),
    'updateUserRecord' : IDL.Func([UserRecordAddendum], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
