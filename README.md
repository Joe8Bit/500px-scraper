## 500px scraper

This was created for an annoyingly specific reason.

I wanted to add a 500px 'photofeed' to my website (at [http://joe8bit.com/photos/](http://joe8bit.com/photos/)) but the 500px API is auth'd when requesting the photos or a particular user. Grr.

So this project was born. In short it does the following:

1. Go to the 500px API, get all my latest photos.
2. Cache the resulting JSON.
3. Upload the resulting JSON to the AWS bucket that I use for my website (to the `/photos/data.json` path)
4. Invalidate the CloudFront distribution for that path.

If anything fails, it sends me an email telling me what went wrong.

This is all deployed as a [Scheduler](https://devcenter.heroku.com/articles/scheduler) on Heroku that is run every 60 minutes (at 20 past the hour).

## Running the app

I won't describe deploying the app for the first time, as it was skull fuckingly tedious. 

Deploying the app:
```
heroku deploy
```

Manually the task on the Heroku instance:
```
heroku run 500px_run
```

Running the task locally
```
./bin/500px_run
``` 

## Notes

You will see that I am using my own fork of Void, this is due to the mainline version not firing an event when it's done (why not? No idea), mine does.
