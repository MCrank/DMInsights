import React from 'react';
import { Link } from 'react-router-dom';
import { MDBCard, MDBBtn, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBRow, MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { withAuth } from '@okta/okta-react';
import campaignRequests from '../../helpers/data/campaignRequests';
import './CampaignCard.scss';

class CampaignCard extends React.Component {
  state = {
    deleteModal: false,
  };

  modalToggle = () => {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  };

  getAccessToken = async () => {
    return await this.props.auth.getAccessToken();
  };

  deleteCampaign = async () => {
    const accessToken = await this.getAccessToken();
    const campaignId = this.props.campaign.id;
    const { getCampaigns } = this.props;
    await campaignRequests.deleteCampaign(accessToken, campaignId).then((resp) => {
      if (resp.status === 204) {
        this.modalToggle();
        getCampaigns();
      } else {
        console.error('There was an error deleting the campaign, please try again later');
      }
    });
  };

  render() {
    const { campaign, userDbId } = this.props;

    return (
      <div className="CampaignCard">
        <MDBContainer>
          <MDBModal isOpen={this.state.deleteModal} toggle={this.modalToggle} centered backdrop={false} dark>
            <MDBModalHeader toggle={this.modalToggle}>Delete {campaign.title} ?</MDBModalHeader>
            <MDBModalBody>Are you sure you want to delete this campaign?</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn outline color="success" onClick={this.modalToggle} size="sm">
                Cancel
              </MDBBtn>
              <MDBBtn outline color="danger" onClick={this.deleteCampaign} size="sm">
                Delete
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
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
                <MDBBtn className="campaign-card-button" outline color="danger" onClick={this.modalToggle}>
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
