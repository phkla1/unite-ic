import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {

	type ContactField = Text;
	public type Count = Nat;
	public type Timestamp = Time.Time;
	public type UserId = Principal;

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
	}

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