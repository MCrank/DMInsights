import React from 'react';
import ReactDom from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import './SignInWidget.scss';

class SignInWidget extends React.Component {
  componentDidMount() {
    const el = ReactDom.findDOMNode(this);
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl,
      clientId: '0oaxoy8a5VcwfOzxJ356',
      redirectUri: 'http://localhost:3000/implicit/callback',
      authParams: {
        issuer: 'default',
        responseType: ['id_token', 'token'],
        display: 'page',
      },
      brandName: 'DM Insights',
      logo: 'DMI_Logo_light_2.png',
      idps: [{ type: 'GOOGLE', id: '0oaukkt05FMpGDIOs356' }],
      idpDisplay: 'PRIMARY',
      features: {
        registration: true,
      },
    });
    this.widget.renderEl({ el }, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div className="SignInWidget" />;
  }
}

export default SignInWidget;
