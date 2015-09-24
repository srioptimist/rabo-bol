'use strict';

// App libraries
angular.module('oauth', [
  'oauth.directive',      // login directive
  'oauth.accessToken',    // access token service
  'oauth.endpoint',       // oauth endpoint service
  'oauth.profile',        // profile model
  'oauth.storage',        // storage
  'oauth.interceptor'     // bearer token interceptor
])
  .config(['$locationProvider','$httpProvider',
  function($locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('ExpiredInterceptor');
  }]);


var app = angular.module('app', ['oauth']);

angular.module('app').config(function($locationProvider) {
  $locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	}).hashPrefix('!');
});

angular.module('app').controller("openApiController",['$scope','$http','$location','AccessToken','Storage',function($scope,$http,$location,AccessToken,Storage) {
	
	$scope.load_data = function(){
//https://api.bol.com/catalog/v4/lists?apikey=DE29770CFA144BA79FFEAC24002E1D66&type=toplist_default
		
		//$http.get("rest/books")
		
		$scope.topSellers = JSON.stringify(xml2json('<?xml version="1.0" encoding="UTF-8"?><rpy:GetAccountEntries_Rpy xmlns:rpy="http://schemas.rabobank.nl/cs/oiv/GetAccountEntries/1/Rpy" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.rabobank.nl/cs/oiv/GetAccountEntries/1/Rpy GetAccountEntries_1_RPY.xsd "><rpy:Error><rpy:ErrorCode>OIV_FL_0001</rpy:ErrorCode></rpy:Error></rpy:GetAccountEntries_Rpy>'));
		
		
		
		/*$http.get("https://api.bol.com/catalog/v4/lists?apikey=DE29770CFA144BA79FFEAC24002E1D66&type=toplist_default",{ headers: headersForBol() })
	    .success(
	    			function(response) {
	    				$scope.topSellers = JSON.stringify(xmlToJson(response));
	    			}
	    ).error( function(data, status){
	    }
	    		);*/
	};
	
	$scope.transfer = {
			    "Amount": 0,
			    "Currency": "EUR",
			    "FromAccount": "",
			    "BeneficiaryAccount": "",
			    "BeneficiaryName": "",
			    "ExecutionDate": "09-09-2015",
			    "Description": "",
			    "Urgent": true
			};
	
	$scope.selectedBook = {
		    "Amount": 0,
		    "Currency": "EUR",
		    "FromAccount": "",
		    "BeneficiaryAccount": "NL43RABO0115701468",
		    "BeneficiaryName": "Chrissie",
		    "ExecutionDate": "",
		    "Description": "From RABO-BOL",
		    "Urgent": true
		};
	
	$scope.transactionKey = "";
	
	$scope.transactions = [];
	$scope.raboTransactions = [];
	
	$scope.validatetransfer = {
			"transactionkey":"TX123",
			"tincode" : ""
	};
	
	$scope.accounts = [];
	$scope.showAddress = false;
	$scope.showValidate = false;
	$scope.showResult = false;
	$scope.showBooks = true;
	$scope.addressess = [];
	$scope.searched = false;
	$scope.balanceview = null;
	$scope.selectedProduct = null;
	
	$scope.isShoppingAllowed = false;

	$scope.getNumberOfTransactions = function(){
		$scope.validatetransfer.noOfTransactions = Math.floor( $scope.selectedProduct.OfferData.Offers[0].Price / $scope.validatetransfer.emiAmount)+1;
	}
	
	$scope.goShopping = function(){
			$scope.isShoppingAllowed = true;
		}


$scope.showEmiDetail = function(){
	return $scope.showEmiPage && $scope.validatetransfer.noOfTransactions > 1;
	}
	
	$scope.showEmiPage = function(){
	return $scope.validatetransfer.emiNeeded;
	}
	
	$scope.isEmiAmountEntered = function(){
		return $scope.validatetransfer.emiAmount > 0;
	}
	$scope.authorized = function(){
		return Storage.get('token');
		//return true;
	};
	
	$scope.fetchTopSellers = function(){
		//https://api.bol.com/catalog/v4/lists?apikey=DE29770CFA144BA79FFEAC24002E1D66&type=toplist_default
		
		//$http.get("rest/books")
		$http.get("https://api.bol.com/catalog/v4/lists?apikey=DE29770CFA144BA79FFEAC24002E1D66&type=toplist_default",{ headers: headersForBol() })
	    .success(
	    			function(response) {
	    				$scope.topSellers = JSON.stringify(xmlToJson(response));;
	    			}
	    ).error( function(data, status){
	    }
	    		);
		
		
		
	};
	
	function xml2json(xml, tab) {
		   var X = {
		      toObj: function(xml) {
		         var o = {};
		         if (xml.nodeType==1) {   // element node ..
		            if (xml.attributes.length)   // element with attributes  ..
		               for (var i=0; i<xml.attributes.length; i++)
		                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
		            if (xml.firstChild) { // element has child nodes ..
		               var textChild=0, cdataChild=0, hasElementChild=false;
		               for (var n=xml.firstChild; n; n=n.nextSibling) {
		                  if (n.nodeType==1) hasElementChild = true;
		                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
		                  else if (n.nodeType==4) cdataChild++; // cdata section node
		               }
		               if (hasElementChild) {
		                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
		                     X.removeWhite(xml);
		                     for (var n=xml.firstChild; n; n=n.nextSibling) {
		                        if (n.nodeType == 3)  // text node
		                           o["#text"] = X.escape(n.nodeValue);
		                        else if (n.nodeType == 4)  // cdata node
		                           o["#cdata"] = X.escape(n.nodeValue);
		                        else if (o[n.nodeName]) {  // multiple occurence of element ..
		                           if (o[n.nodeName] instanceof Array)
		                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
		                           else
		                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
		                        }
		                        else  // first occurence of element..
		                           o[n.nodeName] = X.toObj(n);
		                     }
		                  }
		                  else { // mixed content
		                     if (!xml.attributes.length)
		                        o = X.escape(X.innerXml(xml));
		                     else
		                        o["#text"] = X.escape(X.innerXml(xml));
		                  }
		               }
		               else if (textChild) { // pure text
		                  if (!xml.attributes.length)
		                     o = X.escape(X.innerXml(xml));
		                  else
		                     o["#text"] = X.escape(X.innerXml(xml));
		               }
		               else if (cdataChild) { // cdata
		                  if (cdataChild > 1)
		                     o = X.escape(X.innerXml(xml));
		                  else
		                     for (var n=xml.firstChild; n; n=n.nextSibling)
		                        o["#cdata"] = X.escape(n.nodeValue);
		               }
		            }
		            if (!xml.attributes.length && !xml.firstChild) o = null;
		         }
		         else if (xml.nodeType==9) { // document.node
		            o = X.toObj(xml.documentElement);
		         }
		         else
		            alert("unhandled node type: " + xml.nodeType);
		         return o;
		      },
		      toJson: function(o, name, ind) {
		         var json = name ? ("\""+name+"\"") : "";
		         if (o instanceof Array) {
		            for (var i=0,n=o.length; i<n; i++)
		               o[i] = X.toJson(o[i], "", ind+"\t");
		            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
		         }
		         else if (o == null)
		            json += (name&&":") + "null";
		         else if (typeof(o) == "object") {
		            var arr = [];
		            for (var m in o)
		               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
		            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
		         }
		         else if (typeof(o) == "string")
		            json += (name&&":") + "\"" + o.toString() + "\"";
		         else
		            json += (name&&":") + o.toString();
		         return json;
		      },
		      innerXml: function(node) {
		         var s = ""
		         if ("innerHTML" in node)
		            s = node.innerHTML;
		         else {
		            var asXml = function(n) {
		               var s = "";
		               if (n.nodeType == 1) {
		                  s += "<" + n.nodeName;
		                  for (var i=0; i<n.attributes.length;i++)
		                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
		                  if (n.firstChild) {
		                     s += ">";
		                     for (var c=n.firstChild; c; c=c.nextSibling)
		                        s += asXml(c);
		                     s += "</"+n.nodeName+">";
		                  }
		                  else
		                     s += "/>";
		               }
		               else if (n.nodeType == 3)
		                  s += n.nodeValue;
		               else if (n.nodeType == 4)
		                  s += "<![CDATA[" + n.nodeValue + "]]>";
		               return s;
		            };
		            for (var c=node.firstChild; c; c=c.nextSibling)
		               s += asXml(c);
		         }
		         return s;
		      },
		      escape: function(txt) {
		         return txt.replace(/[\\]/g, "\\\\")
		                   .replace(/[\"]/g, '\\"')
		                   .replace(/[\n]/g, '\\n')
		                   .replace(/[\r]/g, '\\r');
		      },
		      removeWhite: function(e) {
		         e.normalize();
		         for (var n = e.firstChild; n; ) {
		            if (n.nodeType == 3) {  // text node
		               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
		                  var nxt = n.nextSibling;
		                  e.removeChild(n);
		                  n = nxt;
		               }
		               else
		                  n = n.nextSibling;
		            }
		            else if (n.nodeType == 1) {  // element node
		               X.removeWhite(n);
		               n = n.nextSibling;
		            }
		            else                      // any other node
		               n = n.nextSibling;
		         }
		         return e;
		      }
		   };
		   if (xml.nodeType == 9) // document node
		      xml = xml.documentElement;
		   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
		   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
		}
	
	
	
	var headers = function() {
	    return { Authorization: 'Bearer ' + AccessToken.get().access_token };
	  };
	  
	  var headersForBol = function() {
		    return {"Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Headers': '*'};
		  };
	  
	var getdate = function() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd;
		} 

		if(mm<10) {
		    mm='0'+mm;
		} 

		today = dd+'-'+mm+'-'+yyyy;
		return today;
	}
	
	var getTodaydate = function() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd;
		} 

		if(mm<10) {
		    mm='0'+mm;
		} 

		today = mm+'-'+dd+'-'+yyyy;
		return today;
	}
	
	var getYest5date = function() {
		var today = new Date();
		var dd = today.getDate()-5;
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd;
		} 

		if(mm<10) {
		    mm='0'+mm;
		} 

		today = mm+'-'+dd+'-'+yyyy;
		return today;
	}
	
	$scope.getTransactions = {
			  "productNumber":"",
			  "currency": "EUR",
			  "numberOfTransactions": 100,
			  "fromDate": getYest5date()
			};
	
	
	$scope.fetchBanks = function(city){		
		var apiUrlToGetBanks = "https://hackaton.eu-gb.mybluemix.net:443/api/banks/"+city+"?api_key=10ef45cc";
		$http.get(apiUrlToGetBanks)
		    .success(
		    			function(response) {
		    				$scope.banks = response;
		    			}
		    ).error( function(data, status){
		    }
		    		);
	};

	$scope.fetchAddressBook = function(){		
		
		
		$http.get("https://hackaton.eu-gb.mybluemix.net:443/api/addressbook?api_key=10ef45cc",{ headers: headers() })
		    .success(
		    			function(response) {
		    				$scope.addressess = response;
		    				$scope.showAddress = true;
		    			}
		    ).error( function(data, status){
		    }
		    		);
	};
	
	  $scope.getBooks = function(keyWord){
		  var apiUrlToGetBooks = "rest/books/"+keyWord;
		  $http.get(apiUrlToGetBooks)
		    .success(
		    			function(response) {
		    				$scope.books = response;
		    			}
		    ).error( function(data, status){
		    }
		    		);
		  
		  $http.get("https://hackaton.eu-gb.mybluemix.net:443/api/products?api_key=10ef45cc",{ headers: headers() })
		    .success(
		    			function(response) {
		    				$scope.accounts = response.ConfiguredAccounts.Account;
		    			}
		    ).error( function(data, status){
		    }
		    		);
		  
		  $http.get("https://hackaton.eu-gb.mybluemix.net:443/api/addressbook?api_key=10ef45cc",{ headers: headers() })
		    .success(
		    			function(response) {
		    				$scope.addressess = response;
		    			}
		    ).error( function(data, status){
		    }
		    		);
		  
		  $http.get("https://hackaton.eu-gb.mybluemix.net:443/api/balanceview?api_key=10ef45cc",{ headers: headers() })
		    .success(
		    			function(response) {
		    				$scope.balanceview = response;
		    				$scope.searched = true;
		    			}
		    ).error( function(data, status){
		    }
		    		);
	  };
	  
	  $scope.fetchAccounts = function(){		
			
			
			$http.get("https://hackaton.eu-gb.mybluemix.net:443/api/products?api_key=10ef45cc",{ headers: headers() })
			    .success(
			    			function(response) {
			    				$scope.accounts = response.ConfiguredAccounts.Account;
			    			}
			    ).error( function(data, status){
			    }
			    		);
		};
		
	  
	  $scope.pay = function(product){
		  $http.get("https://hackaton.eu-gb.mybluemix.net:443/api/addressbook?api_key=10ef45cc",{ headers: headers() })
		    .success(
		    			function(response) {
		    				$scope.addressess = response;
		    				$scope.showAddress = true;
		    				 $http.get("https://hackaton.eu-gb.mybluemix.net:443/api/products?api_key=10ef45cc",{ headers: headers() })
		    				    .success(
		    				    			function(response) {
		    				    				$scope.accounts = response.ConfiguredAccounts.Account;
		    				    				
		    				    				var amount= product.OfferData.Offers[0].Price;
		    				    				  
		    				    				  $scope.selectedProduct = product;
		    				    				  
		    				    				  for (var i = 0; i < $scope.accounts.length; i++) {
		    				    					if($scope.accounts[i].name == 'Current account') {
		    				    						 $scope.selectedBook.FromAccount = $scope.accounts[i].iban;
		    				    						 $scope.getTransactions.productNumber = $scope.accounts[i].number;
		    				    					}
		    				    				}
		    				    				  
		    				    				  $scope.selectedBook.Amount = amount;
		    				    				  $scope.selectedBook.BeneficiaryAccount = $scope.addressess[1].iban_payment;
		    				    				  $scope.selectedBook.BeneficiaryName = $scope.addressess[1].username;
		    				    				  $scope.selectedBook.ExecutionDate = getdate();
		    				    				  $scope.selectedBook.Description = product.Title + "From RABO-BOL";
		    				    				  
		    				    				  var req = {
		    				    							 method: 'POST',
		    				    							 url: 'https://hackaton.eu-gb.mybluemix.net:443/api/transfer?api_key=10ef45cc',
		    				    							 headers: {
		    				    							   'Content-Type': 'application/json', 
		    				    							   'Authorization': 'Bearer ' + AccessToken.get().access_token
		    				    							 },
		    				    							 data:  $scope.selectedBook 
		    				    							}
		    				    					
		    				    					
		    				    					$http(req).
		    				    					  then(function(response) {
		    				    						  	$scope.transactionKey = response.data.transactionkey;
		    				    						  	$scope.showValidate = true;
		    				    						  	$scope.showBooks = false;
		    				    						  }, function(response) {
		    				    							  alert(response.data.errors[0].message);
		    				    							  //$scope.showValidate = true;
		    				    						  });
		    				    			}
		    				    ).error( function(data, status){
		    				    }
		    				    		);
		    				    			}
		    				    ).error( function(data, status){
		    				    }
		    				    		);
		    				 
		 
	  };
	  
	
		
	$scope.setClickedRow = function(index) {
		$scope.transfer.BeneficiaryName = $scope.addressess[index].username;
		$scope.transfer.BeneficiaryAccount = $scope.addressess[index].iban_payment;
		$scope.showAddress = false;
	}
	
	$scope.postTransfer = function(){	
		var req = {
				 method: 'POST',
				 url: 'https://hackaton.eu-gb.mybluemix.net:443/api/transfer?api_key=10ef45cc',
				 headers: {
				   'Content-Type': 'application/json', 
				   'Authorization': 'Bearer ' + AccessToken.get().access_token
				 },
				 data:  $scope.transfer 
				}
		
		
		$http(req).
		  then(function(response) {
			  	$scope.transactionKey = response.data.transactionkey;
			  	$scope.showValidate = true;
			  }, function(response) {
				  alert(response.data.errors[0].message);
				  //$scope.showValidate = true;
			  });
	};
	
	$scope.showResultScreen = function() {
		return $scope.showResult;
	}
	
	$scope.hasenoughBalance = function() {
		return $scope.searched;
	}
	
	$scope.showSearch = function (){
		
		$scope.showValidate = false;
		  $scope.showBooks = true;
		  $scope.books = null;
		  $scope.showResult = false;
	}
	
	$scope.completeTransfer = function(){	
		$scope.validatetransfer.transactionkey= $scope.transactionKey;
		var req = {
				 method: 'PUT',
				 url: 'https://hackaton.eu-gb.mybluemix.net:443/api/transfer?api_key=10ef45cc',
				 headers: {
				   'Content-Type': 'application/json', 
				   'Authorization': 'Bearer ' + AccessToken.get().access_token
				 },
				 data:  $scope.validatetransfer 
				}
		
		
		$http(req).
		  then(function(response) {
			  $scope.showValidate = false;
			  $scope.showBooks = false;
			  
			  $http.get("https://hackaton.eu-gb.mybluemix.net:443/api/balanceview?api_key=10ef45cc",{ headers: headers() })
			    .success(
			    			function(response) {
			    				$scope.balanceview = response;
			    				$scope.searched = true;
			    			}
			    ).error( function(data, status){
			    }
			    		);
			  
			  $http.get("https://hackaton.eu-gb.mybluemix.net:443/api/transaction/latest?api_key=10ef45cc",{ headers: headers() })
			    .success(
			    			function(response) {
			    				$scope.transactions = response;
							  	var  j =0;
							  	for (var i = 0; i < $scope.transactions.length; i++) {
							  		if($scope.transactions[i].transactionDescription.indexOf("From RABO-BOL") > -1){
							  			$scope.raboTransactions[j]=$scope.transactions[i];
							  			j++;
							  		}
							  	}
							  	
							  	for (var x = 0; x < $scope.raboTransactions.length; x++) {
							  		$scope.raboTransactions[x].transactionDescription=$scope.transactions[x].transactionDescription.replace(/From RABO-BOL/g, '');;
							  	}
			    			}
			    ).error( function(data, status){
			    	alert(response.data.errors[0].message);
			    }
			    		);
			  
			  $scope.showResult = true;
			  }, function(response) {
				  alert(response.data.errors[0].message);
			  });
	};
	
}]);


