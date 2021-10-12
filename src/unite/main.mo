import Array "mo:base/Array";
import Console "mo:base/Debug";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "./types";
import UserDatabase "mo:base/Array";
import Option "mo:base/Option";

/* 
register users with valid II authentication. 
All endpoints require registration except the registration endpoint
*/

actor {
  	type UserRecord = Types.UserRecord;
	type RegistrationResponse = Types.RegistrationResponse; 
	type UserId = Types.UserId;
	type Timestamp = Types.Timestamp;
	type Count = Types.Count;
	type UserRecordAddendum = Types.UserRecordAddendum;

	var userDatabase : [UserRecord] = []; 

	//check whether user has access. For now this just checks that the user is registered.
	func hasAccess(user : Principal) : Bool {
		if(isRegistered(user)) {
			true
		}
		else {
			false
		}
	};

	func isRegistered(userId : UserId) : Bool {
		func userExists(user: UserRecord): Bool { user.callerId == userId };
    
    	switch (Array.find<UserRecord>(userDatabase, userExists)) {
        	case (null) { false };
        	case (_) { true };
    	};
	};

	func getUserRecord(userId: UserId) : ?UserRecord {
		func userExists(user: UserRecord): Bool { user.callerId == userId };
		var user : ?UserRecord = Array.find<UserRecord>(userDatabase, userExists);
		return user;
	};

	public shared(msg) func registerLogin() : async UserRecord {
		/*
		Is the user registered? If not register. Then return current user record.
		*/
		var caller : UserId = msg.caller;
		var record : UserRecord = {
			callerId = caller;
			timestamp = Time.now();
			counter = userDatabase.size();
			firstname = "";
			surname = "";
			phone = "";	
		};

		if(isRegistered(caller)) {
			record := Option.get<UserRecord>(getUserRecord(caller), record);
		}
		else {
			userDatabase := Array.append(userDatabase, [record]);
		};

		Console.print(debug_show("NEW USER:", record));
		return record;
	};

	public shared(msg) func updateUserRecord(recordAddition : UserRecordAddendum) : async Bool {
		//add the supplied fields to the user's record
		if(hasAccess(msg.caller)) {
			/*
			func updateRecord(record : UserRecord) : UserRecord {
				var newRecord : UserRecord = {
					callerId = record.callerId;
					timestamp = record.timestamp;
					counter = record.counter;
					firstname = "";
					surname = "";
					phone = "";
				};

				if(record.callerId != msg.caller) {
					return record;
				}
				else {
					if(recordAddition.firstname) {
						newRecord.firstname := recordAddition.firstname;
					};
					if(recordAddition.surname) {
						newRecord.surname := recordAddition.surname;
					};
					if(recordAddition.phone) {
						newRecord.phone := recordAddition.phone;
					};
					newRecord
				};
			};

			var newDb = Array.map(userDatabase, updateRecord);
			*/

			func updateRecord(i : Nat) : UserRecord {
				if(userDatabase[i].callerId == msg.caller) {
					{
						callerId = msg.caller;
						timestamp = Time.now();
						counter = i;
						firstname = recordAddition.firstname;
						surname = recordAddition.surname;
						phone = recordAddition.phone;		
					}
				}
				else {
					userDatabase[i];
				}
			};
			var newDb : [UserRecord] = Array.tabulate<UserRecord>(userDatabase.size(), updateRecord);
			userDatabase := newDb;
			Console.print(debug_show("DB:", userDatabase));
			return true;
		}
		else {
			Console.print(debug_show("NO PERMISSIONS"));
			return false;
		}	
	};

	public shared(msg) func listUsers() : async [UserRecord] {
		if(hasAccess(msg.caller)) {
			Console.print(debug_show("USER DATABASE:", userDatabase));
			return userDatabase;
		}
		else {
			Console.print(debug_show("EMPTY DATABASE:", []));
			return [];
		}
	};

/*
    public shared query(msg) func http_request(request : HttpRequest) : async HttpResponse {
		var caller = Principal.toText(UserDatabase[0].callerId);
		var stamp = Int.toText(UserDatabase[0].timestamp);
		var counter = Int.toText(UserDatabase[0].counter);
		var result : Text = caller # "--" # stamp # "--" # counter;

        return {
            status_code = 200;
            headers = [("Content-Type", "text/html")];
            body = Text.encodeUtf8(result);
        };
    };
*/
};
