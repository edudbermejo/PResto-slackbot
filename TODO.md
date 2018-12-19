### Iter 2
* We will record the timestamp in which every PR was added. 
* An interval will be set so we will check every half an hour if a PR was added more than a day ago. In which case a message will be send to that group with the list of corresponding PRs.
* Maybe just running some job at scheduled times and if any channel has pending PRs send a message to the channel.