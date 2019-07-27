import React from 'react';
import { withAuth } from '@okta/okta-react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import userRequests from '../../helpers/data/userRequests';
import campaignRequests from '../../helpers/data/campaignRequests';

import './Campaign.scss';
import CampaignCard from '../../Components/CampaignCard/CampaignCard';

class Campaign extends React.Component {
  state = {
    myCampaigns: [],
    isLoading: true,
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  getCurrentUser = async () => {
    const user = await this.props.auth.getUser();
    return user;
  };

  getDbUserRequestItems = async () => {
    const accessToken = await this.getAccessToken();
    const tokenId = await this.getCurrentUser();
    const dbUid = await userRequests.getUserByTokenId(accessToken, tokenId.user_id);
    let dbRequestObj = {
      accessToken: accessToken,
      tokenId: tokenId,
      dbUid: dbUid.id,
    };
    return dbRequestObj;
  };

  componentDidMount() {
    this.getMyCampaigns().then(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  getMyCampaigns = async () => {
    const dbRequest = await this.getDbUserRequestItems();
    campaignRequests.getUserCampaigns(dbRequest.accessToken, dbRequest.dbUid).then((resp) => {
      this.setState({
        myCampaigns: resp,
      });
    });
  };

  render() {
    const { myCampaigns, isLoading } = this.state;

    const campaignCards = (myCampaigns) => myCampaigns.map((campaign, index) => <CampaignCard key={campaign.id} campaign={campaign} />);

    return (
      <div className="Campaign">
        {isLoading ? (
          <MDBContainer className="d-flex justify-content-center pt-3">
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </MDBContainer>
        ) : (
          ''
        )}
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol className="campaign-card-col" md="6" sm="12" lg="3">
              {campaignCards(myCampaigns)}
            </MDBCol>
            <MDBCol md="6" sm="12" lg="9">
              <MDBRow className="campaign-info-title">
                <MDBCol md="12" lg="4">
                  <h3>Players Here</h3>
                </MDBCol>
                <MDBCol>
                  <h3>Game Sessions Here</h3>
                </MDBCol>
                <MDBCol md="12" lg="4">
                  <h3>Encounters Here</h3>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="12" lg="4">
                  <h3>Notes Sections</h3>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default withAuth(Campaign);
