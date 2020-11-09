const tmi = require('tmi.js');
const opts = {
    identity: {
      username: 'your_bot_username',
      password: 'oauth:your_oauth_token'
    },
    channels: [
      'the_channels',
      'where_you_wish',
      'the_bot_to_run'
    ]
};

const timeout_list = {};

function addToTimeoutList(msg,context){
  const addx = /\!timeout\s+(\w+)\s*(\d+)/i;
  const delx = /\!untimeout\s+(\w+)/i;
  if((context['badges'] && context['badges']['broadcaster'] == '1') || (context['badges'] && context['badges']['moderator'] == '1')){
    if(addx.test(msg)) timeout_list[addx.exec(msg)[1].toLowerCase()] = addx.exec(msg)[2];
    if(delx.test(msg) && timeout_list[delx.exec(msg)[1].toLowerCase()]) delete timeout_list[delx.exec(msg)[1].toLowerCase()];
  }
}

function autoTimeout(context,target){
  if(context.username.toLowerCase() && timeout_list[context.username.toLowerCase()]) client.say(target, `/timeout ${context.username} ${timeout_list[context.username.toLowerCase()]}`);
}

const client = new tmi.client(opts);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

function onMessageHandler (target, context, msg, self, extra) {
  autoTimeout(context,target);
  addToTimeoutList(msg.trim(),context);
}
