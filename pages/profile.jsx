import {authInitialProps, getUserProfile} from "../lib/auth";
import Layout from "../components/Layout";
import Index from "./index";

class Profile extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    getUserProfile()
      .then(user => this.setState({ user }))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <Layout title="Profile" {...this.props}>
        <pre>{JSON.stringify(this.state.user, null, 2)}</pre>
      </Layout>
    )
  }
}

Profile.getInitialProps = authInitialProps(true);


export default Profile