/* check two custom attributes for uniness in realm: userAlias and otherAliases */
function globalAliasUniqnessCheck(fullObject, value, params, property) {
    var queryParams, existing, requestId, resourcePath;
    params = params || {};
    if (value && value.length) {
        resourcePath = params.resourcePath || fetchResourcePath(resourceName);
        requestId = fullObject._id || (resourceName.leaf() + "");

        var newValueOfOtherAliases = [];
        var newValueOfUserAlias = null;

        var otherAliases = [];
        var userAlias = null;

        //validate internal managed alias object uniqness
        if (value != undefined) {

            if (property == "otherAliases") {

                newValueOfOtherAliases = Object.values(value);
                if (fullObject.hasOwnProperty('userAlias')) {
                    userAlias = fullObject.userAlias;
                }

                if (newValueOfOtherAliases.includes(userAlias)) {
                    return false;
                }

            }

            if (property == "userAlias") {

                newValueOfUserAlias = value;
                if (fullObject.hasOwnProperty('otherAliases')) {
                    otherAliases = Object.values(otherAliases);
                    //otherAliases = Object.keys(fullObject.otherAliases).map(key => fullObject.otherAliases[key]);
                }

                if (otherAliases.includes(newValueOfUserAlias)) {
                    return false;
                }

            }
        }


        // validate user aliases againist other aliases of IDM users
        if (newValueOfOtherAliases.length > 0) {
            for (j in newValueOfOtherAliases) { // we need to query in lopp as IDM does not support IN clause for DS store
                let alias = newValueOfOtherAliases[j];

                let result1 = openidm.query(resourcePath, { "_queryFilter": equalTo('otherAliases', alias).toString() });
                let result2 = openidm.query(resourcePath, { "_queryFilter": equalTo('userAlias', alias).toString() });

                if (result1.resultCount != 0 || result2.resultCount != 0) {
                    return false;
                }
            }
        }

    }
    return true;
}