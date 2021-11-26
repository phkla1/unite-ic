export interface UserRecord {
	callerId : string,
	timestamp : number,
	counter : number,
	firstname : string,
	surname : string,
	phone : string,	
}

export interface Deal {
	dealId : number,
	dealBanner : string,
	productName : string,
	productDescription: string,
	dealDescription : string,
	sellerLocality : string,
	unit : string,
	unitPrice : number,
	retailPrice : number,
	dealTargetUnits : number,
	deadline : number,
	totalInventoryBalance : number,
	sellerName : string
};

export interface Order {
	dealId : number,
	orderId : number,
	teamId : number,
	user : string,
	units : number,
	orderType : string
};

export interface Team {
	teamId : number,
	creator : string,
	orders : number[]
};

export interface ChatMessage {
	from : string,
	toGroup	: number,
	body : number,
	timestamp : number
}