import React from 'react';
import { Link } from 'react-router-dom';
import { MDBCard, MDBBtn, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBRow } from 'mdbreact';
import { withAuth } from '@okta/okta-react';
import './CampaignCard.scss';

class CampaignCard extends React.Component {
  render() {
    const { campaign, userDbId } = this.props;

    return (
      <div className="CampaignCard">
        <MDBCard className="mx-auto my-4 campaign-card">
          <MDBCardImage className="img-fluid" src={campaign.imageUrl} waves />
          <MDBCardBody className="campaign-card-body">
            <MDBCardTitle className="campaign-card-title">{campaign.title}</MDBCardTitle>
            <MDBCardText className="campaign-card-text">{campaign.description}</MDBCardText>
            <MDBRow around>
              <MDBBtn className="campaign-card-button" outline color="secondary">
                Live Campaign
              </MDBBtn>
              <MDBBtn className="campaign-card-button" outline color="info">
                Campaign Stats
              </MDBBtn>
            </MDBRow>
            {userDbId === campaign.ownerId ? (
              <MDBRow around>
                <Link to={{ pathname: '/campaignform', state: { campaign, isEditing: true } }}>
                  <MDBBtn className="campaign-card-button" outline color="warning">
                    Edit
                  </MDBBtn>
                </Link>
                <MDBBtn className="campaign-card-button" outline color="danger">
                  Delete
                </MDBBtn>
              </MDBRow>
            ) : (
              ''
            )}
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  }
}

export default withAuth(CampaignCard);
