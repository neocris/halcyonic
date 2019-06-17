//module store

//includes
var gh = new GitHub({
    /* also acceptable:
       token: 'MY_OAUTH_TOKEN'
     */
    token: localStorage.getItem('accss_token')
 });

//class
var StoreAPI = function (config) {
    var jdata = [];
    let repo = gh.getRepo('neocris','halcyonic');
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
    var sync = function(j){
        localStorage.halcyon = parse(j);
    }
    var parse = function(d){
        return JSON.stringify(d);
    }
    var ret = function(k){
        d = jdata.filter(function(s){
            return (s.id == k)
        }).shift();
        //return _.without(jdata,d);
        return jdata.indexOf(d);
    }
    var load = function(){console.log(localStorage.halcyon);console.log(jdata);
        if(localStorage.halcyon)
            jdata = jdata.concat(JSON.parse(localStorage.halcyon));
        console.log(JSON.parse(localStorage.halcyon));
        console.log(jdata);
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
        del: function(k){
            jdata.splice(ret(k),1);
            sync(jdata);
            //jdata = rem(k);
        },
        perma: function(t){
            sync(t);
        },
        // use browser sandbox or nodejs app for local use
        export: function(){
            b64 = btoa(localStorage.halcyon);console.log(atob(b64));
            params = {
                "message": 'post',
                "content": b64,
                "sha": "d.sha"
            };
            /*let gist = gh.getGist("2a5379d420dfae293cb19982eb0c27db"); // not a gist yet
            gist.update({
                description: '',
                files: {
                   "posts.json": {
                      content: ""
                   }
                }
             });*/
             repo.writeFile('master','posts/posts.json',JSON.stringify(jdata),"posts dump", function(){});
            /*$.get(' https://api.github.com/repos/neocris/halcyonic/git/trees/master:posts', function(data){
                data.tree.forEach(function(d){console.log(d.path);
                    if(d.path == "posts.json" && false){console.log('post');
                        sha=d.sha;
                        $.ajax({
                            type: "patch",
                            //url: "https://api.github.com/repos/neocris/halcyonic/contents/posts?access_token=625d8c373e052daad4521d158cdd1a4354231aa3&message=post&content=W3siaWQiOiI2NzVkZWQxNy0xZGJhLWUzZmUtY2I3MC0wOTQxODMyMDkxMWYiLCJ1cmwiOiIiLCJhY2NvdW50Ijp7ImlkIjowLCJkaXNwbGF5X25hbWUiOiJjcmlzIiwiZW1vamlzIjpbXSwiYWNjdCI6ImJvdGRyb2lkIiwiYXZhdGFyIjoiYTI4YWYzMzhjYTgxZWExYy5wbmcifSwiaW5fcmVwbGF5X3RvX2lkIjoiIiwiaW5fcmVwbGF5X3RvX2FjY291bnRfaWQiOiIiLCJyZWJsb2ciOm51bGwsImNvbnRlbnQiOiJoZWxsbyIsImNyZWF0ZWRfYXQiOiIiLCJlbW9qaXMiOltdLCJyZXBsaWVzX2NvdW50IjowLCJyZWJsb2dzX2NvdW50IjowLCJmYXZvdXJpdGVzX2NvdW50IjowLCJyZWJsb2dnZWQiOmZhbHNlLCJmYXZvdXJpdGVkIjpmYWxzZSwibXV0ZWQiOmZhbHNlLCJzZW5zaXRpdmUiOmZhbHNlLCJzcG9pbGVyX3RleHQiOiIiLCJ2aXNpYmlsaXR5IjoicHVibGljIiwibWVkaWFfYXR0YWNobWVudHMiOltdLCJtZW50aW9ucyI6W3siaWQiOjAsImFjY3QiOiJib3Rkcm9pZCJ9XSwidGFncyI6W10sImNhcmQiOnt9LCJwb2xsIjp7Im9wdGlvbnMiOltdfSwiYXBwbGljYXRpb24iOnt9LCJsYW5ndWFnZSI6ImVuIiwicGlubmVkIjpmYWxzZX1d&sha=9e26dfeeb6e641a33dae4961196235bdb965b21b"
                            //url: "https://api.github.com/repos/neocris/halcyonic/contents/posts?access_token=625d8c373e052daad4521d158cdd1a4354231aa3&message=&content=&sha=9e26dfeeb6e641a33dae4961196235bdb965b21b"
                            /*url: "https://api.github.com/repos/neocris/halcyonic/contents/posts?access_token="+localStorage.getItem('accss_token'),
                            data: {
                                "message": "post",
                                "content": b64,
                                "sha": d.sha
                            }*/
                            /*url: "https://api.github.com/gists/2a5379d420dfae293cb19982eb0c27db",
                            data: {
                                "description": "",
                                "files": {
                                    "posts.json": {
                                        "content": ""
                                    }
                                }
                            }*/
                            /*url: "https://api.github.com/gists/2a5379d420dfae293cb19982eb0c27db?access_token="+localStorage.getItem('accss_token'),
                            data: {
                                "description": "",
                                "files": {
                                    "posts.json": {
                                        "content": ""
                                    }
                                }
                            }*\/
                        });
                    }
                });
            });*/
        },
        import: function(){
            repo.getContents('master','posts/posts.json',false,function(){}).then(function(j){
                jdata = JSON.parse(atob(j.data.content));
                jdata.forEach(function(jd){
                    timeline_template(jd).prependTo("#js-timeline");
                });
                sync(jdata);
            });
        }
    }
}