let prList = {};
export const addCommandMatcher = new RegExp(`--add-pr https:\/\/github\.com\/[\w|-]+\/[\w|-]+\/pull\/\d+`);


export const listPRs = (message) => {
    // message as in form '--add 
}