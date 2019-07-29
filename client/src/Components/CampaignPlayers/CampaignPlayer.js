import React from 'react';
import './CampaignPlayer.scss';

class CampaignPlayers extends React.Component {
  render() {
    const { campaignPlayer } = this.props;
    return (
      // <div className="CampaignPlayers">
      <tr>
        <td>{campaignPlayer.name}</td>
        <td>{campaignPlayer.level}</td>
        <td>{campaignPlayer.characterRace}</td>
        <td>{campaignPlayer.classes}</td>
        <td>{campaignPlayer.hitPoints}</td>
      </tr>

      // {/* </div> */}
    );
  }
}

export default CampaignPlayers;
