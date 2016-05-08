
/*
message examples:
	'direct_message'
		anything in a DM
	'direct_mention'
		@scorebot your message
	'mention'
		some stuff @scorebot some more stuff
	'ambient'
		just a message
*/

//------------------------------------------------------------------------------
// useful variables
let strings = [
'zero',
'one',
'two',
'three',
'four',
'five',
'six',
'seven',
'eight',
'nine',
'keycap_ten',
];

let emojis = [];
for(let i =0; i < strings.length; ++i) {
	emojis[i] = ':' + strings[i] + ':';
}

let numbers = {};
for(let i =0; i < emojis.length; ++i) {
	numbers[emojis[i]] = i;
}

//------------------------------------------------------------------------------
//helper fucntions
function reactToPoints(emojiName, bot, message) { 
	bot.api.reactions.add({
		timestamp: message.ts,
		channel: message.channel,
		name: emojiName,
	}, function(err, res) {
		if (err) {
			bot.botkit.log('Failed to add emoji reaction :(', err);
			return false;
		}
		else {
			return true;
		}
	});
}

function storePoints(points, bot, message) {
	controller.storage.channels.all(function(err, all_channel_data) {
		console.log('before', JSON.stringify(all_channel_data));
		
		if(!all_channel_data.hasOwnProperty(message.channel)) {
			all_channel_data[message.channel] = {};
			console.log("add this channel");
		}
		
		console.log('after', JSON.stringify(all_channel_data));
	});
}

function givePoints(num, bot, message) {
	console.log('give points', 'points', num, 'user', message.user, 'channel', message.channel);
	storePoints(num, bot, message);
	reactToPoints(strings[num], bot, message);
	
}

//------------------------------------------------------------------------------
// init
var Botkit = require('botkit');
// var redisConfig = {};
// var redisStorage = require('botkit-storage-redis')(redisConfig);
var controller = Botkit.slackbot({
	// storage: redisStorage
});
var bot = controller.spawn({
	token: 'xoxb-40579792419-QRaRHUsaYtMKJj5wuW0kYG8K'
})
bot.startRTM(function(err,bot,payload) {
	if (err) {
		throw new Error('Could not connect to Slack');
	}
});

//------------------------------------------------------------------------------
// logic
controller.on('message_received', function(bot, message) {

	// carefully examine and
	// handle the message here!
	// Note: Platforms such as Slack send many kinds of messages, not all of which contain a text field!
	bot.reply(message, 'I heard that');
	console.log('received message ' + JSON.stringify(message));
});

controller.hears(':one:', ['message_received','direct_message','direct_mention','mention'], function(bot, message) {
	console.log('heard something!');
	bot.reply(message,{
		text: "you got one point",
		username: "scorebot",
		icon_emoji: ":dash:",
	});
	bot.api.reactions.add({
		timestamp: message.ts,
		channel: message.channel,
		name: 'robot_face',
	}, function(err, res) {
		if (err) {
			bot.botkit.log('Failed to add emoji reaction :(', err);
		}
	});
	let score = controller.storage.channels.get(message.user, function(err, channel_data) {
		console.log("an eror occurred while storing info", err, JSON.stringify(channel_data));
	});
	console.log("your score", score);
	// controller.storage.channels.save({id: message.user, score:'bar'}, function(err) { ... });
});

for(let i = 1; i <= 10; ++i) {
	let emoji = emojis[i];
	controller.hears(emoji, ['direct_mention','mention','ambient'], function(bot, message) {
		console.log(givePoints(i, bot, message));
	});
}
