import { App, LogLevel } from '@slack/bolt';

export const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_AUTH_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel:
    process.env.NODE_ENV !== 'production' ? LogLevel.DEBUG : LogLevel.INFO,
});

app.command('/help', async ({ command, ack }) => {
  await ack();
  await app.client.chat.postEphemeral({
    channel: command.channel_id,
    text: 'hey',
    user: command.user_id,
  });
});

app.message(`hey help`, async ({ message, context }) => {
  await app.client.chat.postEphemeral({
    channel: message.channel,
    text: 'e',
    user: context.userId!,
  });
});

app.message('Hey Marvin', async ({ say }) => {
  await say('helloworld');
});

app.message('whatismyuserid', async ({ context, say }) => {
  await say(context.userId!);
});

app.message(
  /^(see you later|im out|heading out|goodbye|have a good one|bye).*/,
  async ({ context, say }) => {
    const greetings = ['See you later', 'Have a great one', 'Ciao'];
    const choice = Math.floor(Math.random() * greetings.length);
    await say(`${greetings[choice]} <@${context.user}>`);
  },
);
