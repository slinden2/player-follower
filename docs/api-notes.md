# API Notes

## Useful resources

[Unofficial API docs](https://gitlab.com/dword4/nhlapi/tree/master/)

[Other API docs](https://github.com/erunion/sport-api-specifications/tree/master/nhl)

[Reddit thread](https://www.reddit.com/r/hockey/comments/7p7o70/documenting_the_nhl_api/)

## Example Endpoints

[Detailed player stats](<https://statsapi.web.nhl.com/api/v1/people/8476887?hydrate=stats(splits=statsSingleSeason)>)

Complete player stats

[Games of the day](https://statsapi.web.nhl.com/api/v1/schedule?date=2019-01-09)

Use this without date modifier to get the most recent games

[Boxscore](https://statsapi.web.nhl.com/api/v1/game/2018020668/boxscore)

This will be used for updated the player stats after the games

[Game content](https://statsapi.web.nhl.com/api/v1/game/2018020668/content)

Useful for goal videos. Would be cool to show goal videos of favorited players on the page.

[Cumulative stats](https://api.nhle.com/stats/rest/skaters?isAggregate=true&reportType=basic&isGame=false&reportName=skatersummary&cayenneExp=leagueId=133%20and%20gameTypeId=2%20and%20seasonId%3E=19171918%20and%20seasonId%3C=20182019)

This is for the cumulative stats. The link gives all season from 19171918 to 20182019.

[Sorted cumulative stats](https://api.nhle.com/stats/rest/skaters?isAggregate=true&reportType=basic&isGame=false&reportName=skatersummary&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22},{%22property%22:%22goals%22,%22direction%22:%22DESC%22},{%22property%22:%22assists%22,%22direction%22:%22DESC%22}]&cayenneExp=leagueId=133%20and%20gameTypeId=2%20and%20seasonId%3E=20182019%20and%20seasonId%3C=20182019)

Stats as shown by default on [nhl.com](http://www.nhl.com)
