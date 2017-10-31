
(function () {
    var set = function (paths, value) {
        location.searchObject =
            objectRecursiveSet(location.searchObject, paths, value);
    };

    var push = function (paths, value) {
        var array = objectRecursiveGet(location.searchObject, paths);

        if (!Array.isArray(array)) {
            array = [value];
        } else {
            array.push(value);
        }

        location.searchObject =
            objectRecursiveSet(location.searchObject, paths, array);
    };

    //  При
    //  object = {
    //      "key" : {
    //              "key2" : "val"
    //          }
    //      }
    // paths = ["key","key3"]
    // value = "val2";

    // Возвращает
    //  {
    //      "key" : {
    //          "key2" : "val",
    //          "key3" : "val2"
    //      }
    //  }
    var objectRecursiveSet = function (object, paths, value) {
        if (undefined === paths || !Array.isArray(paths)) {
            console.error("Need array", paths);
            return false;
        }
        var firstPath = paths[0];

        if (paths.length > 1) {
            if (!object.hasOwnProperty(firstPath)) {
                object[firstPath] = {};
            }
            object[firstPath] = objectRecursiveSet(
                object[firstPath],
                paths.slice(1),
                value
            );
        } else {
            object[firstPath] = value;
        }
        return object;
    };

    //  При
    //  object = {
    //      "key" : {
    //              "key2" : "val"
    //          }
    //      }
    // paths = ["key","key2"]

    // Возвращает "val"
    var objectRecursiveGet = function (object, paths) {
        if (undefined === paths || !Array.isArray(paths)) {
            console.error("Need array", paths);
            return false;
        }
        var firstPath = paths[0];

        if (!object.hasOwnProperty(firstPath)) {
            return null;
        }

        if (paths.length > 1) {
            return objectRecursiveGet(object[firstPath],paths.slice(1));
        }
        return object[firstPath];
    };

    location.searchObject = {};
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            var tmp = item.split("=");
            var path = decodeURIComponent(tmp[0]);
            var value = decodeURIComponent(tmp[1]);
            var result ;
            var paths = [];
            var varName ;

            // var[key1]...[keyN][]=value
            if (result = /^([^\[\]]+)(\[[^\]\[]+\])+\[\]/.exec(path)) {
                varName = result[1];
                path = /(\[(.+)\])\[\]/.exec(path);
                paths = (varName + '][' + path[2]).split('][');
                return push(paths, value);
            }

            // var[key1]...[keyN]=value
            if (result = /^([^\[\]]+)(\[[^\]\[]+\])+/.exec(path)) {
                varName = result[1];
                path = /\[(.+)\]/.exec(path);
                paths = (varName + '][' + path[1]).split('][');
                return set(paths, value);
            }

            // var[]=value
            if (result = /^([^\[\]]+)\[\]$/.exec(path)) {
                return push([result[1]], value);
            }

            // var=value
            if (result = /^([^\[\]]+)$/.exec(path)) {
                return set([result[1]], value);
            }

            return console.error("Unknown GET path: ",path);
        });
})();
