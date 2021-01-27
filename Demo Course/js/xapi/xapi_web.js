


// Create Base64 Object
// var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

/*-------------------------------------------- varibales set in config.json file  ---------------------------------------------------------------*/



var authkey = "Basic " + btoa(lrsData.authkey);
var endpoint = lrsData.endpoint;
var theLaunchURL = lrsData.theLaunchURL;
var activityID = lrsData.activityID;

var email = getQueryVariable("email");
console.log("email fron xapi : " +  email);
var name = getQueryVariable("name");


/*------------------------------------------------------------------------------------------------------------------------------*/

/* 
* use to launch an xAPI course from a URL
* email (string) - email address of the user. This is assuming that a email is used for the agent and not an ID
* name (string)  - used as the name to support the agent
*/

function launchXAPICourse(email,name) {

  var auth = authkey;
  var launchUrl = "";
    
  launchUrl = theLaunchURL; 
  launchUrl += getURLQS() + 'email='+email;
  launchUrl +='&name='+name;
  
  
  
  window.location = launchUrl;

}


// xAPI Statements - don't touch this or anything below here :) !
/*
* Builds and sends the xAPI Statement to the LRS
* verb (String) - from the select list of verbs set out in xapi_adl.js
* activitytype (String) - from the list in xapi_actvitytype.js
* shortdesc (String) - Short description of expirience
* longdesc (String) - A more detailed description of expirence
* showresult (bool) - include the result 
* completion (bool) - sets the completion of the result object **must be used if showresult is true**
* success (bool) - sets the success of the result object **must be used if showresult is true**
* score (int) - sets the raw score of the result **must be used if showresult is true**
* response (string) - the answer the to question **must be used if showresult is true**
*
*/
function xapistatement(verb,activitytype,shortdesc,longdesc,showresult,completion,success,score,response) { 
console.log("xAPI called");
//This gets the player object from Articulate so we can get any of the variables we set
var player = "Sudo Player";	
//get the StoryLine object to get any variables 	
var slideNumber = "0";
var activityid ="";
	try{
		slideNumber = player.GetVar("currentSlide");
	}catch(error){}

	
//Build the Activity ID from the Slide Numbers. This is based on having the currentSlide Variable set. This also includes
//the short description
var uActivityid = activityID;
activityid = uActivityid+'?slide='+slideNumber+"&ac="+shortdesc.replace(/ /g,"+");

	


//Start building the statement		
var stmt= {};

//Build the Actor and add to the statement. This can be an mbox or the an account

stmt.actor = {
	
'mbox': 'mailto:'+ email,
'name': decodeURI(name)
};

var setDuration = false;
if(shortdesc ==='next'){ shortdesc = getNextSlide(); setDuration = true;}
if(shortdesc ==='prev'){shortdesc = getPrevSlide(); setDuration = true;}
	

//Build the Activity Object
stmt.object = {};
stmt.object.id = activityid;
stmt.object.objectType= "Activity";
stmt.object.definition={};
stmt.object.definition.name= {'en-US':shortdesc};
stmt.object.definition.description= {'en-US':longdesc};	
stmt.object.definition.type = ADL.activitytype[activitytype.toLowerCase()];	

	
/*
 * This is very customised and is based on checking if the Next or Prev Button is pressed
 * This is set based on setDuration which is set when the Activity name is set
*/	
if(setDuration){
	stmt.object.definition.extensions={
	"http://id.tincanapi.com/extension/duration":{
		"name": {
        "en-US": "duration"
    	},
		"description": {
			"en-US": ISO8601_time()
		}
		
	  }};
}
	

//Build the Verb 
stmt.verb=ADL.verbs[verb.toLowerCase()];


//Build the context
stmt.context = {};
stmt.context.contextActivities={};	
//Add any extensions

stmt.context.extensions= {
	//We want to know the browser that the user is using, so we'll capture this too
	"http://id.tincanapi.com/extension/browser-info":{
		"name": {
        "en-US": "browser information"
    	},
		"description": {
			"code_name": navigator.appCodeName,
			"name": GetBrowser(),
			"version": navigator.appVersion,
			"platform": navigator.platform,
			"user-agent-header": navigator.userAgent,
			"cookies-enabled": navigator.cookieEnabled		
		}
	
	}
};

//Set the version of the SCORM package we're using. Set this in a SL variable called version which
//is part of the eLearning SL configuration
	

stmt.context.contextActivities.category={};
stmt.context.contextActivities.category.id  = activityID;
stmt.context.contextActivities.category.definition={};
stmt.context.contextActivities.category.definition.type = "http://id.tincanapi.com/activitytype/source";
	

stmt.context.registration = generateUUID();
stmt.context.language = "en";

stmt.context.contextActivities.parent={};
stmt.context.contextActivities.parent.id = activityid;
stmt.context.contextActivities.parent.objectType= "Activity";
stmt.context.contextActivities.parent.definition={};
stmt.context.contextActivities.parent.definition.type=ADL.activitytype[activitytype.toLowerCase()];

stmt.context.contextActivities.grouping={};                
stmt.context.contextActivities.grouping.id = uActivityid;
stmt.context.contextActivities.grouping.objectType  ='Activity';
	
	
	
//Build the result if set to true	
if(showresult ===true){

//We will also add the context as it's a question	

	//Calculate duration. This is based on the variable SlideTimeStart being set with the a Date.getTime() on each slide
	
	
	//Now add the result
	stmt.result = {
    "completion": completion,
    "success": success,
	"response": response,
	"duration": ISO8601_time(),
    "score": {
      "scaled": 0,
		"max":100,
		"min":0,
		"raw": (success ? 1 : 0)
    },
	"extensions":{
		
	}
	};
}
	

	
//Now build the reamianins parts of the statement before sending	
  var randomString = generateUUID();

  var request = new XMLHttpRequest();

  request.open('PUT', endpoint+"statements?statementId="+randomString);

  request.setRequestHeader('Content-Type', 'application/json');

  request.setRequestHeader('X-Experience-API-Version','1.0.0');

  request.setRequestHeader('Authorization',authkey);

  var body = stmt;

   console.log(stmt);
  request.send(JSON.stringify(body));     

}


/****************** Helper functions************************/

function viewxAPIStatements(){
	
	window.open('view_my_statements.html?email='+email);
	
	
}

function getQueryVariable(variable) {

  var query = window.location.search.substring(1);
	console.log(query);
  var vars = query.split('&');
  console.log(vars);
  for (var i=0;i<vars.length;i++) {

    var pair = vars[i].split('=');

    if (pair[0] == variable) {

      return pair[1];

    }

  }

  return false;

}


function generateUUID() {

  var d = new Date().getTime();

  if (window.performance && typeof window.performance.now === 'function') {

    d += performance.now(); // Use high-precision timer if available

  }

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

    var r = (d + Math.random()*16)%16 | 0;

    d = Math.floor(d / 16);

    return (c=='x' ? r : (r&0x3|0x8)).toString(16);

  });

  return uuid;

}


function ISO8601_time(){
	//Duration must be set in ISO_8601 format. So 25 seconds would be P25S
	var player = "Sudo Player";//GetPlayer();	
	var DateTime = new Date();
	var currentTime = DateTime.getTime();	
	
	
	return "PT"+Math.round((currentTime /1000) - (player.GetVar("SlideTimeStart") / 1000))+"S";
	
	
}

function getURLQS(){
	
	var url = window.location.href;
	if(window.location.search ===''){
		return "?";
	}
	else{
		return "&";
	}
	
}


/* These 2 functions are used to calculate the Next and previous slide numbers
 * To add to the Activity Desription
 */
function getNextSlide(){

	var player = "Sudo Player";//GetPlayer();	
	var slideNumber = "0";
	var totalSlides = "3";
	try{
	totalSlides = player.GetVar("totalSlide");
	slideNumber = player.GetVar("currentSlide");
	}catch(error){}
		
	if(slideNumber <= totalSlides){
		return "Advanced to slide "+ ++slideNumber;
	}else{

		return "Advanced to slide "+ totalSlides;
	}
	
	
}
function getPrevSlide(){
	
	var player = "Sudo Player";//GetPlayer();	
	var slideNumber = "0";
	var totalSlides = "3";
	try{
	totalSlides = player.GetVar("totalSlide");
	slideNumber = player.GetVar("currentSlide");
	}catch(error){}

	if(slideNumber >= 1 ){
		return "Returned to slide "+ --slideNumber;
	}else{

		return "Returned to slide 1";
	}
	
	
	
}


function GetBrowser()
{
    var _browser = "";
	var isIE  = false;
	// Opera 8.0+
   
    // Internet Explorer 6-11
    if(/*@cc_on!@*/false || !!document.documentMode){
		_browser = "Internet Explorer";
		isIE = true;
	}
 	
    // Edge 20+
    if(!isIE && !!window.StyleMedia){
		_browser = "Edge";
	}

    // Chrome 1+
    if(!!window.chrome && !!window.chrome.webstore){
		_browser = "Chrome";
	}

    if(/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification)){
		_browser  ="Safari";
		
	}
	return _browser;
}


