# Commit Every Single Day


## Add incoming webhooks in your slack
1. Search 'Incoming WebHooks'  
https://{{your_workspace}}.slack.com/apps/
2. Add to slack
3. Custom your WebHook information
4. Get `WebHook URL`

## Get Github token
https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line  
you can just add your scope about `repo`


## Add repository secret variable
1. Go to your `repository` > Settings > Secrets
2. Add `SLACK_WEBHOOK_URL`
3. Add `PRIVATE_GITHUB_TOKEN`
    - Since Github page do not allowed `secrets.GITHUB_TOKEN`, you need to publish your private token. 
    - https://github.com/JamesIves/github-pages-deploy-action/issues/48

##    
    
