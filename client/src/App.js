import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
    }
  }
`;

const MESSAGE_CREATED = gql`
  subscription {
    messageCreated {
      id
      content
    }
  }
`;

const App = () => (
  <Query query={GET_MESSAGES}>
    {({ data, loading, subscribeToMore }) => {
      if (!data) {
        return null;
      }

      if (loading) {
        return <span>Loading ...</span>;
      }

      return (
        <Messages
          messages={data.messages}
          subscribeToMore={subscribeToMore}
        />
      );
    }}
  </Query>
);

class Messages extends React.Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: MESSAGE_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        return {
          messages: [
            ...prev.messages,
            subscriptionData.data.messageCreated,
          ],
        };
      },
    });
  }

  render() {
    return (
      <ul>
        {this.props.messages.map(message => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    );
  }
}

export default App;
