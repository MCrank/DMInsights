import React from 'react';
import moment from 'moment';
import { withAuth } from '@okta/okta-react';
import './CampaignSession.scss';

class CampaignSession extends React.Component {
  getSessionEncounters = () => {
    const sessionId = this.props.campaignSession.id;
    const { getCampaignEncounters } = this.props;
    getCampaignEncounters(sessionId);
  };

  render() {
    const { campaignSession } = this.props;
    return (
      <tr style={{ cursor: 'pointer' }} onClick={this.getSessionEncounters}>
        <td colSpan={2}>{moment(campaignSession.dateCreated).format('L')}</td>
        <td>{campaignSession.title}</td>
        <td>{campaignSession.description}</td>
      </tr>
    );
  }
}

export default withAuth(CampaignSession);
