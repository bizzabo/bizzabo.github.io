var BZAPI = (function() {

    // Config ----------------------------------------
    var configObj = CONFIG[ENV];
    var BASEAPI = "/api/v1/";
    var LOCAL_EASYXDM = "easyXDM/";
    var REMOTE_EASYXDM = configObj.SERVER_URL + "/static/scripts/easyXDM/";

    // Easy XDM bootstrap

    var xhr = new easyXDM.Rpc({
        local : LOCAL_EASYXDM + "name.html",
        swf : REMOTE_EASYXDM + "easyxdm.swf",
        remote : REMOTE_EASYXDM + "cors/",
        remoteHelper : REMOTE_EASYXDM + "name.html"
    }, {
        remote : {
            request : {}
        }
    });

    // Bizzabo Error Codes ----------------------------------------

    var errorCodes = {
        General : 0,
        RequestCancelled : 1,
        ContentValidationError : 4000,
        MissingContent : 4001, // Not all required content for the API call was supplied
        APIVersion : 4002, // The API version reported by the client is no longer supported
        NoSuchUser : 4010, // Unknown user tried to sign in
        InvalidTokens : 4011, // The access tokens are invalid (or missing)
        EmailNotValidated : 4012, // The user did not validate his email address yet
        NotAuthorized : 4013, // The user is not authorized to make this request
        NeedAdditionalAuth : 4014, // Resource requires additional authorization
        NotOrganizer : 4030, // Attempt to get an organizer Event by a Person that is not the organizer
        EntityExists : 4090, // Entity exist
        UserExists : 4091, // Existing user tried to sign up again
        EmailExists : 4092, // The email used for sign up is already in use by another user
        TargetNotInRSVP : 4094, // The other person is not RSVPd
        NoSpotsLeft : 4096, // The offer has no spots left
        OfferExpired : 4097, // The offer has expired
        ServerError : 5000, // Unspecified server error
        NotImplementedError : 5010  // This API is not implemented yet
    };

    // HTTP Headers

    var headersJSON = {
        "Content-Type" : "application/json",
        "Accept" : "application/json"
    };

    var buildHeaders = function() {
        return headersJSON;
    };

    var genericErrorHandler = function(rpcdata, failureFn) {
        if (failureFn) {
            var errorCode;
            try {
                var errorData = JSON.parse(rpcdata.data.data);
                errorCode = errorData.error['error-code'];
            } catch (err) {
                errorCode = 0;
            }
            failureFn(errorCode);
        }
    };

    // API methods ----------------------------------------

    // Misc Actions ----------------------------------------

    var validateEmail = function(c1, c2, successFn, failureFn) {
        xhr.request({
            url : BASEAPI + "auth/email/" + c2 + "/" + c1,
            method : "POST",
            headers : buildHeaders()
        }, function() {
            if (successFn) {
                successFn({});
            }
        }, function(rpcdata) {
            genericErrorHandler(rpcdata, failureFn);
        });
    };

    var legacyUnsubscribeEmail = function(c1, successFn, failureFn) {
        xhr.request({
            url : BASEAPI + "auth/unsubscribe/" + c1,
            method : "POST",
            headers : buildHeaders()
        }, function() {
            if (successFn) {
                successFn({});
            }
        }, function(rpcdata) {
            genericErrorHandler(rpcdata, failureFn);
        });
    };

    var unsubscribeEmail = function(hash, successFn, failureFn) {
        xhr.request({
            url : BASEAPI + "accounts/unsubscribe/" + hash,
            method : "POST",
            headers : buildHeaders()
        }, function() {
            if (successFn) {
                successFn({});
            }
        }, function(rpcdata) {
            genericErrorHandler(rpcdata, failureFn);
        });
    };

    var authorizeUserForPrivateEvent = function(eventId, hash, successFn, failureFn) {
        xhr.request({
            url : BASEAPI + "organizer/event/" + eventId + "/auth",
            method : "POST",
            data: {
                hash: hash
            },
            headers : buildHeaders()
        }, function() {
            if (successFn) {
                successFn({});
            }
        }, function(rpcdata) {
            genericErrorHandler(rpcdata, failureFn);
        });
    };

    var resendTickets = function(email, successFn, failureFn) {
        xhr.request({
            url : BASEAPI + "person/tickets?email=" + email,
            method : "GET",
            headers : buildHeaders()
        }, function() {
            if (successFn) {
                successFn({});
            }
        }, function(rpcdata) {
            genericErrorHandler(rpcdata, failureFn);
        });
    };

    // Public object ----------------------------------------

    return {
        errorCodes : errorCodes,
        validateEmail : validateEmail,
        legacyUnsubscribeEmail: legacyUnsubscribeEmail,
        unsubscribeEmail : unsubscribeEmail,
        authorizeUserForPrivateEvent : authorizeUserForPrivateEvent,
        resendTickets: resendTickets
    };
})();