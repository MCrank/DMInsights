import React from 'react';
import { MDBCard, MDBBtn, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBRow } from 'mdbreact';
import { withAuth } from '@okta/okta-react';
import './CampaignCard.scss';

class CampaignCard extends React.Component {
  render() {
    const { campaign } = this.props;

    return (
      <div className="CampaignCard">
        <MDBCard className="mx-auto my-4">
          <MDBCardImage className="img-fluid" src={campaign.imageUrl} waves />
          <MDBCardBody>
            <MDBCardTitle className="campaign-card-title">{campaign.title}</MDBCardTitle>
            <MDBCardText>{campaign.description}</MDBCardText>
            <MDBRow around>
              <MDBBtn outline color="secondary">
                Live Campaign
              </MDBBtn>
              <MDBBtn outline color="info">
                Campaign Stats
              </MDBBtn>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  }
}

export default withAuth(CampaignCard);
