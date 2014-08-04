#!/usr/bin/env node
var net = require('net');
var PORT= 8602;
var HOST='danmu.douyu.tv'
var global="";//c.write(":admin!admin@admin.tmi.twitch.tv PRIVMSG #jocover :test\r\n")

var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  setInterval(function(){
  if(global!=""){
c.write(global);

global="";
}
},1000);
c.on('end', function() {
    console.log('server disconnected');
  });
c.on('data',function(data){
// console.log('service data: '+data.toString());
var match = /^(\w+)\s+(.*)/.exec(data);
		if (!match) {
			return;
		}
var conn;
var command = match[1].toUpperCase(),
			rest = match[2];
console.log("Command:"+command+"   Rest:"+rest);
switch (command) {
case "PASS":
c.write(":tmi.twitch.tv 001 jocover :Welcome, GLHF!\r\n","ascii");
c.write(":tmi.twitch.tv 002 jocover :Your host is tmi.twitch.tv\r\n","ascii");
c.write(":tmi.twitch.tv 003 jocover :This server is rather new\r\n","ascii");
c.write(":tmi.twitch.tv 004 jocover :-\r\n","ascii");
c.write(":tmi.twitch.tv 375 jocover :-\r\n","ascii");
c.write(":tmi.twitch.tv 372 jocover :You are in a maze of twisty passages, all alike.\r\n","ascii");
c.write(":tmi.twitch.tv 376 jocover :>\r\n","ascii");
break;

case "JOIN":
c.write(":jocover!jocover@jocover.tmi.twitch.tv JOIN #jocover\r\n","ascii");
c.write(":jocover.tmi.twitch.tv 353 jocover = #jocover :jocover\r\n","ascii");
//c.write("366: #channelname End of /NAMES list");
//c.write("jtv MODE #channelname +o channel_moderator");
//c.write("jtv MODE #channelname +o channel_moderator2");
//c.write("jtv MODE #channelname +o staff_user");
//c.write("jtv MODE #channelname +o twitch_global_mod_user");
break;

default:
//c.write(":tmi.twitch.tv 421 "+command+' :Unknown command',"ascii");
console.log("Unknow command :"+command+' Rest:'+rest);
break;
}


});

});

var client = net.connect(PORT,HOST,
    function() { //'connect' listener
  console.log('client connected');
client.setKeepAlive('true',1000);
sleep(4);
  client.write('5a0000005a000000b102000074797065403d6c6f67696e7265712f757365726e616d65403d6175746f5f615a464c4a687255696c2f70617373776f7264403d313233343536373839303132333435362f726f6f6d6964403d353830322f00','hex');
sleep(1);
  client.write('2a0000002a000000b102000074797065403d6a6f696e67726f75702f726964403d353830322f676964403d302f00','hex');

client.on('connect',function(){});

setInterval(function(){
client.write('2100000021000000b202000074797065403d6b6565706c6976652f7469636b403d34382f00','hex');
},5000);

client.on('error',function(err){
console.log('error:'+err.toString("ascii"));
});


client.on('data', function(data) {
      //  console.log(data.toString());
        var match = data.toString();
        if(match.indexOf("chatmessage")>1){
        var name = match.substring(match.indexOf("snick@=") + 7, match.indexOf("/dnick@"));
        var message = match.substring(match.indexOf("content@") + 9, match.indexOf("/scope@"));
        global = ":" + name + "!" + name + "@" + name + ".tmi.twitch.tv PRIVMSG #jocover :" + message + "\r\n";
	 }
        else if(match.indexOf("donateres")>1){
        var name = match.substring(match.indexOf("Snick@A=") + 8, match.indexOf("@Srg@A"));
        global = ":" + name + "!" + name + "@" + name + ".tmi.twitch.tv PRIVMSG #jocover :" + "赠送你鱼丸" + "\r\n";
        }

});
client.on('end', function() {
  console.log('client disconnected');
});

});
function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };



server.listen(6667, function() { //'listening' listener
  console.log('irc ok');
});
