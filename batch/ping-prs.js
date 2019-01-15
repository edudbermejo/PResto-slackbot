const schedule = require('node-schedule')
const { listPRs } = require('../commands/list-prs')

let rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [new schedule.Range(1, 5)]
rule.hour = [9, 14]
rule.minute = 30
// rule.second = [0, 15, 30, 45] //-> for debugging purposes 

exports.setScheduleForPRs = ({web, db}) => {
  schedule.scheduleJob(rule, () => listPRs({web, db}))
}