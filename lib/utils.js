(function (exports) {
    exports.getHighestPosition = function (data) {
        var highest_position = -1;
        for (var i=0; i<data.length; i++) {
            var position = data[i].position;
            if (position !== undefined && position > highest_position) {
                highest_position = position;
            }
        }
        return highest_position + 1;
    };

    exports.isReady = function(handle) {
        return handle.ready();
    };
}(typeof exports === 'undefined' ? this.utils = {} : exports));
