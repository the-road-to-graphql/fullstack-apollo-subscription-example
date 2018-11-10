# fullstack-apollo-subscription-example

[![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/)

A minimal Apollo Server 2 with Apollo Client 2 application with subscriptions.

## Installation

* `git clone git@github.com:the-road-to-graphql/fullstack-apollo-subscription-example.git`
* `cd fullstack-apollo-subscription-example`

### Server

* `cd server`
* `npm install`
* `npm start`

### Client

* `cd client`
* `npm install`
* `npm start`
* visit `http://localhost:3000`

### Activate subscription

```
curl -d '{"query": "mutation AddMessage($id: Int, $content: String, $authorId: Int) { addMessage(id: $id, content: $content, authorId: $authorId) }", "variables": { "authorId": 88, "content": "Subscribed!", "id": 56 } }' -H 'Content-Type: application/json' localhost:8000/graphql
```

## Want to learn more about React + GraphQL + Apollo?

* Don't miss [upcoming Tutorials and Courses](https://www.getrevue.co/profile/rwieruch)
* Check out current [React Courses](https://roadtoreact.com)
