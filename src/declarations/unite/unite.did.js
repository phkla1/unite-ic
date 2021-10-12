export const idlFactory = ({ IDL }) => {
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
  const UserRecordAddendum = IDL.Record({
    'firstname' : ContactField,
    'surname' : ContactField,
    'phone' : ContactField,
  });
  return IDL.Service({
    'listUsers' : IDL.Func([], [IDL.Vec(UserRecord)], []),
    'registerLogin' : IDL.Func([], [UserRecord], []),
    'updateUserRecord' : IDL.Func([UserRecordAddendum], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
