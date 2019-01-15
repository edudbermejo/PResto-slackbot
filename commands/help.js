const helpMessage = `
Hi! I am a bot for slack that will help your team deal with Pull Requests. I can:
    - *add* a Github repository to your slack channel list of watched Repos. Use the command \`/watchrepo\`
    - *list* the PRs that are pending for your channel. Use the command \`/listprs\'.
    - *delete* one repository from the list of watched repositories. Use the command \`/unwatchrepo\'.
Also I am programmed to message your channel at 9:30 every weekday with your pending PRs.
`

exports.help = (web, channel) => {
  web.chat.postMessage({ text: helpMessage, channel }).catch(console.error);
}