import React from 'react';
import { withAuth } from '@okta/okta-react';
import { MDBContainer, MDBCol, MDBRow, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import userRequests from '../../../helpers/data/userRequests';
import './CampaignForm.scss';
import campaignRequests from '../../../helpers/data/campaignRequests';

const defaultCampaign = {
  title: '',
  description: '',
  imageUrl: 'http://cdn.obsidianportal.com/map_images/52669/SwordCoast3.jpg',
};

class CampaignForm extends React.Component {
  state = {
    campaign: defaultCampaign,
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
    if (this.props.location.state !== undefined) {
      if (this.props.location.state.isEditing) {
        this.setState({
          campaign: this.props.location.state.campaign,
        });
      }
    }
  }

  formFieldStringState = (field, event) => {
    event.preventDefault();
    const tempCampaign = { ...this.state.campaign };
    tempCampaign[field] = event.target.value;
    this.setState({
      campaign: tempCampaign,
    });
  };

  campaignTitleChange = (event) => this.formFieldStringState('title', event);

  campaignDescriptionChange = (event) => this.formFieldStringState('description', event);

  campaignImageUrlChange = (event) => this.formFieldStringState('imageUrl', event);

  previousPage = () => {
    this.props.history.goBack();
  };

  campaignFormSubmit = async () => {
    const { campaign } = this.state;
    const dbRequestObj = await this.getDbUserRequestItems();
    campaign.ownerId = dbRequestObj.dbUid;

    if (this.props.location.state.isEditing) {
      console.log('Edit goes here');
    } else {
      campaignRequests
        .createCampaign(dbRequestObj.accessToken, campaign)
        .then((resp) => {
          console.log(resp);
          this.props.history.push('/campaigns');
        })
        .catch((error) => console.error('There was a problem creating your campaign', error));
    }
  };

  render() {
    const { campaign } = this.state;

    return (
      <div className="CampaignForm">
        <MDBContainer>
          <MDBRow>
            <MDBCol md="3" className="d-flex justify-content-center">
              <img src={campaign.imageUrl} className="img-thumbnail" alt="" />
            </MDBCol>
            <MDBCol>
              <MDBInput label="Title" icon="atlas" size="lg" value={campaign.title} onChange={this.campaignTitleChange} />
              <MDBInput label="Description" icon="dungeon" size="lg" value={campaign.description} onChange={this.campaignDescriptionChange} />
              <MDBInput label="Image URL" icon="image" size="lg" value={campaign.imageUrl} onChange={this.campaignImageUrlChange} />
              <MDBRow className="justify-content-around">
                <MDBBtn className="character-card-btn" outline color="info" onClick={this.previousPage}>
                  Go Back <MDBIcon className="character-card-btn-icon" fas="true" icon="arrow-circle-left" size="lg" />
                </MDBBtn>
                <MDBBtn className="character-card-btn" outline color="info" onClick={this.campaignFormSubmit}>
                  Save <MDBIcon className="character-card-btn-icon" far icon="save" size="lg" />
                </MDBBtn>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default withAuth(CampaignForm);
