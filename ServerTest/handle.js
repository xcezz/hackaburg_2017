var Handle = function(){
    var that = {},
        framedata,
        
        init = function(a){
            console.log(a);
        };
        
    that.init = init;
    return that;
}

module.exports = {handle: Handle};