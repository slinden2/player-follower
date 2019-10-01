# TODO List

- [x] Save login info in a cookie
- [x] View for logged users
- [x] Implement logout functionality
- [x] Profile page for users
- [x] Notifications for frontend
- [x] Refactor all players view so that only one query is done
- [x] Error handling for frontend
- [x] A way to add/remove favorite player
- [x] ContextAPI refactor
- [x] handleException in NotificationContext
- [x] Does it make sense to use useState for user? Use useQuery instead?
  - [x] Decided to use useQuery
- [x] Save gameDate in db and sort by it instead of gamePk
- [x] Personalized view of favorite players
- [x] Search functionality
- [x] Password requirements
- [x] GraphQL fragments
- [x] Create a "vote type" in schema (enum) and use it to combine follow/unfollow mutations
- [x] Error handling for backend
- [x] Add teams to all boxscores
- [x] Backside of the player cards
- [x] A view for single games (highlights videos etc)
- [x] About
- [x] Footer
- [x] Team needed in the player cards
- [x] Redesign site with styled components
- [x] Team view with roster table
- [x] Placerholder images
- [x] Search needs valid links for teams
- [x] Finish all the forms
- [x] Email formatting for account confirmation & forgot password
- [x] Check out mandril and mailgun
- [x] 404 page
- [x] Loader animation for search
- [x] Redirect after logout
- [x] Load more links on main page. 50 results minimum.
- [x] Filtering by team and position in player cards.
- [x] Problem with stat pagination. Duplicate players on load more.
- [x] Blocked shots needed in cumulative stats
- [x] More data to player bio table
- [x] Do recent stats calculations as a scheduled task and save results in db daily as string
  - [x] Find a more efficient way to do this...
  - [x] Done with huge aggregation

* [x] Component for stats tables
* [x] Standings
  - [x] Set up models and schema
  - [x] Resolver
  - [x] Possibility to visualize standings by league/conference/division
  - [x] Sorting for standings

- [x] A view for single players

  - [x] Bio
  - [x] Performance Game-by-Game
  - [x] Links to goals videos

- [x] Stats
  - [x] First version done via external API.
  - [x] Create a schema and a fetch script.
  - [x] Implement pagination
  - [x] Implement table sorting

* [ ] A view to show top performes. For example, most goals / points this month, this season etc.
* [ ] A top performer view. Link to the "condensed game" video and individual goal videos
* [ ] Most recent goals on the team page
* [ ] OAuth
* [ ] Social media icons
* [ ] Player card social media sharing functions
* [ ] Video social media sharing functions
* [ ] Videos must be saved in db with comments and ranking
* [ ] Chat? Forum?
* [ ] Follow button for player profiles
* [ ] OAuth
* [ ] Dont fetch team stats but use https://statsapi.web.nhl.com/api/v1/teams/5/stats

## Notes

- Download images from http://3.cdn.nhle.com/photos/mugs/8475883.jpg
- Interesting repo https://github.com/AndyJMatthews/AndyJMatthews.github.io
- And site https://andyjmatthews.github.io/
- Team logos: https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-22-dark.svg

* https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/TEAMID.svg

- http://statsapi.web.nhl.com/api/v1/game/2018021000/content for highlight videos

* Game view? All goals videos related to a game
