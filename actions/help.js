const helpMessage = `
Hi! I am a bot for slack that will help your team deal with Pull Requests. I can:
    - *add* a PR to your slack channel list of pending PRs. Just mention me saying the magic word 'add' and the url of your PR.
    - *list* the PRs for the channel you write it from and let you chose one to mark it as done or in progress. Just mention me and say 'list'.
`

exports.help = (web, channel) => {
    web.chat.postMessage({text: helpMessage, channel}).then(res => console.log('message sent with time ' + res.ts)).catch(console.error);
}