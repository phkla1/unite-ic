export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const UserRecord = IDL.Record({
    'counter' : IDL.Nat,
    'callerId' : IDL.Principal,
    'timestamp' : Time,
  });
  return IDL.Service({
    'listUsers' : IDL.Func([], [IDL.Vec(UserRecord)], []),
    'register' : IDL.Func([], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
