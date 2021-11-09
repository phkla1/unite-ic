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
	type UserGroup = Types.UserGroup;
	type UserGroupEntry = Types.UserGroupEntry;
	type GroupId = Types.GroupId;

	var userDatabase : [UserRecord] = []; 
	var chatDatabase : [ChatMessage] = [];
	var graph: Digraph.Digraph = Digraph.Digraph(); 
	var sysGroup : UserGroup = {creator = null; groupId = 0; name = "system";};
	var groupDatabase : [UserGroup] = [sysGroup];
	var usersGroupsDatabase : [UserGroupEntry] = [];

	//check whether user has access. For now this just checks that the user is registered.
	func hasAccess(user : UserId) : Bool {
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
		var record : UserRecord = {
			callerId = ?msg.caller;
			timestamp = Time.now();
			counter = userDatabase.size();
			firstname = "";
			surname = "";
			phone = "";	
		};

		if(isRegistered(?msg.caller)) {
			record := Option.get<UserRecord>(getUserRecord(?msg.caller), record);
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
			callerId = ?msg.caller;
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
		if(hasAccess(?msg.caller)) {
			func updateRecord(i : Nat) : UserRecord {
				if(Option.unwrap<Principal>(userDatabase[i].callerId) == msg.caller) {
					{
						callerId = ?msg.caller;
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
			callerId = ?msg.caller;
			timestamp = 0;
			counter = 0;
			firstname = "";
			surname = "";
			phone = "";		
		};
		var record : UserRecord = Option.get<UserRecord>(getUserRecordByName(name), nullUser);

		var nameArray = Iter.toArray<Char>(name.chars());
		if(nameArray.size() > 1) {
			if(record.timestamp == 0) {
				[]
			}
			else {
				userDatabase
			}
			/*
			switch(record) {
				case(nullUser) { [] };
				case(_) { userDatabase };
			};
			*/
		}
		else {
			if(hasAccess(?msg.caller)) {
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
		if(hasAccess(?msg.caller)) {
			//is this a valid group id?
			if(Nat.greater(chat.toGroup, 0)) {
				recipientId := chat.toGroup;
			};	
			var newChat : ChatMessage = {
				from = msg.caller;
				toGroup = recipientId;
				body = chat.body;
				timestamp = Time.now();
			};
			//the chatId is basically a counter
			var chatId = chatDatabase.size();
			chatDatabase := Array.append(chatDatabase, [newChat]);
			return chatId;
		}
		else {
			0
		}
	};

	public shared(msg) func getLatestDirectChats(timestamp : Timestamp) : async [ChatMessage] {
		if(hasAccess(?msg.caller)) {
			//get user's 'counter' from principal
			var user : UserRecord = Option.unwrap(getUserRecord(?msg.caller));
			var counter : Count = user.counter;

			//use counter to get all chats for the user
			func filterChatsByUser(chat : ChatMessage): Bool { chat.toGroup == counter };
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

	public shared(msg) func getLatestGroupChats(timestamp : Timestamp) : async [ChatMessage] {
		if(hasAccess(?msg.caller)) {
			//get user's groups
			var groupsOfUser : [GroupId] = getAllGroupsOfUser(?msg.caller);

			//foreach group, get all messages
			var usersChats : [ChatMessage] = [];
			for(group in Iter.fromArray<GroupId>(groupsOfUser)) {
				func filterChatsByGroup(chat : ChatMessage): Bool { chat.toGroup == group };
				var groupChats : [ChatMessage] = Array.filter<ChatMessage>(chatDatabase, filterChatsByGroup);
				usersChats := Array.append<ChatMessage>(usersChats, groupChats);
			};

			//filter chats with higher timestamp
			func chatsAfterTimestamp(chat : ChatMessage) : Bool { Int.greater(chat.timestamp, timestamp)};
			var latestChats : [ChatMessage] = Array.filter<ChatMessage>(usersChats, chatsAfterTimestamp);
			return latestChats;	
		}
		else {
			[]
		}
	};

	public shared(msg) func createGroup(name : Text) : async Nat {
		//check name is a valid string
		var nameArray = Iter.toArray<Char>(name.chars());
		if(nameArray.size() > 1) {
			//check if group name already used
			func checkName(grp : UserGroup) : Bool { grp.name == name };
			var existing = Array.find<UserGroup>(groupDatabase, checkName);
			switch(existing) {
				case(null) {
					//create group
					var newGroup : UserGroup = {
						creator = ?msg.caller;
						groupId = groupDatabase.size();
						name = name;
					};
					groupDatabase := Array.append<UserGroup>(groupDatabase, [newGroup]);
					groupDatabase.size()
				};
				case(_) { 0 };
			}
		}	
		else {
			0
		}
	};

	func getAllGroupsOfUser(user : UserId) : [GroupId] {
		func isMember(ug : UserGroupEntry) : Bool { ug.userId == user };
		var list : [UserGroupEntry] = Array.filter<UserGroupEntry>(usersGroupsDatabase, isMember);

		func filterGroup(i : Nat) : GroupId { list[i].groupId };
		var listOfGroups : [GroupId] = Array.tabulate<GroupId>(list.size(), filterGroup);
		return listOfGroups;
	};

	public shared(msg) func joinGroup(groupId : GroupId): async Bool {
		//check if user already in group
		var groupsOfUser : [GroupId] = getAllGroupsOfUser(?msg.caller);
		func isMember(gid : GroupId) : Bool { gid == groupId};
		switch(Array.find<GroupId>(groupsOfUser, isMember)) {
			//if not, join the group
			case(null) {
				var newEntry = {
					groupId = groupId;
					userId = ?msg.caller;
				};
				usersGroupsDatabase := Array.append<UserGroupEntry>(usersGroupsDatabase, [newEntry]);
				true
			};
			case(_) {
				false
			}
		}	
	};

	public shared(msg) func getMyRecord(name : Text) : async UserRecord {
		var record : UserRecord = {
			callerId = ?msg.caller;
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
			if(isRegistered(?msg.caller)) {
				record := Option.get<UserRecord>(getUserRecord(?msg.caller), record);
			};
		};
		return record;
	};

	public shared(msg) func connect(userId: UserId): async () {
		graph.addEdge(msg.caller, Option.unwrap<Principal>(userId));
	};

	public shared(msg) func getConnections(name : Text): async [UserRecord] {
			Console.print(debug_show("GET CONNECTIONS CALLED WITH:", name));
		var nameArray = Iter.toArray<Char>(name.chars());
		var record : UserRecord = {
			callerId = ?msg.caller;
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
			return getUserConnections(?msg.caller);
		}
    };

	func getUserConnections(userId: UserId) : [UserRecord] {
		var connectionList : [UserRecord] = [];
    	var connections : [Vertex] = graph.getAdjacent(Option.unwrap<Principal>(userId));
		var i = 0;

		if(connections.size() > 0) {
			while(i < connections.size()) {
				for(user in Iter.fromArray<UserRecord>(userDatabase)) {
					if(connections[i] == Option.unwrap<Principal>(user.callerId)) {
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
