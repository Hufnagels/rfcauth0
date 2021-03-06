[![Netlify Status](https://api.netlify.com/api/v1/badges/3142acde-0334-4c76-aeb1-f1703ec41aed/deploy-status)](https://app.netlify.com/sites/happy-wescoff-68c862/deploys) 


# rfcauth0

## deploy client to netlify
## install Netlify cli
~~~
npm install netlify-cli --save-dev
~~~

and the next to package.json
~~~
"scripts": {
....
    "netlify": "netlify"
~~~
than
~~~
netlify init
~~~

### Setups
Navigate to Build & Deploy
Under Continuous Deployment select Edit settings
Update Build command to
~~~
CI=false npm run build
~~~

## deploy server to heroku
### install heroku cli
~~~
brew install heroku/brew/heroku
~~~
go to folder and login to heroku. 
### After that create a new app and do setup
~~~
heroku create
~~~
because using socket.io, we need enable
~~~
heroku features:enable http-session-affinity
~~~
Than go to Heroku dashboard, use the newly created app and go to Deploy tab. Connect to Github, and select the appropiate Repo, which used for Netlify too.
Next on Settings tab and we need add the [subdir build pack](https://elements.heroku.com/buildpacks/timanovsky/subdir-heroku-buildpack) to use server subdir.
Therefore we need to add an environmental variable in Config vars:
~~~
PROJECT_PATH : server
~~~
### Code changes on both side --> client + server
In the server code must the port changed to:
~~~
process.env.PORT
~~~
and in the frontend socket connection URL must be changed to in the Domain section given URL fex:
~~~
https://ancient-garden-xxx23.herokuapp.com/
~~~
After that
~~~
git status
git add client/ server/
git commit -m "update for deploy on heroku"
git status (for check)
git push origin/main
~~~
OR use Github client!

### Watch logs
~~~
heroku logs --tail
~~~
