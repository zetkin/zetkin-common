/**
 * This redux middleware redirects user to login if a promise is rejected with
 * a 401 HTTP status code. Initialize like so:
 *
 * import loginRedirect from './common/redux/middleware/loginRedirect';
 * applyMiddleware(loginRedirect(zetkinAppId, zetkinDomain));
 *
 * @appId       The Zetkin application ID required to log in
 * @domain      The Zetkin domain, e.g. "zetk.in" or "dev.zetkin.org".
*/
export default (appId, domain) => store => next => action => {
    // Only run in browser, where window is available
    if (typeof window === 'undefined') {
        return next(action);
    }

    // Ignore any action that is not a rejected promise
    let suffix = action.type.substr(-9);
    if (suffix !== '_REJECTED') {
        return next(action);
    }

    // Ignore any error that is not a 401
    if (action.payload.httpStatus !== 401) {
        return next(action);
    }

    // Since we're in the browser and a promise was rejected with
    // error code 401, redirect to the login page.
    let params = 'appId=' + appId + '&redirPath=' + window.location.pathname;
    let loginUrl = '//login.' + domain + '?' + params;

    window.location = loginUrl;
};
