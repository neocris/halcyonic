//module store

//includes

//class
var StoreAPI = function (config) {
    var jdata = [];
    var stParseError = function(){
        this.error = new Error("couldn't parse the provided obj");
    }
    var checks = function(s){
        if(!spec(s))
            throw new stParseError();
        else
            return true;
    }
    var spec = function(s){
        stproto = {
            id: "",
            url: "",
            account: {
                id: 0,
                display_name: "",
                emojis: [],
                acct: "",
                avatar: ""
            },
            in_replay_to_id: "",
            in_replay_to_account_id: "",
            reblog: null,
            content: "",
            created_at: "",
            emojis: [],
            replies_count: 0,
            reblogs_count: 0,
            favourites_count: 0,
            reblogged: false,
            favourited: false,
            muted: false,
            sensitive: false,
            spoiler_text: "",
            visibility: "",
            media_attachments: [],
            mentions: [],
            tags: [],
            card: {},
            poll: {
                options: []
            },
            application: {},
            language: "",
            pinned: false
        }
        return _.isMatch(_.keys(stproto),_.keys(s)); //needs to order s first eventually due to isMatch shortcommings
    }
    var sync = function(d){
        localStorage.halcyon = parse(d);
    }
    var parse = function(d){
        return JSON.stringify(d);
    }
    var load = function(){
        if(localStorage.halcyon)
            jdata = jdata.concat(JSON.parse(localStorage.halcyon));
    }
    load();
    return {
        get: function(i){
            return i ? [jdata[i]] : jdata;
        },
        //lifo
        post: function(s){
            try {
                checks(s);
                jdata.unshift(s);
                sync(jdata); //very inneficient
            } catch(e) {
                console.log(e);
            }   
        },
        del: function(i){
            jdata.splice(i,1);
        },
        perma: function(d){
            sync(d);
        }
    }
}