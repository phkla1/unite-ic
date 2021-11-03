import Array "mo:base/Array";
import Console "mo:base/Debug";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "./types";
import UserDatabase "mo:base/Array";
import Option "mo:base/Option";
import P "mo:base/Prelude";
import Nat "mo:base/Nat";
import Digraph "./digraph";
import Iter "mo:base/Iter";

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
	type ChatMessage = Types.ChatMessage;
	type Vertex = Types.Vertex;
	type ContactField = Types.ContactField;

	var userDatabase : [UserRecord] = []; 
	var chatDatabase : [ChatMessage] = [];
	var graph: Digraph.Digraph = Digraph.Digraph(); 

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

	//DELETE THIS
	func getUserRecordByName(name: ContactField) : ?UserRecord {
		func userExists(user: UserRecord): Bool { user.firstname == name };
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

	//DELETE THIS
	public shared(msg) func nameLogin(name : ContactField) : async UserRecord {
		var record : UserRecord = {
			callerId = msg.caller;
			timestamp = Time.now();
			counter = userDatabase.size();
			firstname = "";
			surname = "";
			phone = "";	
		};
		
		Console.print(debug_show("NAMELOGIN INPUT:", name));
		record := Option.get<UserRecord>(getUserRecordByName(name), record);
		Console.print(debug_show("NAMELOGIN:", record));
		return record;
	};

	public shared(msg) func updateUserRecord(recordAddition : UserRecordAddendum) : async Bool {
		//add the supplied fields to the user's record
		if(hasAccess(msg.caller)) {
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

	public shared(msg) func listUsers(name : Text) : async [UserRecord] {
		var nullUser : UserRecord = {
			callerId = msg.caller;
			timestamp = 0;
			counter = 0;
			firstname = "";
			surname = "";
			phone = "";		
		};
		var record : UserRecord = Option.get<UserRecord>(getUserRecordByName(name), nullUser);

		var nameArray = Iter.toArray<Char>(name.chars());
		if(nameArray.size() > 1) {
			switch(record) {
				case(nullUser) { [] };
				case(_) { userDatabase };
			};
		}
		else {
			if(hasAccess(msg.caller)) {
				Console.print(debug_show("USER DATABASE:", userDatabase));
				return userDatabase;
			}
			else {
				Console.print(debug_show("EMPTY DATABASE:", []));
				return [];
			}
		}
	};

	public shared(msg) func putChat(chat : ChatMessage) : async Nat {
		var recipientId : Count = 0;
		if(hasAccess(msg.caller)) {
			if(Nat.greater(chat.to, 0)) {
				recipientId := chat.to;
			};	
			var newChat : ChatMessage = {
				from = msg.caller;
				to = recipientId;
				body = chat.body;
				timestamp = Time.now();
			};
			var chatId = chatDatabase.size();

			chatDatabase := Array.append(chatDatabase, [newChat]);
			return chatId;
		}
		else {
			0
		}
	};

	public shared(msg) func getLatestChats(timestamp : Timestamp) : async [ChatMessage] {
		if(hasAccess(msg.caller)) {
			//get user's 'counter' from principal
			var user : UserRecord = Option.unwrap(getUserRecord(msg.caller));
			var counter : Count = user.counter;

			//use counter to get all chats for the user
			func filterChatsByUser(chat : ChatMessage): Bool { chat.to == counter };
			var usersChats : [ChatMessage] = Array.filter<ChatMessage>(chatDatabase, filterChatsByUser);

			//filter chats with higher timestamp
			func chatsAfterTimestamp(chat : ChatMessage) : Bool { Int.greater(chat.timestamp, timestamp)};
			var latestChats : [ChatMessage] = Array.filter<ChatMessage>(usersChats, chatsAfterTimestamp);
			return latestChats;	
		}
		else {
			[]
		}
	};

	public shared(msg) func getMyRecord(name : Text) : async UserRecord {
		var record : UserRecord = {
			callerId = msg.caller;
			timestamp = 0;
			counter = 0;
			firstname = "";
			surname = "";
			phone = "";	
		};	

		//if valid name get userid from name. Otherwise use msg.caller
		var nameArray = Iter.toArray<Char>(name.chars());
		if(nameArray.size() > 1) {
			record := Option.get<UserRecord>(getUserRecordByName(name), record);
		}
		else {
			if(isRegistered(msg.caller)) {
				record := Option.get<UserRecord>(getUserRecord(msg.caller), record);
			};
		};
		return record;
	};

	public shared(msg) func connect(userId: UserId): async () {
		graph.addEdge(msg.caller, userId);
	};

	public shared(msg) func getConnections(name : Text): async [UserRecord] {
			Console.print(debug_show("GET CONNECTIONS CALLED WITH:", name));
		var nameArray = Iter.toArray<Char>(name.chars());
		var record : UserRecord = {
			callerId = msg.caller;
			timestamp = Time.now();
			counter = userDatabase.size();
			firstname = "";
			surname = "";
			phone = "";	
		};

		//if valid name is supplied get callerId from name, otherwise use msg.caller
		if(nameArray.size() > 1) {
			record := Option.get<UserRecord>(getUserRecordByName(name), record);
			return getUserConnections(record.callerId);
		}
		else {
			return getUserConnections(msg.caller);
		}
    };

	func getUserConnections(userId: UserId) : [UserRecord] {
		var connectionList : [UserRecord] = [];
    	var connections : [Vertex] = graph.getAdjacent(userId);
		var i = 0;

		if(connections.size() > 0) {
			while(i < connections.size()) {
				for(user in Iter.fromArray<UserRecord>(userDatabase)) {
					if(connections[i] == user.callerId) {
						connectionList := Array.append<UserRecord>(connectionList, [user]);
					};
				};
				i += 1;
			};
			Console.print(debug_show("CONNECTION LIST:", connectionList));
			return connectionList;
		}
		else {
			Console.print(debug_show("CONNECTION LIST IS EMPTY:"));
			return [];
		};
	}

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
