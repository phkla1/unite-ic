import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {

	public type ContactField = Text;
	public type Count = Nat;
	public type GroupId = Nat;
	public type Timestamp = Time.Time;
	public type UserId = ?Principal ;
	public type Vertex = Principal;
	public type OrderList = [Nat];

  	public type UserRecord = {
		callerId : UserId;
		timestamp : Timestamp;
		counter : Count;
		firstname : ContactField;
		surname : ContactField;
		phone : ContactField;
	};

	public type RegistrationResponse = {
		principal : UserId;
		timestamp : Timestamp;
		message : UserRecord;
	};

	public type UserRecordAddendum = {
		firstname : ContactField;
		surname : ContactField;
		phone : ContactField;	
	};

	public type ChatMessage = {
		from : Principal;
		toGroup	: Count;
		body : Text;
		timestamp : Timestamp;
	};

	public type UserGroup = {
		creator : UserId;
		groupId : GroupId;
		name : Text;
	};

	public type UserGroupEntry = {
		groupId : GroupId;
		userId : UserId;
	};

	public type Deal = {
		dealId : Nat;
		dealBanner : Text;
		productName : Text;
		productDescription: Text;
		dealDescription : Text;
		sellerLocality : Text;
		unit : Text;
		unitPrice : Nat;
		retailPrice : Nat;
		dealTargetUnits : Nat;
		deadline : Int;
		totalInventoryBalance : Nat;
		sellerName : Text;
	};

	public type Team = {
		teamId : Nat;
		creator : Text;
		orders : OrderList;
	};

	public type Order = {
		dealId : Nat;
		orderId : Nat;
		teamId : Nat;
		user : Text;
		units : Nat;
		orderType : Text;
	};
/*
    public type HeaderField = (Text, Text);

    public type HttpRequest = {
        method: Text;
        url: Text;
        headers: [HeaderField];
        body: Blob;
    };

    public type HttpResponse = {
        status_code: Nat16;
        headers: [HeaderField];
        body: Blob;
    };
*/
}