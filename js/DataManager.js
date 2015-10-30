var DataManager = function () {
	this.api_key="QVJX27LZP1Q9GYBYV"
	this.host = "developer.echonest.com";
    this.api_path = "/api/v4/";
	
	// Helper function for iterating through
    // the keys in an object
    function each(obj, func) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                func.call(obj, key);
            }
        }
    }
    
    // Helper function to see if an object is
    // really an array. Taken from
    // `Javascript: The Good Parts` by
    // Douglas Crockford
    function isArray(obj) {
        return Object.prototype.toString.apply(obj) === '[object Array]';
    }
	
	function queryString(params) {
        var query = '?', first = true;
        var value;
        each(params, function (key) {
            var i;
            // only prepend `&` when this
            // isn't the first k/v pair
            if (first) {
                first = false;
            } else {
                query += '&';
            }
            value = params[key];
            if (isArray(value)) {
                for (i = 0; i < value.length; i += 1) {
                    query += (encodeURI(key) + '=' + encodeURI(value[i]));
                    if (i < (value.length - 1)) {
                        query += '&';
                    }
                }
            } else {
                query += (encodeURI(key) + '=' + encodeURI(value));
            }
        });
        return query;
    }
	
	this.nestGet = function (category, method, query, callback) {
            query.api_key = this.api_key;
            query.format = 'json';
            var request = new XMLHttpRequest();
            var url = 'http://';
            url += this.host;
            url += this.api_path;
            url += category + '/';
            url += method;
            url += queryString(query);

            request.open('GET', url, true);
            request.onreadystatechange = function () {
                var sc, json_response, response;
                // see if the response is ready
                if (request.readyState === 4) {
                    // get the request status class, ie.
                    // 200 == 2, 404 == 4, etc.
                    sc = Math.floor(request.status / 100);
                    if (sc === 2 || sc === 3) {
                        json_response = JSON.parse(request.responseText);
                        // unwrap the response from the outter
                        // `response` wrapper
                        response = json_response.response;
                        callback(null, response);
                        return;
                    } else {
                        // there was an error,
                        // just return the `status`
                        // as the first paramter
                        callback(request.status);
                        return;
                    }
                }
            };
            // do it
            request.send();
        }
		
}