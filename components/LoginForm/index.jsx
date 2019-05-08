import { loginUser } from "../../lib/auth";
import Router from 'next/router';

class LoginForm extends React.Component {
  state = {
    email: 'user@example.com',
    password: 'password123!',
    isLoading: false,
    error: ''
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  };

  handleSubmit = event => {
    event.preventDefault();

    const { email, password } = this.state;
    this.setState({ error: '', isLoading: true });

    loginUser(email, password)
      .then(() => {
        Router.push('/profile')
      })
      .catch(this.showError)
  };

  showError = err => {
    console.error(err);
    const error = err.response && err.response.data || err.message;
    this.setState({ error, isLoading: false });
  };

  render() {
    const { error, isLoading } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <input type="email"
            name="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input type="password"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </div>
        <button disabled={isLoading} type="submit">
          { isLoading ? 'Loading' : 'Submit' }
        </button>
        {error && <div>{error}</div>}
      </form>
    )
  }
}

export default LoginForm;