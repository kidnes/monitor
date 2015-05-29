var co = function(flow) {

    var generator = flow();

    var next = function(data) {
        var result = generator.next(data);

        if (!result.done) {
            result.value(function(err, data) {
                if (err) {
                    throw err;
                }
                next(data);
            });
        }
    };
    
    next();
};