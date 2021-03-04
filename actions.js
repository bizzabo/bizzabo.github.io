(function() {

    var actions = {
        PRIVATE_EVENT_REQUEST: 'approve-attendee',
        PRIVATE_EVENT_REQUEST_HASH: 'hash',
        PRIVATE_EVENT_REQUEST_EVENT_ID: 'event-id',
        MAILING_LIST_WAIT_FOR_CONFIRMATION: 'mailingList',
        MAILING_LIST_THANKS_FOR_CONFIRMING: 'mailConfirmation',
        REQUEST_DEMO_THANKS_FOR_CONFIRMING: 'requestDemoConfirmation',
        EMAIL_CONFIRMATION_CODE1: 'c1',
        EMAIL_CONFIRMATION_CODE2: 'c2',
        UNSUBSCRIBE: 'unsubscribe'
    };

    var authorizeUserForPrivateEvent = function(params) {
        var eventId = params[actions.PRIVATE_EVENT_REQUEST_EVENT_ID];
        var hash = params[actions.PRIVATE_EVENT_REQUEST_HASH];

        BZAPI.authorizeUserForPrivateEvent(eventId, hash, function () {
            showPopup('#popup-private-event-request-success');
        }, function () {
            showPopup('#popup-private-event-request-error');
        });
    };

    function newUserEmailConfirmation(params) {
        var c1 = params[actions.EMAIL_CONFIRMATION_CODE1];
        var c2 = params[actions.EMAIL_CONFIRMATION_CODE2];

        var validationSuccess = function () {
            showPopup('#popup-email-confirm-success');
        };

        var validationError = function () {
            showPopup('#popup-email-confirm-error');
        };

        if (c1 && c2) {
            BZAPI.validateEmail(c1, c2, validationSuccess, validationError);
        } else {
            validationError();
        }
    }

    var legacyUnsubscribeEmail = function(params) {
        var c1 = params[actions.UNSUBSCRIBE];

        BZAPI.legacyUnsubscribeEmail(c1, function () {
            showPopup('#popup-unsubscribe-success');
        }, function () {
            showPopup('#popup-unsubscribe-error');
        });
    };

    var unsubscribeEmail = function(params) {
        var hash = params[actions.UNSUBSCRIBE];

        BZAPI.unsubscribeEmail(hash, function () {
            showPopup('#popup-unsubscribe-success');
        }, function () {
            showPopup('#popup-unsubscribe-error');
        });
    };

    var getParams = function(fragment) {
        var arr = fragment.split('&');
        var params = {};
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            params[arr2[0]] = arr2.length > 1 ? arr2[1] : true;
        }

        return params;
    };

    var getUrlHashParams = function() {
        return getParams(document.location.hash.substr(1));
    };

    var getUrlSearchParams = function() {
        return getParams(document.location.search.substr(1));
    };

    var showPopup = function(selector) {
        $(selector).css('display', 'block');
        $(selector).css('background-color', 'red');
    };

    var closePopup = function(selector) {
      $(selector).css('display', 'none');
    };

    var handleParams = function(params, isHash) {
        if (params[actions.MAILING_LIST_WAIT_FOR_CONFIRMATION]) {
            showPopup('#popup-thanks-for-subscribing');
        } else if (params[actions.MAILING_LIST_THANKS_FOR_CONFIRMING]) {
            showPopup('#popup-thanks-for-conforming');
        } else if (params[actions.EMAIL_CONFIRMATION_CODE1]) {
            showPopup('#popup-validating');
            newUserEmailConfirmation(params);
        } else if (params[actions.UNSUBSCRIBE]) {
            showPopup('#popup-unsubscribe-confirm');
            $('.confirm-unsubscribe-btn').on('click', function() {
              closePopup('#popup-unsubscribe-confirm');
              showPopup('#popup-unsubscribing');
              if (isHash) {
                  legacyUnsubscribeEmail(params);
              } else {
                  unsubscribeEmail(params);
              }
            })
        } else if (params[actions.REQUEST_DEMO_THANKS_FOR_CONFIRMING]) {
            showPopup('#popup-demo-request-received');
            window._gaq && window._gaq.push(['_trackEvent', 'Marketing Actions', 'popup opened', actions.REQUEST_DEMO_THANKS_FOR_CONFIRMING]);
        } else if (params[actions.PRIVATE_EVENT_REQUEST]) {
            showPopup('#popup-approving-private-event-request');
            authorizeUserForPrivateEvent(params);
        }
    };

    $(function() {
        var hashParams = getUrlHashParams();
        var searchParams = getUrlSearchParams();
        handleParams(hashParams, true);
        handleParams(searchParams, false);
    });

})();