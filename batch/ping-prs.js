const schedule = require('node-schedule');

let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 5)];
rule.hour = [14, 19];
rule.minute = 0;
//rule.second = [0, 15, 30, 45]; -> for debugging purposes 

const checkPRs = ({web, prsList}) => {
  let prsEntries = Object.entries(prsList);
  if(prsEntries.length !== 0) {
    prsEntries.forEach(channelPair => {
      const [channel, channelPRs] = channelPair;
      const hasPendingPRs = channelPRs.some( pr => pr.status = 'open');
      if(hasPendingPRs) {
        web.chat.postMessage({ text: `There are ${channelPRs.length} pending PRs for this channel.`, channel});
      }
    });
  }
}

exports.setScheduleForPRs = ({web, prsList}) => {
  schedule.scheduleJob(rule, () => checkPRs({web, prsList}));
}