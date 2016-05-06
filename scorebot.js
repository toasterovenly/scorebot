var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: 'xoxb-40579792419-QRaRHUsaYtMKJj5wuW0kYG8K'
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

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
	var score = controller.storage.channels.get(message.user, function(err, channel_data) {
		console.log(err, JSON.stringify(channel_data));
	});
	console.log(score);
	// controller.storage.channels.save({id: message.user, score:'bar'}, function(err) { ... });
});

