import Array "mo:base/Array";
import Console "mo:base/Debug";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
//import Types "./types";
import UserDatabase "mo:base/Array";

/* 
register users with valid II authentication. 
All endpoints require registration except the registration endpoint
*/

actor {
	type UserRecord = {
		callerId : Principal;
		timestamp : Time.Time;
		counter : Nat;
	};

	type RegistrationResponse = {
		principal : Text;
		timestamp : Time.Time;
		message : Int;
		deleteThis : Nat;
	};

    type HeaderField = (Text, Text);

    type HttpRequest = {
        method: Text;
        url: Text;
        headers: [HeaderField];
        body: Blob;
    };

    type HttpResponse = {
        status_code: Nat16;
        headers: [HeaderField];
        body: Blob;
    };
	/*
  	type UserRecord = Types.UserRecord;

	type RegistrationResponse = Types.RegistrationResponse; 

    type HeaderField = Types.HeaderField;

    type HttpRequest = Types.HttpRequest;

    type HttpResponse = Types.HttpResponse; 
	*/

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

	func isRegistered(userId : Principal) : Bool {
		func userExists(user: UserRecord): Bool { user.callerId == userId };
    
    	switch (Array.find<UserRecord>(userDatabase, userExists)) {
        	case (null) { false };
        	case (_) { true };
    	};
	};

	public shared(msg) func register() : async Bool {
		var caller : Principal = msg.caller;
		var timenow : Time.Time = Time.now();
		var count : Nat = userDatabase.size();
		var newUser : UserRecord = {
				callerId = caller;
				timestamp = timenow;
				counter = count;
		};
		Console.print(debug_show("NEW USER:", newUser));
		if(isRegistered(caller)) {
			false
		}
		else {
			userDatabase := Array.append(userDatabase, [newUser]);
			true
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
