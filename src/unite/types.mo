import Time "mo:base/Time";

module {

  	public type UserRecord = {
		callerId : Principal;
		timestamp : Time.Time;
		counter : Nat;
	};

	public type RegistrationResponse = {
		principal : Text;
		timestamp : Time.Time;
		message : Int;
		deleteThis : Nat;
	};

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

}