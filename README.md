## Summary:
   This voting application helps team to select a restaurant for daily team lunch, in a democratic way.Application can be accessed by 2 different user levels – Hungry Worker & Process Facilitator. While Hungry Worker can vote, Process Facilitator can just on/off the feature that allows a restaurant to be picked more than once in a wk. By default, a restaurant cannot be picked for more than once in a wk.

## Voting Guidelines:
-	Below are accepted usernames. Password can be anything
    hungryworker1; hungryworker2; hungryworker3; hungryworker4; hungryworker5; process_facilitator
-	You need to vote by noon every day and voting results will be announced at noon, each day.
-	While you can change your voting in a day, you can finally vote for only one restaurant in a day.
-	If no votes are casted by noon, no restaurant will be selected for that day.
-	By default, the restaurant that has been picked by popular vote, will not be voted again in the same week. This feature can be changed by Process Facilitator, anytime.
-	Every Sunday midnight, all the restaurants will be available for voting, for the upcoming week.

## Assumptions made:
-	Data refresh is done on every Sun midnight. After this refresh, all restaurants are available to vote for upcoming wk.
-	Team may not go out every day and during “No Vote” days, no restaurants are selected.

## Clone, build and run the project:
Clone the repository:
	$ git clone https://github.com/rakeshkumarkondle/restaurant-app.git
Build the application:
	$ cd restaurant-app
	$ npm install
Run the built executable:
	$ node server.js
	Open browser pointing at http://localhost:3000
Test Case Execution:
    $ karma start

## Architecture and Environment:
-	Server-side is written in Node.js
-	Client-side is written in AngularJS.

## Highlights of the code:
-	Code is modular which enables testing easy.
-	Code is well commented making it easy to understand.
-	Test scripts are written with Jasmine.
-	Server code is used which improves data response.

## This could have been better:
-	User Id administration can be done in a much better way, with additional time.
