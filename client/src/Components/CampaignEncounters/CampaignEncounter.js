import React from 'react';
import moment from 'moment';
import './CampaignEncounter.scss';

class CampaignEncounter extends React.Component {
  render() {
    const { campaignEncounter } = this.props;
    return (
      <tr>
        <td colSpan={2}>{moment(campaignEncounter.dateCreated).format('L')}</td>
      </tr>
    );
  }
}

export default CampaignEncounter;
