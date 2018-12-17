### MVP
* Clicking on review will save the new status. 
* Clicking on review complete will delete the PR from the array.
* The bot will check users status and if it's active or it has dnd mode it will write the user a direct message. If not it will only write PR _____ was approved in the same chat. 

### Iter 2
* We will record the timestamp in which every PR was added. 
* An interval will be set so we will check every half an hour if a PR was added more than a day ago. In which case a message will be send to that group with the list of corresponding PRs.